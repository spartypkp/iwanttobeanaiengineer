# Feature: Content Copilot - Investigation & Fix

**Created**: 2025-09-30
**Status**: Investigation
**Parent Specs**:
- Project: [project-specification.md](../project-specification.md)
- Repository: [repository-specification.md](../repository-specification.md)

---

## 1. Requirements & Context

### Business Requirements

From @project-specification.md:
- **Critical Priority (P0)**: Content Copilot is currently broken and blocking efficient project documentation
- **Core User Need**: Batch documentation of multiple projects through natural conversation rather than tedious form-filling
- **Success Criteria**:
  - Content Copilot works reliably with current Sanity version
  - Can document projects efficiently through conversation
  - Integration is more robust than current "super hacky" approach
- **Impact**: Blocking primary workflow for updating portfolio with new projects

### Technical Context

From @repository-specification.md:
- **Current Issue**: Likely broken due to Sanity version update (3.89.0 → possibly newer)
- **Integration Method**: "Super hacky" AutoPreviewPane component that manipulates Sanity Studio to create side-by-side view
- **Key Dependencies**:
  - Sanity Studio 3.89.0 with `structureTool` and custom `defaultDocumentNode`
  - Vercel AI SDK (`useChat` hook, `streamText` backend)
  - Anthropic Claude 3.7 Sonnet
  - Supabase for conversation persistence
  - Custom AI tools (writeTool, deleteTool, arrayTool, queryTool)

### Architecture Overview

**Content Copilot Stack (5 Layers):**

1. **Frontend Layer**:
   - `ContentCopilotView.tsx` - Main chat UI using Vercel AI SDK's `useChat`
   - `AutoPreviewPane.tsx` - Hacky integration that auto-splits Sanity Studio view
   - `ToolDisplay.tsx` + specialized display components for tool results

2. **Sanity Integration Layer**:
   - `sanity.config.ts` - Defines plugins and structure
   - `src/sanity/structure.ts` - Defines `defaultDocumentNode` with Content Copilot view
   - AutoPreviewPane manipulates DOM to force split-pane view

3. **API Layer**:
   - `/api/content-copilot/regular` - Main conversation endpoint
   - `/api/content-copilot/refinement` - Content improvement mode
   - `/api/conversation/get` - Load conversation history
   - `/api/conversation/save-messages` - Persist conversation

4. **Tool Layer**:
   - `writeTool` - Write value to any document path
   - `deleteTool` - Delete value from any path
   - `arrayTool` - Array operations (add, remove, update, reorder)
   - `queryTool` - Query Sanity documents with GROQ
   - Additional tools: `getRelatedDocument`, `getAllDocumentTypes`, `listDocumentsByType`, `getRepositoryDetails`

5. **Persistence Layer**:
   - Supabase `conversations` table - metadata and context
   - Supabase `messages` table - message history with parts (text, tool calls, results)
   - Schema serialization for passing to AI

### Current Integration Method (The "Super Hacky" Part)

**AutoPreviewPane Strategy**:
```typescript
// Location: src/components/content-copilot/AutoPreviewPane.tsx
// Strategy: Hidden field in schema triggers this component
// Goal: Force Sanity Studio to show split-pane view automatically

const AutoPreviewPane = () => {
  const { setView, duplicateCurrent, groupIndex, hasGroupSiblings } = usePaneRouter();

  useEffect(() => {
    if (!isContentCopilotActive) {
      if (hasGroupSiblings) {
        if (groupIndex === 1) {
          setView("contentCopilot"); // Switch right pane to Content Copilot
        }
      } else {
        duplicateCurrent(); // Create split if none exists
      }
    }
  }, []);

  return null; // Invisible component
};
```

**Schema Integration**:
```typescript
// Location: src/sanity/schemaTypes/projectType.ts (and others)
// Hidden field added to every content type

defineField({
  name: 'contentCopilotPreview',
  type: 'string',
  hidden: false, // Was true, changed for debugging
  description: 'This field enables auto-preview',
  components: {
    field: AutoPreviewPane, // Triggers the hack
  },
}),
```

**Structure Configuration**:
```typescript
// Location: src/sanity/structure.ts
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  return S.document().views([
    S.view.form(), // Standard form view
    S.view.component(ContentCopilotView)
      .title('Content Copilot')
      .id('contentCopilot')
      .icon(CodeIcon)
      .options({ defaultView: true })
  ]);
};
```

### Scope Definition

**In Scope:**
- Investigate root cause of Content Copilot breaking
- Identify Sanity API changes that broke AutoPreviewPane
- Fix or refactor integration to work with current Sanity version
- Ensure Content Copilot view loads and splits pane correctly
- Verify all 5 layers of the stack are working
- Test conversation functionality end-to-end
- Document the fix for future Sanity upgrades

**Out of Scope:**
- Complete rewrite of Content Copilot architecture (unless absolutely necessary)
- Changes to AI prompts or conversation flow (unless broken)
- Changes to tool definitions or Sanity mutation logic (unless broken)
- UI/UX improvements beyond fixing functionality
- Performance optimizations
- New features or enhancements

**Open Questions:**
- [ ] What specific Sanity API changed between versions?
- [ ] Is `usePaneRouter` still available or has it been renamed/removed?
- [ ] Has the Studio structure API changed for custom views?
- [ ] Are there new Sanity APIs we should use instead of DOM manipulation?
- [ ] Should we continue with AutoPreviewPane approach or find more official method?
- [ ] What's the current Sanity version in production vs local?

---

## 2. Implementation Plan

### Investigation Approach

**Phase 1: Identify Breaking Changes**
1. Check Sanity changelog for v3.89.0 → current version
2. Test if `usePaneRouter` hook still exists
3. Verify `defaultDocumentNode` API is unchanged
4. Check if `ContentCopilotView` component loads at all
5. Inspect browser console for errors when opening Sanity Studio

**Phase 2: Isolate the Issue**
1. Test if Content Copilot view appears in view tabs (without AutoPreviewPane)
2. Test if AutoPreviewPane component loads
3. Check if `setView()` and `duplicateCurrent()` methods still exist
4. Verify schema field with custom component still renders
5. Test manual switching to Content Copilot view

**Phase 3: Implement Fix**
- Option A: Update AutoPreviewPane to use new Sanity APIs
- Option B: Find official Sanity way to set default view behavior
- Option C: Refactor to more robust integration method
- Option D: Keep hacky approach but fix specific breaking changes

### Components to Investigate/Modify

Priority order based on likelihood of breakage:

- [ ] **AutoPreviewPane.tsx** (Most likely culprit)
  - Uses `usePaneRouter` from `sanity/desk` - may be deprecated
  - Direct DOM manipulation may break with Studio UI changes
  - Check if hook import path changed: `sanity/desk` → `sanity/structure`?

- [ ] **structure.ts** (Second most likely)
  - `defaultDocumentNode` API may have changed
  - `S.view.component()` method may have new signature
  - Check if view registration API changed

- [ ] **sanity.config.ts** (Third check)
  - Verify `structureTool` import and usage
  - Check if plugin configuration changed
  - Ensure `defaultDocumentNode` is passed correctly

- [ ] **Schema Types** (Low risk but check)
  - Hidden field with custom component may not render
  - Verify field component API unchanged

- [ ] **ContentCopilotView.tsx** (Lowest risk)
  - Component itself likely fine
  - May need updates if Sanity context/props changed

### Debugging Steps

1. [ ] Start dev server and open Sanity Studio (`/studio`)
2. [ ] Open browser console and check for errors
3. [ ] Navigate to a Project document
4. [ ] Check if "Content Copilot" tab appears
5. [ ] Try manually clicking Content Copilot tab (if visible)
6. [ ] Check if AutoPreviewPane code executes (add console.logs)
7. [ ] Verify `usePaneRouter` hook returns expected methods
8. [ ] Check if split-pane view appears at all
9. [ ] Test if conversation loads when view is active

### Testing Strategy

**Unit Tests** (Not in scope per project philosophy, but manual verification):
- N/A - "No tests needed baby"

**Integration Tests** (Manual):
- Open Sanity Studio successfully
- Navigate to Project document
- Content Copilot view appears in tabs
- Split-pane view activates (form on left, chat on right)
- Chat interface loads without errors
- Can send messages and receive responses
- Tools execute and update Sanity document
- Conversation persists to Supabase
- Field highlighting works when tools execute

**Regression Tests** (Manual):
- Regular mode works (new conversation)
- Refinement mode works (improving content)
- All 4 primitive tools work (write, delete, array, query)
- Document query tools work
- GitHub integration tool works
- Mode switching works
- Message editing and resubmission works

---

## 3. Work Log
<!-- THIS SECTION IS NEVER MERGED - AI TRACKS PROGRESS HERE -->

### Session: 2025-09-30 Initial Investigation

**Goal**: Research existing Content Copilot architecture and identify breaking points

**Progress**:
- [x] Read and analyzed all Content Copilot component files
- [x] Mapped 5-layer architecture
- [x] Identified AutoPreviewPane as "super hacky" integration point
- [x] Documented current Sanity version (3.89.0)
- [x] Reviewed structure.ts and sanity.config.ts
- [x] Examined schema integration method
- [x] Created comprehensive feature spec for the fix

**Discoveries**:
1. **AutoPreviewPane Hook Source**: Uses `usePaneRouter` from `sanity/desk`
   - This import path is suspicious - Sanity v3 typically uses `sanity/structure`
   - Hook provides: `setView`, `duplicateCurrent`, `groupIndex`, `hasGroupSiblings`, `routerPanesState`
   - Logic checks if Content Copilot view is already active before manipulating

2. **Component Registration**: Content Copilot registered as custom view in `defaultDocumentNode`
   - Should create two tabs: "Form" and "Content Copilot"
   - `defaultView: true` option may not force split-pane behavior anymore

3. **Schema Field Hack**: Hidden field with `AutoPreviewPane` component
   - Component returns `null` - purely for side effects
   - Renders when document loads, triggering auto-split logic
   - Field is marked `hidden: false` (was `true`) - suggests debugging attempt

4. **Potential Breaking Changes**:
   - Import path: `sanity/desk` may not exist in newer versions
   - Hook API: `usePaneRouter` may be renamed or removed
   - Structure API: View registration may have changed
   - Studio architecture: Split-pane behavior may work differently

**Next Steps**:
- Start dev server and open Studio to see actual errors
- Check Sanity v3 migration docs and changelog
- Test if `usePaneRouter` import fails
- Check browser console for errors
- Determine if fix is simple (import path) or complex (API changed)

**Blockers**:
- Need to actually run the app to see errors
- Need to check Sanity changelog for breaking changes

---

## 4. Specification Updates
<!-- ONLY THIS SECTION MERGES TO REPOSITORY-SPECIFICATION.MD -->

### Content Copilot Architecture

**Purpose**: AI-assisted content creation system that uses conversational UX to populate structured Sanity CMS fields without manual form-filling.

**Key Innovation**: Three-phase conversation flow (Story, Transition, Field-Focused) that naturally extracts information while gradually populating structured data through AI tool calling.

#### Layer 1: Frontend Components

**ContentCopilotView.tsx** - Main chat interface
- Uses Vercel AI SDK's `useChat` hook for conversation management
- Manages two modes: `regular` (brainstorming) and `refinement` (improving)
- Handles message editing and resubmission
- Renders tool results with specialized display components
- Integrates with Sanity document context (documentId, schemaType, documentData)

**AutoPreviewPane.tsx** - Integration hack for split-pane view
- Uses `usePaneRouter` hook from `sanity/desk` to manipulate Studio UI
- Automatically creates split-pane view when document opens
- Logic: If Content Copilot not active → duplicate pane or switch view
- Returns `null` (invisible component, side-effects only)
- **Status**: Likely broken due to Sanity API changes

**Tool Display Components**:
- `ToolDisplay.tsx` - Routes tool results to specialized displays
- `WriteToolDisplay.tsx`, `DeleteToolDisplay.tsx`, `ArrayToolDisplay.tsx`, `QueryToolDisplay.tsx` - Primitive operations
- `DocumentCards.tsx`, `GitHubToolCard.tsx` - Rich displays for complex tools

#### Layer 2: Sanity Integration

**Structure Configuration** (`src/sanity/structure.ts`):
```typescript
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  return S.document().views([
    S.view.form(),
    S.view.component(ContentCopilotView)
      .title('Content Copilot')
      .id('contentCopilot')
      .icon(CodeIcon)
      .options({ defaultView: true })
  ]);
};
```

**Schema Integration**:
- Hidden `contentCopilotPreview` field added to all content types
- Field component set to `AutoPreviewPane`
- Triggers auto-split logic when document loads

**Studio Configuration** (`sanity.config.ts`):
- Uses `structureTool` plugin
- Passes custom `structure` and `defaultDocumentNode`

#### Layer 3: API Routes

**POST `/api/content-copilot/regular`** - Main conversation endpoint
- Receives: messages, documentId, conversationId, schemaType, serializableSchema, documentData
- Creates or retrieves Supabase conversation
- Generates system prompt with schema and document state
- Streams AI response with `streamText` from Vercel AI SDK
- Executes tools asynchronously
- Saves conversation on completion
- Returns: Streaming response with X-Conversation-Id header

**POST `/api/content-copilot/refinement`** - Content improvement mode
- Same as regular but creates linked conversation (parent reference)
- Focuses on improving existing content

**POST `/api/conversation/get`** - Load conversation
- Retrieves conversation by documentId and mode
- Returns: conversation metadata + messages array

**POST `/api/conversation/save-messages`** - Persist conversation
- Batch saves messages to Supabase

#### Layer 4: AI Tools

**Primitive Operations** (core manipulation):
- `writeTool` - Write value to any document path (supports nested paths)
- `deleteTool` - Delete value from any path
- `arrayTool` - Array operations (append, remove, update, reorder)
- `queryTool` - Query Sanity documents with GROQ

**Document Tools**:
- `getRelatedDocument` - Fetch related documents
- `getAllDocumentTypes` - List available schemas
- `listDocumentsByType` - List documents by type

**Integration Tools**:
- `getRepositoryDetails` - Fetch GitHub repo info

**Tool Design Philosophy**:
- Primitive operations can manipulate ANY part of document structure
- No hardcoded field mappings required
- Direct Sanity API calls via `client.patch()`
- Rich feedback with success/error messages
- Zod schema validation for parameters

#### Layer 5: Persistence

**Supabase Tables**:

**conversations**:
```sql
{
  id: UUID,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  title: TEXT,
  conversation_type: TEXT, -- 'content-copilot'
  context: JSONB, -- { documentId, schemaType, mode }
  parent_conversation_id: UUID -- for refinements
}
```

**messages**:
```sql
{
  id: UUID,
  conversation_id: UUID,
  created_at: TIMESTAMP,
  role: TEXT, -- 'user' | 'assistant' | 'tool'
  content: TEXT,
  content_parts: JSONB, -- MessagePart[] from Vercel AI SDK
  sequence: INTEGER
}
```

**Message Format**:
```typescript
type MessagePart =
  | { type: 'text', text: string }
  | { type: 'tool-call', toolCallId: string, toolName: string, args: any }
  | { type: 'tool-result', toolCallId: string, toolName: string, result: any }
```

### Known Issues

**Critical Issue**: Content Copilot Currently Broken
- **Symptom**: Cannot use AI chat to document projects
- **Likely Cause**: Sanity version update broke AutoPreviewPane integration
- **Impact**: Blocking primary project documentation workflow
- **Root Cause**: "Super hacky" integration relies on internal Sanity APIs that may have changed

**Specific Suspects**:
1. `usePaneRouter` hook from `sanity/desk` may be deprecated/moved
2. `setView()` and `duplicateCurrent()` methods may have changed signatures
3. Studio pane structure may have changed internally
4. Custom view registration API may have updated

**Integration Fragility**:
- AutoPreviewPane relies on internal Sanity APIs not meant for external use
- Direct DOM manipulation for field highlighting
- No official API for forcing split-pane behavior
- Future Sanity updates likely to break again

### Recommended Fix Strategy

**Immediate Fix** (Get it working):
1. Update import paths if changed (`sanity/desk` → `sanity/structure`)
2. Update hook usage if API changed
3. Test and adjust AutoPreviewPane logic for new Studio behavior

**Long-term Improvement** (Make it robust):
1. Check if Sanity has added official API for default split-pane behavior
2. Consider if custom Studio plugin is more appropriate
3. Document integration for easier debugging in future
4. Add error handling and fallbacks
5. Consider submitting feature request to Sanity for official support

### Configuration Requirements

**Environment Variables** (unchanged):
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_TOKEN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```

**Dependencies** (critical versions):
- `sanity@3.89.0` - CMS SDK
- `@sanity/vision@3.86.1` - Query visualization
- `ai@4.3.9` - Vercel AI SDK
- `@ai-sdk/anthropic@1.2.10` - Claude integration
- `@supabase/supabase-js@2.45.6` - Database client
- `zod@3.24.3` - Schema validation

---

## 5. Completion Checklist

Before marking as complete:
- [ ] Root cause identified and documented
- [ ] Fix implemented and tested
- [ ] Content Copilot loads in Sanity Studio
- [ ] Split-pane view works automatically
- [ ] Conversation functionality works end-to-end
- [ ] All tool executions work
- [ ] Field highlighting works
- [ ] Mode switching (regular ↔ refinement) works
- [ ] Message persistence to Supabase works
- [ ] Tested with multiple document types (project, skill, knowledge base)
- [ ] Documented fix for future reference
- [ ] Updated Specification Updates with solution
- [ ] No temporary work notes in Specification Updates
- [ ] Integration approach documented with rationale