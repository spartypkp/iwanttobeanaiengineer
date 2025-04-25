# Supabase Setup for Dave AI Assistant

This directory contains the database schema and setup instructions for Dave's Supabase backend.

## Overview

The Supabase backend for Dave provides:

1. **Vector Embeddings Storage** - For semantic search across all content
2. **Conversation History** - To track and reference past interactions
3. **Usage Analytics** - To monitor and improve Dave's performance
4. **Cached Responses** - For faster responses to common questions

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Note your project URL and API keys

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# OpenAI for embeddings
OPENAI_API_KEY=your-openai-key
```

### 3. Initialize the Database Schema

Run the SQL schema in the Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `schema.sql` from this directory
4. Paste into the SQL Editor and run

### 4. Set Up pgvector Extension

The schema will automatically try to enable the `vector` extension, but ensure it's available in your Supabase project:

1. Go to your Supabase project dashboard
2. Navigate to Database → Extensions
3. Find "vector" in the list and enable it

### 5. Install Required Dependencies

```bash
npm install @supabase/supabase-js openai
```

## Using the Database

### Generating and Storing Embeddings

For each content item from Sanity (projects, skills, etc.), you'll need to:

1. Extract the text content
2. Generate embeddings using OpenAI's API
3. Store the embeddings in the `content_embeddings` table

See the provided utility functions in `src/lib/embeddings.ts`.

### Semantic Search

Use the `match_documents` function for semantic search:

```sql
SELECT * FROM match_documents(
  '<your-query-embedding-vector>',
  0.7,   -- similarity threshold (0-1)
  10     -- max results
);
```

## Maintenance

- Regenerate embeddings when content is updated in Sanity
- Periodically clean up old conversation history
- Monitor the size of the embeddings table

## Security Considerations

- Use the service key only in server-side code
- Never expose your Supabase service key in client-side code
- Consider data retention policies for conversation history 