# Content Copilot Schema Refactor Plan

**Created:** 2025-09-30
**Status:** Ready to Execute
**Decision:** Nuke the complexity, start fresh

---

## The Problem

**Messages not loading** because of code-database mismatch:
- Code expects messages in `messages` table
- Reality: Messages stored in `conversations.messages` JSONB field
- Result: Content Copilot opens but conversations appear empty

**Additional complexity:**
- Refinement mode exists but barely used (2 empty conversations)
- Dual storage (JSONB + table) causing confusion
- Mode switching logic adds unnecessary complexity

---

## The Solution: Scorched Earth Simplification

### What We're Nuking

1. **✂️ Drop `messages` JSONB column** from conversations table
   - 3 conversations with data → tough luck, start over
   - Messages table becomes single source of truth

2. **✂️ Remove refinement mode entirely**
   - Delete 2 refinement conversations (both empty anyway)
   - Drop `parent_conversation_id` column
   - Drop `refinement_type` column
   - Remove mode toggle from UI
   - Simplify API to single conversation type

3. **✂️ Simplify conversation types**
   - Only: `content-copilot` and `dave`
   - No more `content-copilot-refinement`

### What We're Keeping

- ✅ Messages table as single source of truth
- ✅ Vercel AI SDK message format (with `content_parts`)
- ✅ Conversation context for document tracking
- ✅ All existing tool integrations
- ✅ Supabase persistence architecture

---

## Migration Steps

### 1. Run Schema Simplification

Execute `/src/scripts/simplifySchema.sql`:
```sql
-- Drops refinement conversations
-- Drops messages JSONB column
-- Drops refinement columns
-- Adds indexes for performance
-- Verifies messages table structure
```

**What gets deleted:**
- 2 refinement conversations (empty)
- Messages JSONB data from 3 conversations (acceptable loss)

**What survives:**
- 15 regular conversations (metadata only)
- All messages that were in messages table (if any)

### 2. Update API Routes

**Files to modify:**

#### `/api/content-copilot/regular/route.ts`
- Remove mode logic (always "regular" now)
- Remove parent conversation handling
- Simplify conversation creation context
- Keep tool execution and streaming

#### `/api/content-copilot/refinement/route.ts`
- **DELETE THIS FILE** - no longer needed

#### `/api/conversation/get/route.ts`
- Remove mode parameter
- Remove JSONB fallback logic
- Query messages table ONLY
- Fix message mapping to Vercel AI SDK format

#### `/api/conversation/save-messages/route.ts`
- Keep as-is (already uses messages table)

### 3. Update Frontend Components

#### `ContentCopilotView.tsx`
**Remove:**
- Mode state (`'regular' | 'refinement'`)
- Mode toggle UI (ToggleGroup)
- `switchToRefinementMode()` function
- `switchToRegularMode()` function
- Parent conversation ID tracking
- API route switching logic

**Simplify:**
- Single API route: `/api/content-copilot/regular`
- Remove mode from conversation context
- Clean up state management

#### Update Types

**`src/lib/types.ts`:**
```typescript
// OLD
type ConversationMode = 'regular' | 'refinement';

// NEW
// Delete this type entirely, no longer needed
```

### 4. Update Schemas/Specs

- Update [specs/schema-simplified.sql](../schema-simplified.sql) as new reference
- Archive old schema.sql
- Update repository-specification.md to reflect simplified architecture

---

## Code Changes Summary

### Files to Delete
- `/api/content-copilot/refinement/route.ts`
- `ConversationMode` type definition

### Files to Modify

| File | Changes |
|------|---------|
| `ContentCopilotView.tsx` | Remove mode toggle, simplify state |
| `/api/content-copilot/regular/route.ts` | Remove mode logic |
| `/api/conversation/get/route.ts` | Remove JSONB fallback, fix message loading |
| `src/lib/types.ts` | Delete `ConversationMode` type |
| `specs/schema.sql` | Replace with schema-simplified.sql |

---

## Testing Checklist

After migration:

- [ ] Run schema migration SQL
- [ ] Verify conversations table structure (no messages column)
- [ ] Verify messages table has correct indexes
- [ ] Start dev server
- [ ] Open `/studio`
- [ ] Navigate to a Project document
- [ ] Content Copilot view loads
- [ ] Can start new conversation
- [ ] Messages send and receive
- [ ] Tool calls execute (writeTool, arrayTool, etc.)
- [ ] Messages persist to Supabase
- [ ] Refresh page - conversation loads from messages table
- [ ] Test with multiple projects
- [ ] No more mode toggle visible in UI
- [ ] No errors in console

---

## Rollback Plan

If things go sideways:

1. **Restore conversations table:**
   ```sql
   ALTER TABLE conversations
   ADD COLUMN messages JSONB,
   ADD COLUMN parent_conversation_id UUID REFERENCES conversations(id),
   ADD COLUMN refinement_type TEXT;
   ```

2. **Revert code changes** via git:
   ```bash
   git checkout HEAD -- src/components/content-copilot/ContentCopilotView.tsx
   git checkout HEAD -- src/app/api/content-copilot/
   ```

3. **Re-deploy** previous working version

---

## Benefits of Simplification

### Before (Complex)
- Two storage locations (JSONB + table)
- Two conversation modes (brainstorm + refinement)
- Mode switching logic
- Parent conversation tracking
- Confusing data flow
- **Broken conversation loading**

### After (Simple)
- ✅ One storage location (messages table)
- ✅ One conversation mode
- ✅ Simpler API routes
- ✅ Clearer data flow
- ✅ **Working conversation loading**
- ✅ Easier to maintain
- ✅ Easier to debug

---

## Migration Execution Order

1. **Backup database** (just in case)
2. Run `simplifySchema.sql` on Supabase
3. Update API route code
4. Update ContentCopilotView component
5. Remove refinement route file
6. Test locally
7. Deploy
8. Update specs documentation

---

## Open Questions

- [ ] Should we keep conversation metadata for the 3 that had messages? (No, fresh start)
- [ ] Any other UI that references refinement mode? (Check deprecated components)
- [ ] Update projectDocumentation.md? (Yes, after confirming it works)

---

## Success Criteria

✅ Content Copilot loads in Sanity Studio
✅ Can start new conversations
✅ Messages send/receive successfully
✅ Conversations persist and reload correctly
✅ All tools work (write, delete, array, query)
✅ No mode toggle in UI
✅ No refinement code in codebase
✅ Schema is clean and simple
✅ Zero JSONB message storage
