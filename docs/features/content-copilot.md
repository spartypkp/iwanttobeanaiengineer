# Content Copilot Feature

## 1. Overview

Content Copilot is an admin-only feature designed to streamline content creation and editing through AI-assisted conversation. It enables administrators to interact with Dave (the AI assistant) to create or modify any content type in the Sanity CMS without directly manipulating form fields. The system extracts structured information from natural conversations, making content management more intuitive and efficient.

### Core Concept
Administrators engage in natural conversation about content and the AI automatically extracts relevant information and updates the CMS accordingly. This approach offers a more human-centered way to manage content compared to traditional form-based interfaces.

> **Note:** Content Copilot is distinct from the public-facing Dave chat interface at `src/app/dave/page.tsx`, which allows site visitors to ask about Will's skills and experience.

## 2. Architectural Implementation

We've successfully implemented the Content Copilot as a custom document view within Sanity Studio. This approach provides seamless integration with the existing CMS while maintaining the AI-first conversational approach to content editing.

### 2.1 Custom Document View Implementation

The Content Copilot has been implemented as a tab in Sanity Studio's document editor alongside the standard form view:

1. **Document Context**
   - The AI assistant has direct access to the document being edited
   - Document state is managed by Sanity Studio
   - Changes are applied directly to the document via Sanity's patch operations

2. **Native Integration**
   - Appears as a tab alongside the standard form editor
   - Uses Sanity Studio's component library for consistent styling
   - Maintains document context between views

3. **Conversation Focus**
   - UI focuses solely on the conversational aspect
   - Field extraction happens automatically during conversation
   - Changes are applied directly to the document

### 2.2 Implementation Architecture

```
Sanity Studio
└── Document Editor
    ├── Form View (standard)
    └── AI Assistant View (Content Copilot)
        └── ContentCopilotView Component
            ├── Message History
            ├── Typing Indicators
            └── Input Field + AI Streaming
```

### 2.3 Backend Architecture

```
Client                                     Server
┌────────────────┐                      ┌─────────────────┐
│ContentCopilotView│ ──API Request─────>│ content-copilot │
│  (Sanity View)  │                      │   API Route     │
└────────────────┘ <──AI Stream────────┘─────────────────┘
       │                                        │
       │                                        │
       │                                        ▼
       │                               ┌─────────────────┐
       │                               │    Claude AI    │
       │                               │  (Anthropic)    │
       │                               └─────────────────┘
       │                                        │
       │                                        │
       ▼                                        ▼
┌────────────────┐                      ┌─────────────────┐
│  Sanity CMS    │                      │    Supabase     │
│  Document      │                      │  Conversation   │
│  Storage       │                      │  Storage        │
└────────────────┘                      └─────────────────┘
```

## 3. Data Storage Architecture

We've implemented a robust database schema in Supabase to store and manage conversations in a flexible, future-proof way:

### 3.1 Conversation Storage Schema

```
┌─────────────────────┐       ┌───────────────────┐
│    conversations    │       │     messages      │
├─────────────────────┤       ├───────────────────┤
│ id                  │       │ id                │
│ title               │       │ conversation_id   │
│ conversation_type   │ 1───n │ external_id       │
│ context (JSONB)     │       │ role              │
│ system_prompt       │       │ content           │
│ metadata            │       │ content_parts     │
│ created_at          │       │ sequence          │
│ updated_at          │       │ created_at        │
└─────────────────────┘       └───────────────────┘
         │                             │
         │                             │
         │                             │
         │                    ┌────────┴────────┐
         │                    │                 │
         │                    ▼                 ▼
┌────────▼─────────┐  ┌─────────────┐  ┌───────────────┐
│ conversation_    │  │ tool_calls  │  │ conversation_ │
│ analytics        │  │             │  │ tags          │
└──────────────────┘  └─────────────┘  └───────────────┘
```

### 3.2 Key Schema Features

1. **Generic Conversation Design**
   - Supports multiple conversation types beyond just content-copilot
   - Flexible JSONB context field can store any document reference
   - Message structure aligned with Vercel AI SDK format

2. **Tool Call Tracking**
   - Dedicated structure for tracking function/tool calls
   - Captures arguments and results for analysis

3. **Analytics Support**
   - Token usage tracking
   - Conversation metrics
   - Performance analysis capabilities

## 4. Technical Implementation

### 4.1 Custom Document View Component

The Content Copilot is now implemented as a single consolidated component:

```typescript
// src/components/dave-admin/sanity/ContentCopilotView.tsx
import { useChat } from '@ai-sdk/react';
import { Box, Card, Spinner, Stack, Text } from '@sanity/ui';
import { useEffect, useRef, useState } from 'react';
import { useDocumentOperation, useSchema } from 'sanity';
import { useDocumentPatcher } from '../../../lib/document-utils';

interface CustomSanityComponentProps {
  document: {
    published?: Record<string, any> | null;
    draft?: Record<string, any> | null;
    displayed: Record<string, any>;
    historical?: Record<string, any> | null;
  };
  documentId: string;
  schemaType: string;
}

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
  const { document, documentId, schemaType } = props;
  
  // AI SDK chat integration
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: '/api/content-copilot',
    body: {
      documentData: document.displayed,
      schemaType,
      documentId,
    },
  });
  
  // Component implementation...
};
```

### 4.2 API Route

The Content Copilot API route manages conversation state and AI interaction:

```typescript
// src/app/api/content-copilot/route.ts
import { createClient } from '@/lib/utils/supabase/server';
import { anthropic } from '@ai-sdk/anthropic';
import { Message, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, body } = await req.json();
  const { documentId, schemaType } = body;

  // Initialize Supabase client
  const supabase = await createClient();

  // Manage conversation session
  let sessionId = await getOrCreateConversationSession(supabase, documentId, schemaType);

  // Stream response from AI model
  const stream = streamText({
    model: anthropic('claude-3-7-sonnet-latest'),
    system: generateSystemPrompt(body),
    messages,
    tools: {},
    onFinish: async (result) => {
      // Save conversation to database
      await saveConversation(supabase, sessionId, messages, result.text);
    }
  });

  return stream.toDataStreamResponse();
}
```

### 4.3. Conversation Management

Conversation state is persisted using the Supabase client:

```typescript
// Helper function to save conversation to Supabase
async function saveConversation(supabase, sessionId, userMessage, assistantResponse) {
  const userMsg = messages[messages.length - 1];
  
  if (userMsg && userMsg.role === 'user') {
    await supabase.from('messages').insert({
      conversation_id: sessionId,
      external_id: userMsg.id,
      role: 'user',
      content: userMsg.content,
      sequence: getNextSequence()
    });
  
    await supabase.from('messages').insert({
      conversation_id: sessionId,
      external_id: generateId(),
      role: 'assistant',
      content: assistantResponse,
      sequence: getNextSequence() + 1
    });
  }
}
```

## 5. Implementation Status

### Completed
- ✅ Custom document view implementation
- ✅ Integration with Sanity Studio
- ✅ Basic AI conversation functionality
- ✅ Supabase schema design for conversation storage
- ✅ API route for handling messages

### In Progress
- 🔄 Conversation history persistence
- 🔄 Document-to-conversation session mapping
- 🔄 Message loading when switching documents

### Pending
- ⏳ Conversation switching between documents
- ⏳ Enhanced extraction of field values from conversations
- ⏳ Tool implementation for document updates
- ⏳ UI refinements and loading states

## 6. Next Steps

### 6.1 Frontend Conversation Management

1. **Document-Based Conversation Loading**
   - Implement loading of conversation history when opening a document
   - Create utilities to fetch conversation history by document ID
   - Add conversation reset/new conversation functionality

2. **Session Management**
   - Implement conversation ID tracking per document
   - Create UI for viewing conversation history
   - Add conversation metadata display

### 6.2 AI Enhancement

1. **Improved Context Integration**
   - Enhance system prompts with document-specific information
   - Add document schema details to AI context
   - Implement field validation information in prompts

2. **Tool Implementation**
   - Create function calling tools for field updates
   - Implement field extraction tools
   - Add document analysis capabilities

### 6.3 UI Refinements

1. **Conversation Experience**
   - Add typing indicators
   - Improve message rendering
   - Implement markdown support

2. **Feedback Mechanisms**
   - Add visual indicators for field updates
   - Create success/error notifications
   - Implement undo functionality

## 7. Conclusion

The Content Copilot feature has made significant progress with the implementation of a custom document view in Sanity Studio and a robust conversation storage architecture in Supabase. The current implementation provides a solid foundation for AI-assisted content editing, with a clear path forward for enhancing functionality and user experience.

The next phase of development will focus on improving conversation management, particularly when switching between documents, and enhancing the AI's ability to extract and update field values based on natural conversation. These improvements will further streamline the content creation process and make the Content Copilot an essential tool for efficient content management. 