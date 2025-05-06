# Improved Sanity Tools

This document captures our brainstorming and design for enhanced Sanity CMS tools that provide better functionality and error reporting for AI-assisted content management.

## Motivation

The existing Sanity tools had several limitations:

- **Fragmented Operations**: Separate tools for different operations (write, add to array, remove from array)
- **Limited Path Handling**: Difficulty working with nested objects and complex array operations
- **Poor Error Feedback**: LLM has limited understanding of failures or successes
- **Inconsistent Interface**: Different patterns for different operations

Our goal is to create a set of primitive, powerful tools that:

1. Are **intuitive for LLMs** to understand and use correctly
2. Cover **all common operations** with a minimal set of tools
3. Provide **rich feedback** about successes and failures
4. Allow for **precise targeting** of document structure at any depth

## Core Design: Four Primitive Tools

We've designed four core primitive tools:

1. **`writeTool`**: Write any value to any path
2. **`deleteTool`**: Delete any value at any path
3. **`arrayTool`**: Perform any array operation (append, prepend, insert, remove, replace)
4. **`queryTool`**: Find documents to operate on

### Design Principles

- **Path-based**: All tools operate on paths, enabling precise document manipulation
- **Primitive but powerful**: Basic operations that can be combined for complex manipulations
- **Consistent interface**: Similar parameters and return structures
- **Rich feedback**: Detailed success and error information

## Implementation Overview

### Helper Functions

These backend utility functions provide the core functionality:

```typescript
// Write any value to any path
export async function writeToPath(
  documentId: string,
  path: string,
  value: any,
  createIfMissing: boolean = true
): Promise<WriteResult>;

// Delete any value at any path
export async function deleteFromPath(
  documentId: string,
  path: string
): Promise<DeleteResult>;

// Perform operations on arrays
export async function performArrayOperation(
  documentId: string,
  path: string,
  operation: 'append' | 'prepend' | 'insert' | 'remove' | 'replace',
  items: any[] = [],
  at?: number | string,
  position?: 'before' | 'after' | 'replace'
): Promise<ArrayResult>;

// Enhanced query function
export async function queryDocuments(
  options: {
    type?: string;
    id?: string;
    field?: string;
    value?: any;
    limit?: number;
    groq?: string;
    projection?: string;
  }
): Promise<QueryResult>;
```

### Tool Interfaces

These are the AI tools exposed to the LLM:

```typescript
// Write tool
export const writeTool = tool({
  description: 'Write/set a value at any path in a Sanity document. Handles simple fields, nested objects, and array items.',
  parameters: z.object({
    documentId: z.string().describe('The Sanity document ID'),
    path: z.string().describe('Path to the field (e.g., "title", "content.blocks[0].text", "metadata.tags[_key==\"abc123\"].value")'),
    value: z.any().describe('The value to set at the specified path'),
    createIfMissing: z.boolean().optional().describe('Create parent objects/arrays if they don\'t exist (default: true)')
  }),
  execute: async ({ documentId, path, value, createIfMissing = true }, { toolCallId }) => {
    // Implementation details...
  }
});

// Delete tool
export const deleteTool = tool({
  description: 'Delete/unset a value at any path in a Sanity document.',
  parameters: z.object({
    documentId: z.string().describe('The Sanity document ID'),
    path: z.string().describe('Path to delete (e.g., "title", "content.blocks[0]", "tags[_key==\"abc123\"]")')
  }),
  execute: async ({ documentId, path }, { toolCallId }) => {
    // Implementation details...
  }
});

// Array tool
export const arrayTool = tool({
  description: 'Perform operations on arrays in a Sanity document - add, remove, or replace items.',
  parameters: z.object({
    documentId: z.string().describe('The Sanity document ID'),
    path: z.string().describe('Path to the array (e.g., "tags", "content.blocks")'),
    operation: z.enum(['append', 'prepend', 'insert', 'remove', 'replace']).describe('The operation to perform on the array'),
    items: z.array(z.any()).optional().describe('Items to add/insert/replace (required for append, prepend, insert, replace)'),
    at: z.union([
      z.number().describe('Index position for insert/replace/remove operations'),
      z.string().describe('Key (_key value) for insert/replace/remove operations in keyed arrays')
    ]).optional().describe('Position or key where to perform the operation (required for insert, replace, remove)'),
    position: z.enum(['before', 'after', 'replace']).optional()
      .describe('Position for insert operations - before/after the specified index or key (default: after)')
  }),
  execute: async ({ documentId, path, operation, items = [], at, position }, { toolCallId }) => {
    // Implementation details...
  }
});

// Query tool
export const queryTool = tool({
  description: 'Query Sanity documents using simple criteria or full GROQ syntax.',
  parameters: z.object({
    type: z.string().optional().describe('Filter by document type'),
    id: z.string().optional().describe('Find document by ID'),
    field: z.string().optional().describe('Filter by a specific field value'),
    value: z.any().optional().describe('Value to match for the field'),
    limit: z.number().optional().describe('Maximum number of results (default: 10)'),
    groq: z.string().optional().describe('Custom GROQ query (overrides other parameters)'),
    projection: z.string().optional().describe('Fields to include in results (e.g., "title,description,_id" or "*")')
  }),
  execute: async ({ type, id, field, value, limit = 10, groq, projection = '*' }, { toolCallId }) => {
    // Implementation details...
  }
});
```

## Enhanced Error Handling and Feedback

### Tool Response Format

All tools return a consistent response format:

```typescript
// Success responses
{
  success: true,
  operation: "write" | "delete" | "array" | "query",
  // Operation-specific success details...
}

// Error responses
{
  success: false,
  operation: "write" | "delete" | "array" | "query",
  errorType: string,         // Categorized error type
  errorMessage: string,      // Human-readable error message
  suggestion: string         // Suggested fix or alternative
}
```

### Operation-Specific Success Responses

#### Write Tool Success
```typescript
{
  success: true,
  operation: "write",
  path: "timeline.status",
  previousValue: "in-progress", // This helps the LLM understand what changed
  newValue: "completed",
  details: "Updated field 'timeline.status' from 'in-progress' to 'completed'"
}
```

#### Delete Tool Success
```typescript
{
  success: true,
  operation: "delete",
  path: "tags[2]",
  deletedValue: "typescript", // Show what was removed
  details: "Successfully removed 'typescript' from position 2 in tags array"
}
```

#### Array Tool Success
```typescript
{
  success: true,
  operation: "array", 
  arrayOperation: "append",
  path: "technologies",
  itemsAffected: 1,
  arrayLength: 5, // After operation
  details: "Added 1 item to the 'technologies' array, new length: 5"
}
```

#### Query Tool Success
```typescript
{
  success: true,
  operation: "query",
  count: 3,
  queryDetails: {
    type: "project",
    filterField: "status",
    filterValue: "active"
  },
  results: [...], 
  // Maybe add pagination info
  pagination: {
    hasMore: true,
    currentPage: 1,
    totalMatches: 15
  }
}
```

### Error Classification

We classify errors to help the LLM understand what went wrong:

```typescript
// Some common error types
const errorTypes = {
  DOCUMENT_NOT_FOUND: "The specified document does not exist",
  PATH_NOT_FOUND: "The path does not exist in the document",
  VALIDATION_ERROR: "The value does not match schema requirements",
  PERMISSION_DENIED: "Insufficient permissions for this operation",
  ITEM_NOT_FOUND: "The specified array item was not found",
  INVALID_ARRAY: "The path exists but is not an array",
  INVALID_OPERATION: "The operation is not valid for this path",
  NETWORK_ERROR: "Connection to Sanity failed",
  UNKNOWN_ERROR: "An unknown error occurred"
};
```

## Example Usage for LLM

```typescript
// Writing to a simple field
await write({
  documentId: "project-123",
  path: "title",
  value: "New Project Title"
});

// Writing to a nested field with path creation
await write({
  documentId: "project-123",
  path: "metadata.seo.description",
  value: "SEO description for the project",
  createIfMissing: true
});

// Deleting a field
await delete({
  documentId: "project-123",
  path: "deprecated_field"
});

// Adding to an array
await array({
  documentId: "project-123",
  path: "technologies",
  operation: "append",
  items: ["React", "TypeScript"]
});

// Removing an array item by index
await array({
  documentId: "project-123",
  path: "team_members",
  operation: "remove",
  at: 2
});

// Removing an array item by key
await array({
  documentId: "project-123",
  path: "challenges",
  operation: "remove",
  at: "challenge-abc123" // The _key value
});

// Finding documents to operate on
const result = await query({
  type: "project",
  field: "status",
  value: "active",
  limit: 5
});
```

## Benefits Over Previous Implementation

1. **Simplified but more powerful API**: Four core tools covering all operations
2. **Path-based Approach**: Consistent syntax for targeting any part of a document
3. **Rich Feedback**: Detailed success and error information for LLM understanding
4. **Better Error Handling**: Categorized errors with suggestions for fixes
5. **Maintaining Backward Compatibility**: Legacy tools still available for existing code

## UI Component Structure for Tool Rendering

To complement our improved Sanity tools, we've also created a modular UI component system that renders tool invocations in a consistent, user-friendly way. This allows the AI to provide clear visual feedback about operations being performed on the documents.

### Directory Structure

```
src/components/content-copilot/tools/
├── index.ts                     # Exports all tools and interfaces
├── MessagePart.tsx              # Renders different message parts (text or tools)
├── ToolInvocationDisplay.tsx    # Main dispatcher to specific tool UI components
├── documents/                   # Document-related tool components
│   └── DocumentCards.tsx        # Cards for document data display
├── github/                      # GitHub-related tool components
│   └── GitHubToolCard.tsx       # Card for GitHub repository data
└── notifications/               # Notification-style tool components
    └── ToolCallNotification.tsx # Compact notifications for document operations
```

### Component Hierarchy

Our component system follows a hierarchical approach:

1. **MessagePart**: Top-level component that handles different message part types
   - Renders text parts using rich typography
   - Delegates tool invocations to the ToolInvocationDisplay

2. **ToolInvocationDisplay**: Central dispatcher that maps tool names to specific UI components
   - Routes to appropriate specialized components based on tool type
   - Handles unknown tools with a fallback component

3. **Tool-specific components**: Specialized rendering for different tool types
   - **ToolCallNotification**: Compact notification for document operations
   - **GitHubToolCard**: Rich card for GitHub repository data
   - **DocumentToolCard**: Card for document data display
   - **DocumentTypesToolCard**: Card for displaying available document types
   - **DocumentListToolCard**: Card for displaying lists of documents

### State Handling

Each tool component handles three primary states:

1. **Loading state**: Displayed while the tool is being executed
   - Shows a spinner with appropriate messaging
   - Provides context on what operation is being performed

2. **Error state**: Displayed when the tool execution fails
   - Shows error message with visual indication
   - Provides context on what went wrong
   - May include suggestions when available

3. **Success state**: Displayed after successful tool execution
   - Shows operation results in a user-friendly format
   - Provides summary data with expandable details
   - Uses visual indicators (colors, icons) to signal success

### Integration in ContentCopilotView

The main ContentCopilotView component is now significantly cleaner, as all tool-specific UI rendering is delegated to these specialized components:

```jsx
// In ContentCopilotView.tsx
{message.parts?.map((part, index) => (
  <div key={index} className="w-full mb-2 last:mb-0">
    <MessagePart part={part} addToolResult={addToolResult} />
  </div>
))}
```

### Benefits of the UI Component Structure

1. **Modularity**: Each tool type has its own specialized component
2. **Consistency**: Unified styling and behavior across different tool types
3. **Maintainability**: Easier to add new tool UIs or modify existing ones
4. **Separation of Concerns**: Clear division between data handling and UI rendering
5. **Improved Developer Experience**: Smaller, focused files instead of one large component

## Next Steps

- Implement helper function improvements with better error handling
- Update tool implementations with enhanced response formats
- Add validation functions to check paths before operations
- Document usage patterns for the LLM
- Test with complex document structures 
- Improve tool UI components with more detailed visualization options
- Add analytics to track tool usage patterns 