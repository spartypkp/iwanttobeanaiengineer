-----------------------------------------------------------------------------
-- Conversations Table - Stores conversation sessions
-----------------------------------------------------------------------------
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,                              -- Optional title/name of conversation
  conversation_type TEXT NOT NULL,         -- e.g., 'content-copilot', 'general-chat', 'code-assistant'
  context JSONB,                           -- Flexible storage for conversation context
                                           -- e.g., { "source": "sanity", "documentId": "123", "schemaType": "project" }
                                           -- or { "source": "website", "page": "/about" }
  user_id TEXT,                            -- User identifier (if applicable)
  system_prompt TEXT,                      -- The system prompt used for this conversation
  metadata JSONB,                          -- Additional arbitrary metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_type ON conversations(conversation_type);
CREATE INDEX idx_conversations_context ON conversations USING gin(context);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);

-----------------------------------------------------------------------------
-- Messages Table - Stores individual messages in conversations
-----------------------------------------------------------------------------
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  external_id TEXT,                        -- ID from external systems (e.g., Vercel AI SDK message ID)
  role TEXT NOT NULL,                      -- 'system', 'user', 'assistant', 'tool', etc.
  content TEXT,                            -- Text content of message
  content_parts JSONB,                     -- For structured content (images, tool calls, etc.)
  metadata JSONB,                          -- Message-specific metadata
  token_count INTEGER,                     -- Optional token count for analytics
  sequence INTEGER NOT NULL,               -- Message order in conversation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_sequence ON messages(conversation_id, sequence);

-----------------------------------------------------------------------------
-- Tool Calls Table - Tracks function/tool calls within conversations
-----------------------------------------------------------------------------
CREATE TABLE tool_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  tool_call_id TEXT NOT NULL,              -- ID used by the LLM for this tool call
  tool_name TEXT NOT NULL,                 -- Name of the tool/function called
  arguments JSONB NOT NULL,                -- Arguments passed to the tool
  result JSONB,                            -- Result returned by the tool
  is_error BOOLEAN DEFAULT FALSE,          -- Whether the tool call resulted in an error
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tool_calls_message_id ON tool_calls(message_id);

-----------------------------------------------------------------------------
-- Analytics Table - Tracks usage statistics for conversations
-----------------------------------------------------------------------------
CREATE TABLE conversation_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  prompt_tokens INTEGER DEFAULT 0,         -- Input tokens used
  completion_tokens INTEGER DEFAULT 0,     -- Output tokens generated
  total_tokens INTEGER DEFAULT 0,          -- Total tokens for the conversation
  duration_ms INTEGER,                     -- Duration of conversation in milliseconds
  message_count INTEGER DEFAULT 0,         -- Number of messages in conversation
  tool_call_count INTEGER DEFAULT 0,       -- Number of tool calls in conversation
  model_used TEXT,                         -- Model identifier (e.g., 'claude-3-7-sonnet')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_conversation_id ON conversation_analytics(conversation_id);