-- Schema for Dave AI Assistant
-- This schema defines the PostgreSQL tables required for Dave's functionality

-- Enable the pgvector extension for embeddings-based search
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-----------------------------------------------------------------------------
-- Conversations Table - Stores user interactions with Dave
-----------------------------------------------------------------------------
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  tools_used JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying conversations by session
CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-----------------------------------------------------------------------------
-- Conversation Sessions Table - Groups related conversations
-----------------------------------------------------------------------------
CREATE TABLE conversation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-----------------------------------------------------------------------------
-- Content Embeddings Table - Vectorized content for semantic search
-----------------------------------------------------------------------------
CREATE TABLE content_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL,  -- 'project', 'skill', 'knowledge', 'work_history'
  content_id TEXT NOT NULL,    -- ID from the source system (Sanity)
  content TEXT NOT NULL,       -- The actual text content that was embedded
  embedding VECTOR(1536),      -- For OpenAI embeddings
  metadata JSONB,              -- Additional context about the content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for content embeddings
CREATE INDEX idx_content_embeddings_type_id ON content_embeddings(content_type, content_id);
-- Vector similarity search index (HNSW for efficient approximate nearest neighbor search)
CREATE INDEX idx_content_embeddings_vector ON content_embeddings USING ivfflat (embedding vector_cosine_ops);

-----------------------------------------------------------------------------
-- Usage Analytics Table - Track Dave's usage
-----------------------------------------------------------------------------
CREATE TABLE dave_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES conversation_sessions(id),
  query_type TEXT NOT NULL,    -- 'skill', 'project', 'general', etc.
  query_text TEXT NOT NULL,    -- The actual query
  response_time_ms INTEGER,    -- Response time in milliseconds
  tools_used JSONB,            -- Tools used to answer
  success BOOLEAN,             -- Whether the query was answered successfully
  feedback JSONB,              -- User feedback if any
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dave_analytics_query_type ON dave_analytics(query_type);
CREATE INDEX idx_dave_analytics_created_at ON dave_analytics(created_at);

-----------------------------------------------------------------------------
-- Cached Responses Table - Store frequently asked questions
-----------------------------------------------------------------------------
CREATE TABLE cached_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_hash TEXT UNIQUE NOT NULL,  -- Hash of the query for quick lookup
  query_text TEXT NOT NULL,         -- Original query text
  response TEXT NOT NULL,           -- Cached response
  popularity INTEGER DEFAULT 1,     -- How many times this has been requested
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE   -- When this cache entry expires
);

CREATE INDEX idx_cached_responses_query_hash ON cached_responses(query_hash);
CREATE INDEX idx_cached_responses_popularity ON cached_responses(popularity DESC);

-----------------------------------------------------------------------------
-- Helper function for semantic search
-----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content_type TEXT,
  content_id TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    content_embeddings.id,
    content_embeddings.content_type,
    content_embeddings.content_id,
    content_embeddings.content,
    1 - (content_embeddings.embedding <=> query_embedding) AS similarity
  FROM content_embeddings
  WHERE 1 - (content_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$; 