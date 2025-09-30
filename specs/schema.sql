-----------------------------------------------------------------------------
-- SIMPLIFIED CONTENT COPILOT SCHEMA
-- Single conversation type, messages table only, no refinement mode
-----------------------------------------------------------------------------

-----------------------------------------------------------------------------
-- Conversations Table - Stores conversation sessions
-----------------------------------------------------------------------------
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,                              -- Conversation title
  conversation_type TEXT NOT NULL          -- 'content-copilot' or 'dave'
    CHECK (conversation_type IN ('content-copilot', 'dave')),
  context JSONB,                           -- Conversation context
                                           -- For content-copilot:
                                           -- { "mode": "regular", "source": "sanity",
                                           --   "documentId": "123", "schemaType": "project",
                                           --   "documentTitle": "Project Name" }
  user_id TEXT,                            -- User identifier (optional)
  metadata JSONB,                          -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_type ON conversations(conversation_type);
CREATE INDEX idx_conversations_context ON conversations USING gin(context);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-----------------------------------------------------------------------------
-- Messages Table - ONLY source of truth for message history
-----------------------------------------------------------------------------
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  external_id TEXT,                        -- Vercel AI SDK message ID (message.id)
  role TEXT NOT NULL                       -- 'user', 'assistant', 'tool'
    CHECK (role IN ('system', 'user', 'assistant', 'tool')),
  content TEXT,                            -- Plain text content
  content_parts JSONB,                     -- Structured parts array from Vercel AI SDK
                                           -- [{type: 'text', text: '...'},
                                           --  {type: 'tool-call', toolCallId: '...', ...},
                                           --  {type: 'tool-result', ...}]
  metadata JSONB,                          -- Message metadata
  sequence INTEGER NOT NULL,               -- Message order in conversation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(conversation_id, sequence)        -- Ensure sequence is unique per conversation
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_sequence ON messages(conversation_id, sequence);
CREATE INDEX idx_messages_external_id ON messages(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-----------------------------------------------------------------------------
-- Helper function to auto-update updated_at on conversations
-----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_timestamp
AFTER INSERT OR UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();

-----------------------------------------------------------------------------
-- Example queries
-----------------------------------------------------------------------------

-- Get conversation with all messages
-- SELECT c.*,
--        json_agg(
--          json_build_object(
--            'id', m.external_id,
--            'role', m.role,
--            'content', m.content,
--            'parts', m.content_parts
--          ) ORDER BY m.sequence
--        ) as messages
-- FROM conversations c
-- LEFT JOIN messages m ON c.id = m.conversation_id
-- WHERE c.id = 'conversation-uuid'
-- GROUP BY c.id;

-- Get latest conversations for a document
-- SELECT c.id, c.title, c.updated_at, COUNT(m.id) as message_count
-- FROM conversations c
-- LEFT JOIN messages m ON c.id = m.conversation_id
-- WHERE c.context->>'documentId' = 'document-uuid'
--   AND c.conversation_type = 'content-copilot'
-- GROUP BY c.id
-- ORDER BY c.updated_at DESC;
