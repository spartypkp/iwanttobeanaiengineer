# Content Copilot Tool Rendering

This directory contains components for rendering tool calls in the Content Copilot interface.

## Hybrid Rendering Approach

We've implemented a hybrid approach for tool call rendering that combines:

1. A single entry point (`ToolDisplay`) that all UI components use
2. Specialized rich UI components for complex data visualization
3. A simple notification fallback for basic operations

### How It Works

1. `ToolDisplay` receives a `toolCall` object from the message part
2. Based on the `toolName`, it routes to the appropriate specialized component:
   - Document tools → `DocumentToolCard`, `DocumentListToolCard`, etc.
   - GitHub tools → `GitHubToolCard`
   - Primitive operations → `WriteToolDisplay`, `ArrayToolDisplay`, etc.
3. If no specialized component exists, it renders a simple notification

### Component Hierarchy

```
ToolDisplay
├── Document Tools
│   ├── DocumentToolCard (related document data)
│   ├── DocumentTypesToolCard (available schema types)
│   └── DocumentListToolCard (lists of documents)
├── GitHub Tools
│   └── GitHubToolCard (repository details)
├── Primitive Operation Tools
│   ├── WriteToolDisplay (field updates)
│   ├── DeleteToolDisplay (field deletions)
│   ├── ArrayToolDisplay (array modifications)
│   └── QueryToolDisplay (search results)
└── SimpleNotification (fallback for basic operations)
```

### Integration

In ContentCopilotView, we directly render based on part type:

```tsx
{part.type === 'text' ? (
  <p>{part.text}</p>
) : part.type === 'tool-invocation' ? (
  <ToolDisplay toolCall={part.toolInvocation} addToolResult={addToolResult} />
) : null}
```

### Benefits

- **Single Entry Point**: Frontend components only need to use `ToolDisplay`
- **Rich UIs Where Needed**: Complex data gets appropriate visualization
- **Simple Notifications**: Basic operations use compact notifications
- **Maintainable**: Each specialized component focuses on one tool type
- **Extensible**: Easy to add new specialized renderers
- **Backward Compatible**: Works with both legacy and new tool formats 