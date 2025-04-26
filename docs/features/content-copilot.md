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
   - Modern chat interface with message bubbles and avatars
   - Markdown support for rich content display
   - Interactive elements for common actions
   - Typing indicators and visual feedback

### 2.2 Implementation Architecture

```
Sanity Studio
└── Document Editor
    ├── Form View (standard)
    └── AI Assistant View (Content Copilot)
        └── ContentCopilotView Component
            ├── Message History with Markdown Support
            ├── Typing Indicators
            └── Auto-expanding Input Field + AI Streaming
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

### 4.1 Enhanced Chat UI Component

The Content Copilot now features a modern, responsive chat interface:

```typescript
// src/components/dave-admin/sanity/ContentCopilotView.tsx
import { useChat } from '@ai-sdk/react';
import { Avatar, Badge, Box, Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

export const ContentCopilotView = (props: CustomSanityComponentProps) => {
  // State and hooks...
  
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: '/api/content-copilot',
    body: {
      documentData: document.displayed,
      schemaType,
      documentId,
      conversationId,
    },
    onResponse: (response) => {
      // Show typing indicator while generating response
      setIsTyping(true);
      
      // Extract conversation ID from headers if available
      const newConversationId = response.headers.get('X-Conversation-Id');
      if (newConversationId) {
        setConversationId(newConversationId);
      }
    },
    onFinish: () => {
      // Hide typing indicator when response is complete
      setIsTyping(false);
    }
  });
  
  // Component implementation...
};
```

### 4.2 Key UI Features

1. **Modern Chat Interface**
   - Message bubbles with avatars
   - Visual distinction between user and AI messages
   - Empty state with suggested actions
   - Typing indicator animation
   - Auto-growing text input

2. **Rich Content Support**
   - Markdown rendering for AI responses
   - Code block formatting
   - Lists and formatting preserved
   - Syntax highlighting

3. **Improved UX**
   - Real-time typing indicator
   - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
   - Responsive layout
   - Visual feedback for actions

4. **Error Handling**
   - Improved error states
   - Retry mechanisms
   - Clear error messaging

### 4.3 Backend API Route

The Content Copilot API route manages conversation state and AI interaction:

```typescript
// src/app/api/content-copilot/route.ts
export async function POST(req: Request) {
  const { messages, body } = await req.json();
  
  // Initialize Supabase client
  const supabase = await createClient();
  
  // Create or retrieve conversation session
  let sessionId = getOrCreateConversationSession(...);
  
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
  
  // Add conversation ID to response headers
  const response = await stream.toDataStreamResponse();
  
  return new Response(response.body, {
    headers: {
      ...Object.fromEntries(response.headers),
      'X-Conversation-Id': sessionId
    }
  });
}
```

## 5. Implementation Status

### Completed
- ✅ Custom document view implementation
- ✅ Integration with Sanity Studio
- ✅ Modern chat UI with markdown support
- ✅ Typing indicators and visual feedback
- ✅ Conversation history persistence
- ✅ Document-to-conversation session mapping
- ✅ Message loading when switching documents

### In Progress
- 🔄 Enhanced extraction of field values from conversations
- 🔄 Tool implementation for document updates

### Pending
- ⏳ Analytics dashboard for usage metrics
- ⏳ Advanced document analysis features

## 6. Next Steps

### 6.1 Content Tools Integration

1. **Field Update Tools**
   - Implement tools for updating specific document fields
   - Add change visualization
   - Develop field validation

2. **Content Analysis**
   - Implement document structure analysis
   - Add content quality suggestions
   - Create SEO optimization tools

### 6.2 UI/UX Refinements

1. **Mobile Optimization**
   - Ensure full responsiveness on mobile devices
   - Optimize touch interactions
   - Test on various screen sizes

2. **Accessibility Improvements**
   - Enhance keyboard navigation
   - Add screen reader support
   - Implement accessibility best practices

3. **Theme Support**
   - Ensure dark/light mode compatibility
   - Respect user theme preferences
   - Implement consistent styling

## 7. Conclusion

The Content Copilot feature has evolved into a polished, user-friendly interface for AI-assisted content creation in Sanity Studio. The new UI provides a modern chat experience with rich content support, typing indicators, and improved visual feedback. The backend architecture ensures robust conversation persistence and document context management.

With the foundational UI and conversation management in place, future development will focus on implementing document field tools to extract and update content automatically. This will further streamline the content creation process and make the Content Copilot an even more powerful assistant for content management. 