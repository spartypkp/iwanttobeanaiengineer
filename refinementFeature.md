# Content Copilot Refinement Mode - Implementation Plan

## Overview

This document outlines a detailed implementation plan for adding a "Refinement Mode" to the Content Copilot feature. This mode will allow users to start a fresh conversation focused on refining and improving content that has already been substantially created, without losing the previous conversation history.

## Current System Analysis

### Database Structure

The current conversation system uses a Supabase PostgreSQL database with these key tables:

- **`conversations`** - Stores conversation metadata and context
- **`messages`** - Contains individual messages in each conversation
- **`tool_calls`** - Records function calls made during conversations

The conversation context currently ties a conversation directly to a Sanity document via its `documentId`, but there is no relationship between multiple conversations about the same document.

3
### Current Conversation Flow

The regular conversation flow (in `/api/content-copilot/regular/route.ts`):
1. Receives a request with document context and messages
2. Creates a new conversation or continues an existing one
3. Generates a system prompt using `generateContentCopilotSystemPrompt()`
4. Processes messages through Claude 3.7 Sonnet via AI SDK
5. Stores messages and tool calls in the database

## Implementation Approach: Linked Conversations Model

We will implement a linked conversations model where:
- Each document can have multiple conversations (initial and refinements)
- Refinement conversations reference their parent conversation
- Each conversation maintains its own context and message history
- Users can switch between modes/conversations

## Detailed Implementation Plan

### 1. Database Schema Changes [DONE]

**File: `/src/lib/utils/supabase/schema.sql`**

```sql
-- Add parent_conversation_id to conversations table
ALTER TABLE conversations 
ADD COLUMN parent_conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL;

-- Add refinement_type column to support different refinement focuses
ADD COLUMN refinement_type TEXT;

-- Add an index for faster lookups
CREATE INDEX idx_conversations_parent_id ON conversations(parent_conversation_id);
```

### 2. TypeScript Types

**File: `/src/types/conversation.ts`** (Create new file)

Define types for the updated conversation system:

```typescript
export type ConversationMode = 'initial' | 'refinement';
export type RefinementType = 'general' | 'technical' | 'narrative' | 'seo' | 'voice';

export interface Conversation {
  id: string;
  title: string;
  conversation_type: string;
  context: {
    documentId: string;
    schemaType: string;
    mode?: ConversationMode;
    refinementType?: RefinementType;
    [key: string]: any;
  };
  parent_conversation_id?: string;
  refinement_type?: RefinementType;
  system_prompt: string;
  created_at: string;
  updated_at: string;
}
```

### 3. API Route Implementation

**File: `/src/app/api/content-copilot/refinement/route.ts`** (Create new file)

Create the refinement API route by copying and modifying the regular route:

```typescript
// Import necessary dependencies
import { generateContentCopilotRefinementPrompt } from '@/lib/prompts';
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { createClient } from '@/lib/utils/supabase/server';
import { availableTools } from '../regular/route'; // Reuse tools from regular route

// Define request interface
interface RefinementCopilotRequest {
  id?: string;
  messages: Message[];
  documentId: string;
  conversationId: string | null;
  parentConversationId: string | null;
  refinementType: string;
  schemaType: string;
  serializableSchema: SerializableSchema;
  documentData: Record<string, any>;
}

export async function POST(req: Request) {
  // Parse the request body
  const requestData: RefinementCopilotRequest = await req.json();
  
  const {
    messages,
    documentId,
    conversationId,
    parentConversationId,
    refinementType = 'general',
    schemaType,
    serializableSchema,
    documentData
  } = requestData;

  // Initialize Supabase client
  const supabase = await createClient();

  let sessionId: string;

  // Use existing conversation ID if provided
  if (conversationId) {
    sessionId = conversationId;
    // Update the conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  } else {
    // Create a new refinement conversation with parent reference
    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        title: `${documentData.title || 'Document'} - ${capitalizeFirstLetter(refinementType)} Refinement`,
        conversation_type: 'content-copilot-refinement',
        context: {
          source: 'sanity',
          documentId,
          schemaType,
          documentTitle: documentData.title || 'Untitled',
          mode: 'refinement',
          refinementType
        },
        parent_conversation_id: parentConversationId,
        refinement_type: refinementType,
        system_prompt: generateContentCopilotRefinementPrompt({
          documentId,
          schemaType,
          documentData,
          serializableSchema,
          refinementType
        })
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create refinement conversation:', error);
      return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    sessionId = newConversation.id;
  }

  // Save user message to database
  // Rest of processing similar to regular route with refinement prompt
  // ...

  // Return stream response with conversation ID header
}

// Helper function to capitalize refinement type
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
```

### 4. Conversation Management API Enhancement

**File: `/src/app/api/conversation/get/route.ts`**

Update the route to include parent-child relationships:

```typescript
// Enhance the get conversations route to include relationship data
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');
  
  if (!documentId) {
    return new Response(JSON.stringify({ error: 'Document ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const supabase = await createClient();
  
  // Get initial conversation (without parent_conversation_id)
  const { data: initialConversation, error: initialError } = await supabase
    .from('conversations')
    .select('*')
    .eq('context->documentId', documentId)
    .is('parent_conversation_id', null)
    .eq('conversation_type', 'content-copilot')
    .order('created_at', { ascending: true })
    .limit(1)
    .single();
    
  // Get refinement conversations (with parent_conversation_id)
  const { data: refinementConversations, error: refinementError } = await supabase
    .from('conversations')
    .select('*')
    .eq('context->documentId', documentId)
    .eq('conversation_type', 'content-copilot-refinement')
    .order('created_at', { ascending: false });
  
  return new Response(JSON.stringify({
    initial: initialConversation || null,
    refinements: refinementConversations || []
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 5. System Prompt for Refinement Mode

**File: `/src/lib/prompts.ts`**

Add a new function for generating the refinement mode system prompt:

```typescript
// Generate refinement-specific system prompt
export function generateContentCopilotRefinementPrompt(params: {
  documentId: string;
  schemaType: string;
  documentData: Record<string, any>;
  serializableSchema: SerializableSchema;
  refinementType?: string;
}): string {
  const { documentId, schemaType, documentData, serializableSchema, refinementType = 'general' } = params;

  // Format the schema directly from the serializable schema
  const schemaFieldsDescription = formatSerializableSchemaForPrompt(serializableSchema);
  const documentTitle = documentData.title || documentData.name || `Untitled ${schemaType}`;

  // Different focuses based on refinement type
  const refinementFocus = getRefinementFocus(refinementType);

  return `
<identity>
You are Dave, Will Diamond's personal AI assistant. You help Will refine and improve content for his personal website and portfolio.
</identity>

<context>
You are operating in 'Content Copilot Refinement Mode' within Sanity Studio. The document you're helping with already has substantial content, and your role is to help refine and improve this content rather than creating content from scratch. This is a fresh conversation specifically focused on refinement.
</context>

<refinement_purpose>
Your primary purpose in refinement mode is to:
1. Analyze the existing content for areas of improvement
2. Help enhance the quality, clarity, and impact of the content
3. Identify and fix inconsistencies, redundancies, or gaps
4. Improve the narrative flow and voice consistency
5. Enhance technical precision and accuracy
6. Focus on ${refinementFocus.description}
</refinement_purpose>

<document_info>
You are currently refining a Sanity document of type: ${schemaType}
  Document ID: ${documentId}
  Document Title: ${documentTitle}
  Refinement Focus: ${refinementFocus.title}

  Current document data:
  ${JSON.stringify(documentData, null, 2)}
</document_info>

<document_schema>
${schemaFieldsDescription}
</document_schema>

<refinement_strategies>
${refinementFocus.strategies}
</refinement_strategies>

<refinement_conversation_flow>
1. Begin by analyzing the current state of the document
2. Identify 3-5 specific areas for improvement based on the refinement focus
3. Discuss each area thoughtfully, suggesting specific enhancements
4. Use tools to implement agreed-upon improvements directly
5. Verify the impact of changes and seek feedback
6. Move systematically through the document, focusing on high-impact improvements first

Unlike initial content creation:
- Focus on quality improvement rather than basic information gathering
- Assume the core information exists and needs refinement rather than creation
- Be more directive in suggesting specific improvements
- Use more precise, targeted questions rather than open-ended exploration
</refinement_conversation_flow>
`;
}

// Helper function to get refinement focus details
function getRefinementFocus(refinementType: string = 'general') {
  const focuses = {
    general: {
      title: 'General Refinement',
      description: 'overall improvement of quality, clarity, and impact',
      strategies: `
<general_refinement_strategies>
- Identify and eliminate redundant information
- Enhance clarity of explanations
- Improve structure and organization
- Strengthen impact statements and key points
- Ensure all required fields have high-quality content
- Balance technical detail with accessibility
- Check for consistent terminology and phrasing
</general_refinement_strategies>
      `
    },
    // Add other refinement focus types here...
  };
  
  return focuses[refinementType as keyof typeof focuses] || focuses.general;
}
```

### 6. Frontend Components

**File: `/src/components/content-copilot/ContentCopilotView.tsx`**

Update the main Content Copilot component to support refinement mode:

```typescript
// Add imports
import { useState, useCallback } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { RefinementModeSelector } from './RefinementModeSelector';
import { ConversationSwitcher } from './ConversationSwitcher';

// Add state for refinement mode
const [mode, setMode] = useState<'initial' | 'refinement'>('initial');
const [refinementType, setRefinementType] = useState<string>('general');
const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
const [parentConversationId, setParentConversationId] = useState<string | null>(null);

// Use the conversations hook to fetch related conversations
const { conversations, isLoading: isLoadingConversations } = useConversations(documentId);

// Function to start a new refinement conversation
const startRefinementMode = useCallback((type: string = 'general') => {
  setParentConversationId(currentConversationId);
  setCurrentConversationId(null);
  setMode('refinement');
  setRefinementType(type);
  setMessages([]);
}, [currentConversationId]);

// Update the fetch function to use the correct API route based on mode
const fetchChatResponse = async (userMessage: string) => {
  // Determine API endpoint based on mode
  const apiEndpoint = mode === 'initial' 
    ? '/api/content-copilot/regular' 
    : '/api/content-copilot/refinement';
    
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [...messages, { role: 'user', content: userMessage }],
      documentId,
      conversationId: currentConversationId,
      parentConversationId: mode === 'refinement' ? parentConversationId : null,
      refinementType: mode === 'refinement' ? refinementType : undefined,
      schemaType,
      serializableSchema,
      documentData,
    }),
  });
  
  // Extract conversation ID from headers
  const conversationId = response.headers.get('X-Conversation-Id');
  if (conversationId) {
    setCurrentConversationId(conversationId);
  }
  
  // Rest of the processing remains similar...
};
```

**File: `/src/components/content-copilot/RefinementModeSelector.tsx`** (Create new file)

Create a component for selecting refinement mode and type.

**File: `/src/components/content-copilot/ConversationSwitcher.tsx`** (Create new file)

Create a component for switching between conversations.

### 7. Conversation Data Hook

**File: `/src/hooks/useConversations.ts`** (Create new file)

Create a hook for fetching and managing conversations:

```typescript
import { useState, useEffect } from 'react';

export function useConversations(documentId: string) {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/conversation/get?documentId=${documentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data: ConversationsResponse = await response.json();
        
        // Combine initial and refinement conversations into a single array
        const allConversations = [
          ...(data.initial ? [data.initial] : []),
          ...(data.refinements || [])
        ];
        
        setConversations(allConversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }
    
    if (documentId) {
      fetchConversations();
    }
  }, [documentId]);
  
  return { conversations, isLoading, error };
}
```

### 8. Implementation Plan

1. **Phase 1: Refinement API Endpoint** 
   - Create `/api/content-copilot/refinement/route.ts` based on the regular route
   - Implement refinement-specific processing logic
   - Use parent conversation ID handling
   - Integrate the refinement system prompt

2. **Phase 2: Component Enhancements**
   - Update `ContentCopilotView.tsx` with mode selection
   - Create the refinement selector component
   - Implement conversation switching
   - Add visual indicators for different modes

3. **Phase 3: Conversation Management**
   - Update the conversation retrieval API
   - Implement the conversations hook
   - Add support for fetching conversation histories with relationships

4. **Phase 4: Testing and Deployment**
   - Test the full refinement workflow
   - Validate conversation linking
   - Check the effectiveness of different refinement focuses
   - Ensure seamless transition between modes

## Conclusion

This implementation plan leverages the new code organization to create a clean separation between initial content creation and refinement modes. By using dedicated API routes and maintaining linked conversation relationships, the system enables a powerful content improvement workflow while preserving the context of the initial content creation process. 