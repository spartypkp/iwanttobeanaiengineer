# Repository Specification: I Want To Be An AI Engineer

**Repository:** github.com/spartypkp/iwanttobeanaiengineer
**Technical Owner:** Will Diamond (@spartypkp)
**Created:** 2025-09-30
**Last Updated:** 2025-09-30
**Status:** Active Production

---

## 1. Architecture Overview

### System Architecture

This is a **modern full-stack web application** built with Next.js 14 App Router, featuring:
- Static site generation with incremental static regeneration (ISR)
- Server-side rendering for dynamic content
- API routes for AI-powered features
- Headless CMS for content management
- PostgreSQL database for conversation persistence
- AI integration for content creation

**Architecture Style:** Jamstack with server-side enhancements
- Static pages generated at build time
- Dynamic data fetched from Sanity CMS
- API routes handle AI conversations and data mutations
- Vercel serverless functions for backend logic

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  (React Components, useChat hook, Terminal UI)              │
└───────────────┬─────────────────────────────────────────────┘
                │
                ├──────────────────────────────────────────────┐
                │                                              │
                ▼                                              ▼
┌──────────────────────────┐                   ┌──────────────────────────┐
│   Static Pages (SSG)     │                   │   API Routes             │
│   - Home                 │                   │   - /api/content-copilot │
│   - Projects             │                   │   - /api/conversation    │
│   - Project Detail       │                   │                          │
│   - Consulting           │                   │   (Vercel Functions)     │
└────────┬─────────────────┘                   └────────┬─────────────────┘
         │                                              │
         │                                              ├────────────────┐
         │                                              │                │
         ▼                                              ▼                ▼
┌──────────────────────────┐              ┌──────────────────┐  ┌──────────────┐
│   Sanity CMS             │              │  Anthropic API   │  │  Supabase    │
│   - Projects             │◄─────────────┤  (Claude 3.7)    │  │  (Postgres)  │
│   - Skills               │              │  - streamText    │  │  - messages  │
│   - Knowledge Base       │              │  - Tool Calling  │  │  - convos    │
│   - Work History         │              └──────────────────┘  └──────────────┘
│                          │
│   /studio (Embedded)     │
└──────────────────────────┘
```

---

## 2. Technology Stack

### Frontend Technologies

**Core Framework:**
- **Next.js 14.2.0** - React framework with App Router
  - **Why:** Will's standard for web development, App Router provides better DX than Pages Router
  - Server components for performance
  - File-based routing
  - API routes for backend logic
  - Image optimization

**UI Libraries:**
- **React 18.3.1** - UI library
- **TypeScript 5.x** - Type safety
  - Strict mode enabled
  - Path aliases: `@/*` → `./src/*`
  - Target: ES2020

**Styling:**
- **Tailwind CSS 3.x** - Utility-first CSS framework
  - Custom color palette (terminal aesthetic)
  - Custom fonts (monospace: Courier Prime, Cutive Mono)
  - JIT mode for optimal bundle size
  - Custom animations (scan lines, typing effects)
- **ShadCN UI** - Component library built on Radix UI
  - Headless, accessible primitives
  - Customizable with Tailwind
  - 14+ Radix packages for complex interactions
- **Framer Motion 12.7.4** - Animation library

**Icons & Assets:**
- **Lucide React 0.378.0** - Icon library
- **Heroicons 2.1.5** - Additional icons
- **Next.js Image** - Optimized image loading

**Data Visualization:**
- **Recharts 2.12.7** - Charts and graphs
- **D3.js 7.9.0** - Custom visualizations
- **React Force Graph 3D 1.24.3** - 3D graph visualizations
- **React GitHub Calendar 4.5.6** - GitHub contribution calendar

### Backend Technologies

**Content Management:**
- **Sanity CMS 3.89.0** - Headless CMS
  - **Why:** Experimenting with CMS after being a "Postgres hardliner" - wanted to expand horizons
  - Embedded Studio at `/studio`
  - GROQ query language for flexible data fetching
  - Type-safe schemas
  - Vision tool for query development
  - Real-time preview capabilities

**Database:**
- **Supabase 2.45.6** - PostgreSQL database
  - **Why:** Right tool for managing LLM conversations - complex chat/message/tool call storage
  - JSONB fields for structured message data
  - Conversation threading (parent-child relationships)
  - Server and client utilities
  - Free tier sufficient for current needs

**AI Integration:**
- **Vercel AI SDK 4.3.9** - LLM integration framework
  - `useChat` hook for frontend
  - `streamText` for backend streaming responses
  - Asynchronous tool calling support
  - Standardized message format
- **Anthropic Claude 3.7 Sonnet** via `@ai-sdk/anthropic` 1.2.10
  - **Why:** Better "soft skills" for interviewing and conversation compared to GPT-4
  - Strong tool calling capabilities
  - Personal preference
- **Zod 3.24.3** - Schema validation for AI tools

**Additional Integrations:**
- **Octokit (@octokit/rest) 21.1.1** - GitHub API integration
  - Repository details
  - Contribution data
  - Project metadata

### Development Tools

**Code Quality:**
- **ESLint 8.x** - Linting
- **Prettier 3.3.2** - Code formatting
- **TypeScript 5.x** - Type checking (strict mode)

**Build Tools:**
- **PostCSS 8.x** - CSS processing
- **Autoprefixer 10.x** - Browser compatibility
- **Vite 6.3.5** - Build tool (for scripts)

### Deployment & Infrastructure

**Hosting:**
- **Vercel** - Primary deployment platform
  - **Why:** Seamless Next.js integration, serverless functions, CI/CD
  - Automatic deployments from GitHub
  - Environment variable management
  - CDN and edge functions
  - Free tier sufficient

**External Services:**
- **Sanity.io** - CMS hosting (free tier)
- **Supabase.io** - Database hosting (free tier)
- **Anthropic API** - AI inference (pay-as-you-go, negligible cost)
- **Vercel KV 0.2.4** - Key-value storage (if needed)

---

## 3. Repository Structure

```
/
├── public/                          # Static assets
│   ├── *.png, *.jpg, *.jpeg        # Project images, thumbnails
│   └── profilePic.jpg              # Profile image
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (public)/                # Public routes group
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx         # Projects grid
│   │   │   │   └── [slug]/page.tsx  # Project detail (dynamic)
│   │   │   ├── consulting/page.tsx  # Consulting page
│   │   │   ├── about/page.tsx       # About (deprecated, not in nav)
│   │   │   ├── stats/page.tsx       # Stats (experimental, not in nav)
│   │   │   └── dave/page.tsx        # Dave AI (incomplete, not in nav)
│   │   │
│   │   ├── (admin)/                 # Admin routes (protected)
│   │   │   └── contentCopilot/      # Content Copilot UI
│   │   │
│   │   ├── (sanity)/                # Sanity Studio routes
│   │   │   └── studio/
│   │   │       └── [[...tool]]/page.tsx  # Embedded Studio
│   │   │
│   │   ├── api/                     # API routes (serverless)
│   │   │   ├── content-copilot/
│   │   │   │   ├── regular/route.ts      # Regular mode
│   │   │   │   └── refinement/route.ts   # Refinement mode
│   │   │   └── conversation/
│   │   │       ├── get/route.ts          # Retrieve conversation
│   │   │       ├── save-message/route.ts # Save single message
│   │   │       └── save-messages/route.ts # Batch save
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   └── providers.tsx            # Context providers
│   │
│   ├── components/
│   │   ├── custom/                  # Custom components
│   │   │   ├── homePage/            # Home page components
│   │   │   │   ├── hero-refactored.tsx
│   │   │   │   ├── welcomeIntro.tsx
│   │   │   │   ├── contactCTA.tsx
│   │   │   │   ├── developerJourney.tsx
│   │   │   │   ├── testimonials.tsx
│   │   │   │   └── thingsILove.tsx
│   │   │   ├── projectShowcase/     # Project components
│   │   │   │   ├── projectCard.tsx
│   │   │   │   ├── projectGrid.tsx
│   │   │   │   ├── ProjectSection.tsx
│   │   │   │   ├── ProjectHeader.tsx
│   │   │   │   ├── ProjectDetailTabs.tsx
│   │   │   │   ├── ProjectOverview.tsx
│   │   │   │   └── ProjectMediaCarousel.tsx
│   │   │   ├── blog/                # Blog components (future)
│   │   │   ├── deprecated/          # Deprecated (safe to delete)
│   │   │   │   ├── magic8ball.tsx
│   │   │   │   ├── matrixRain.tsx
│   │   │   │   └── matrixButton.tsx
│   │   │   ├── dave.tsx             # Dave AI icon
│   │   │   ├── daveAnalysis.tsx
│   │   │   └── navBar.tsx           # Navigation
│   │   │
│   │   ├── content-copilot/         # Content Copilot components
│   │   │   ├── ContentCopilotView.tsx
│   │   │   ├── AutoPreviewPane.tsx
│   │   │   ├── ToolDisplay.tsx
│   │   │   └── tools/               # Tool-specific displays
│   │   │
│   │   └── ui/                      # ShadCN UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       └── ...                  # 30+ UI components
│   │
│   ├── sanity/                      # Sanity CMS
│   │   ├── lib/
│   │   │   ├── client.ts            # Sanity client
│   │   │   ├── helpers.ts           # CRUD helpers
│   │   │   ├── image.ts             # Image URL builder
│   │   │   └── live.ts              # Live preview
│   │   ├── schemaTypes/             # Content schemas
│   │   │   ├── projectType.ts       # Project schema (30+ fields)
│   │   │   ├── skillType.ts         # Skill schema
│   │   │   ├── knowledgeBaseType.ts # Knowledge base schema
│   │   │   ├── technologyType.ts    # Technology schema
│   │   │   ├── workHistoryType.ts   # Work history schema
│   │   │   ├── blockContentType.ts  # Rich text schema
│   │   │   └── index.ts             # Schema exports
│   │   ├── env.ts                   # Environment config
│   │   ├── structure.ts             # Studio structure
│   │   └── knowledgeBaseTemplates.md # KB templates
│   │
│   ├── lib/
│   │   ├── tools/                   # AI tools
│   │   │   ├── improvedSanityTools.ts # Advanced tools
│   │   │   │   ├── writeTool        # Write to any path
│   │   │   │   ├── deleteTool       # Delete from any path
│   │   │   │   ├── arrayTool        # Array operations
│   │   │   │   └── queryTool        # Query documents
│   │   │   ├── sanityTools.ts       # Legacy tools
│   │   │   ├── github.ts            # GitHub integration
│   │   │   ├── utils.ts             # Tool utilities
│   │   │   └── index.ts             # Tool exports
│   │   ├── utils/
│   │   │   ├── supabase/            # Supabase clients
│   │   │   │   ├── client.ts        # Browser client
│   │   │   │   ├── server.ts        # Server client
│   │   │   │   └── middleware.ts    # Middleware
│   │   │   ├── messagesManager.ts   # Conversation CRUD
│   │   │   ├── cn.tsx               # Tailwind utility
│   │   │   └── schema-serialization.ts # Schema utils
│   │   ├── prompts.ts               # AI system prompts
│   │   ├── embeddings.ts            # Vector embeddings
│   │   ├── document-utils.ts        # Document helpers
│   │   └── types.ts                 # TypeScript types
│   │
│   └── scripts/
│       └── generateEmbeddings.ts    # Embedding generation
│
├── specs/                           # Specifications
│   ├── project-specification.md     # This is the source of truth
│   ├── repository-specification.md  # Technical implementation
│   └── features/                    # Feature specs
│       ├── project-analysis.md      # Comprehensive analysis
│       └── content-copilot-dump.md  # Content Copilot notes
│
├── projectDocumentation.md          # Legacy detailed docs
├── README.md                        # Getting started guide
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind config
├── next.config.mjs                  # Next.js config
├── sanity.config.ts                 # Sanity Studio config
├── postcss.config.js                # PostCSS config
└── prettier.config.js               # Prettier config
```

---

## 4. Data Models & Schemas

### Sanity CMS Schemas

#### Project Schema (`projectType.ts`)

**Purpose:** Comprehensive project documentation with storytelling focus

**Key Fields (30+ total):**
```typescript
{
  // Basic Information
  title: string                    // Project title
  slug: slug                       // URL slug
  id: string                       // Unique identifier
  description: text                // Short description (1-2 sentences)
  company: string                  // Associated organization
  isFeatured: boolean              // Show on home page
  primaryColor: string             // Hex color for styling

  // Timeline & Status
  timeline: {
    startDate: date
    endDate: date?
    status: 'active' | 'completed' | 'maintenance' | 'archived' | 'concept'
  }

  // Storytelling Components
  problem: text                    // Problem statement
  solution: text                   // Solution overview
  challenges: array<{title, description}>
  approach: array<{title, description}>
  technicalInsights: array<{
    title,
    description,
    code?,
    language?
  }>
  learnings: array<string>
  achievements: array<string>
  personalContribution: text
  results: array<string>

  // Metrics
  metrics: array<{
    label: string
    value: number
    unit: string
  }>

  // Technologies
  technologies: array<{
    name: string
    category: 'frontend' | 'backend' | 'data' | 'devops' | 'ai' | 'design' | 'other'
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  }>

  // Categories & Tags
  categories: array<string>
  tags: array<string>
  complexity: 'simple' | 'medium' | 'complex' | 'enterprise'

  // Media
  thumbnail: image                 // Main project image (required)
  media: array<{
    type: 'image' | 'video' | 'demo' | '3d'
    videoSource?: 'upload' | 'url'
    videoFile?: file
    image?: image
    url?: url
    alt?: string
    poster?: image
    featured: boolean
    caption?: string
  }>

  // Links
  github: url
  demoUrl: url
  caseStudyUrl: url
  blogPosts: array<{title, url}>
  documentation: url

  // Content Copilot Integration
  contentCopilotPreview: string    // Hidden field for auto-preview
}
```

**Validation:**
- Title, slug, description, thumbnail required
- Timeline with status required
- At least 1 technology required
- Slug auto-generated from title
- Primary color must be valid hex

#### Knowledge Base Schema (`knowledgeBaseType.ts`)

**Purpose:** Q&A content for Dave AI Assistant

**Key Fields:**
```typescript
{
  title: string
  slug: slug
  category: 'personal' | 'professional' | 'education' | 'projects' |
            'skills' | 'experience' | 'preferences' | 'faq'
  question: text                   // FAQ format
  content: text                    // Answer content
  keywords: array<string>          // Search keywords
  relatedProjects: array<reference<project>>
  relatedSkills: array<reference<skill>>
  relatedKnowledge: array<reference<knowledgeBase>>
  source: string                   // Information source
  lastVerified: date               // Accuracy check date
  priority: number (1-10)          // Retrieval priority
  isPublic: boolean                // Public vs private info
  contentCopilotPreview: string    // Hidden field
}
```

#### Skill Schema (`skillType.ts`)

**Purpose:** Detailed skill documentation with examples

**Key Fields:**
```typescript
{
  name: string
  slug: slug
  category: 'programming' | 'frameworks' | 'ai' | 'cloud' |
            'tools' | 'soft' | 'domain'
  description: text
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsExperience: number
  projects: array<reference<project>>
  relatedSkills: array<reference<skill>>
  technologies: array<reference<technology>>
  examples: array<{
    title: string
    description: text
    code?: text
    language?: string
  }>
  resources: array<{
    title: string
    url: url
    type: 'course' | 'book' | 'article' | 'video' | 'docs' | 'other'
  }>
  featured: boolean
  contentCopilotPreview: string
}
```

#### Other Schemas

- **Technology Schema** - Technology metadata and documentation
- **Work History Schema** - Career timeline and roles
- **Block Content Schema** - Rich text formatting for content

### Supabase Database Schema

#### Conversations Table

**Purpose:** Store LLM conversation metadata

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,                        -- Conversation title
  conversation_type TEXT NOT NULL    -- 'content-copilot' or 'dave'
    CHECK (conversation_type IN ('content-copilot', 'dave')),
  context JSONB,                     -- Conversation context
  user_id TEXT,                      -- User identifier (optional)
  metadata JSONB,                    -- Additional metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Context Structure (for Content Copilot):**
```typescript
{
  mode: 'regular',
  source: 'sanity',
  documentId: string,
  schemaType: string,
  documentTitle: string
}
```

**Key Changes from Previous Schema:**
- Removed `parent_conversation_id` (refinement mode removed)
- Simplified to two conversation types: 'content-copilot' and 'dave'
- No longer storing messages in JSONB column (messages table is source of truth)

#### Messages Table

**Purpose:** ONLY source of truth for message history

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  external_id TEXT,                  -- Vercel AI SDK message ID (message.id)
  role TEXT NOT NULL                 -- 'user', 'assistant', 'tool'
    CHECK (role IN ('system', 'user', 'assistant', 'tool')),
  content TEXT,                      -- Plain text content
  content_parts JSONB,               -- Structured parts array from Vercel AI SDK
  metadata JSONB,                    -- Message metadata
  sequence INTEGER NOT NULL,         -- Message order in conversation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(conversation_id, sequence)  -- Ensure sequence is unique per conversation
);
```

**Content Parts Structure (Vercel AI SDK format):**
```typescript
type MessagePart =
  | { type: 'text', text: string }
  | { type: 'tool-call', toolCallId: string, toolName: string, args: any }
  | { type: 'tool-result', toolCallId: string, toolName: string, result: any };
```

**Display Logic:**
- User messages with single text part: extract to `content` field for UI
- Assistant messages or complex parts: preserve `parts` structure
- Fallback to `content` field if no parts available

---

## 5. Key Technical Decisions

### Decision: Next.js 14 App Router

**Rationale:**
- Will's standard for all web development
- App Router provides better DX than Pages Router
- Server components for performance optimization
- File-based routing is intuitive
- Built-in API routes for backend logic
- Excellent Vercel integration

**Trade-offs:**
- App Router was relatively new (may have bugs)
- Learning curve from Pages Router
- Some third-party libraries may not support RSC yet

**Outcome:** Solid choice, no regrets

### Decision: Sanity CMS

**Rationale:**
- Experimenting with CMS after being a "Postgres hardliner"
- Wanted to expand tech horizons and try new stack
- Embedded Studio provides excellent authoring experience
- GROQ query language is powerful and flexible
- Type-safe schemas with TypeScript generation
- Free tier sufficient for personal site

**Trade-offs:**
- Learning curve for GROQ syntax
- More complex than markdown files
- Requires external service (dependency)
- Content Copilot integration is "super hacky"

**Outcome:** Good learning experience, Content Copilot makes it valuable when working

### Decision: Supabase for Conversation Storage

**Rationale:**
- LLM conversation management is complex (messages, tool calls, threading)
- Sanity not built for this use case
- Postgres is the right tool for structured conversation data
- Supabase provides excellent Postgres client libraries
- JSONB fields perfect for flexible message structures
- Free tier sufficient

**Trade-offs:**
- Adds another external dependency
- Requires environment variable management
- Could have used Sanity with workarounds

**Outcome:** Right tool for the job, no regrets

### Decision: Anthropic Claude over OpenAI

**Rationale:**
- Better "soft skills" for interviewing and conversation
- Personal preference for Claude's interaction style
- Strong tool calling capabilities
- Good performance for Content Copilot use case

**Trade-offs:**
- OpenAI might be faster or cheaper
- Less ecosystem support than OpenAI
- API differences if switching later

**Outcome:** Happy with Claude's conversational ability

### Decision: Vercel AI SDK

**Rationale:**
- Provides excellent abstraction for LLM integration
- `useChat` hook simplifies frontend implementation
- `streamText` enables real-time streaming responses
- Asynchronous tool calling support
- Standardized message format across providers
- Well-documented and maintained

**Trade-offs:**
- Adds dependency on Vercel ecosystem
- Abstraction layer may limit flexibility
- Vendor lock-in risk

**Outcome:** Excellent choice, dramatically simplified AI integration

### Decision: No Tests

**Rationale:**
- Personal site, not mission-critical application
- Solo developer, no team coordination
- Faster iteration without test maintenance
- Manual testing sufficient for UI/UX validation
- "No tests needed baby"

**Trade-offs:**
- Regressions possible when refactoring
- No confidence in automated deployments
- May introduce bugs without noticing

**Outcome:** Acceptable for personal project, enables faster shipping

### Decision: Code on Main, No Staging

**Rationale:**
- Solo developer, no collaboration overhead
- Vercel provides instant rollbacks if needed
- Faster iteration without branch management
- Personal site can tolerate occasional issues

**Trade-offs:**
- No safety net before production
- Potential for broken deployments
- Can't test in production-like environment

**Outcome:** Works well for solo builder mentality approach

### Decision: Terminal Aesthetic

**Rationale:**
- Looks incredibly impressive to all audiences
- Stands out from typical portfolio sites
- Conveys technical competence and personality
- Fun to build and maintain
- "Intimidates and awes" visitors

**Trade-offs:**
- May not work well in older browsers
- Accessibility concerns with custom styling
- Risk of being "too much" for some visitors

**Outcome:** Major success, core differentiator of the site

---

## 6. API Design

### Content Copilot API

**Endpoints:**

#### POST `/api/content-copilot/regular`

**Purpose:** AI-assisted content creation via natural conversation

**Request:**
```typescript
{
  id?: string,                       // Optional message ID
  messages: Message[],               // Conversation history (UIMessage[])
  documentId: string,                // Sanity document ID
  conversationId: string | null,     // Existing conversation or null
  schemaType: string,                // Document type ('project', etc.)
  serializableSchema: SerializableSchema,  // Schema definition
  documentData: Record<string, any>  // Current document state
}
```

**Response:** Streaming text response with tool calls
- Uses `streamText` from Vercel AI SDK
- Streams assistant responses in real-time
- Executes tools asynchronously
- Saves conversation to Supabase on completion

**Tools Available:**
- `writeTool` - Write to any document path
- `deleteTool` - Delete from any document path
- `arrayTool` - Array operations (add, remove, update)
- `queryTool` - Query Sanity documents
- `getRelatedDocument` - Fetch related documents
- `getAllDocumentTypes` - List available schemas
- `listDocumentsByType` - List documents by type
- `getRepositoryDetails` - Fetch GitHub repo info

#### POST `/api/content-copilot/refinement`

**Purpose:** Focused conversation for improving existing content

**Request:** Same as regular mode

**Response:** Same streaming pattern
- Creates linked conversation (parent reference)
- Focuses on specific field improvements
- Uses same tool set

### Conversation Management API

#### GET `/api/conversation/get?id=<conversation_id>`

**Purpose:** Retrieve conversation by ID

**Response:**
```typescript
{
  conversation: {
    id: string,
    title: string,
    conversation_type: string,
    context: any,
    created_at: string,
    updated_at: string
  },
  messages: Array<{
    id: string,
    role: 'user' | 'assistant' | 'tool',
    content: string,
    parts: MessagePart[],
    sequence: number,
    created_at: string
  }>
}
```

#### POST `/api/conversation/save-message`

**Purpose:** Save single message to conversation

**Request:**
```typescript
{
  conversationId: string,
  message: {
    role: 'user' | 'assistant' | 'tool',
    content: string,
    parts: MessagePart[]
  }
}
```

#### POST `/api/conversation/save-messages`

**Purpose:** Batch save messages to conversation

**Request:**
```typescript
{
  conversationId: string,
  messages: Message[]
}
```

---

## 7. Component Architecture

### Design System

**Terminal UI Components:**
- Terminal windows with window controls
- Command prompts with typing effects
- Scan line animations
- Cursor effects (blinking, typewriter)
- Terminal cards with borders and shadows
- Status badges with terminal styling

**ShadCN UI Primitives:**
- Button, Dialog, Form, Input, Label
- Select, Dropdown, Popover, Tooltip
- Accordion, Tabs, Separator
- Alert Dialog, Toast, Sheet
- Command (search interface)
- And 20+ more components

### Page Components

**Home Page Components:**
- `WelcomeIntro` - Boot sequence animation (first visit only)
- `HeroRefactored` - Interactive terminal hero with typing animation
- `ProjectSection` - Featured project showcase with rich media
- `ThingsILove` - Tech preferences and tools
- `DeveloperJourney` - Career timeline
- `Testimonials` - Social proof
- `ContactCTA` - Call to action

**Project Components:**
- `ProjectCard` - Terminal-styled project card with status badge
- `ProjectGrid` - Filterable grid with search and category filters
- `ProjectHeader` - Project page header with window controls
- `ProjectDetailTabs` - Tabbed interface (Overview, Challenges, Tech)
- `ProjectOverview` - Problem, solution, approach sections
- `ProjectMediaCarousel` - Image/video gallery with controls

**Content Copilot Components:**
- `ContentCopilotView` - Main chat interface with useChat hook
- `AutoPreviewPane` - Side-by-side preview in Sanity Studio
- `ToolDisplay` - Renders tool call results with syntax highlighting
- Tool-specific display components for each tool type

### Component Patterns

**Terminal Container Pattern:**
```tsx
<div className="terminal-window bg-zinc-900 border border-primary/20 rounded-md">
  <div className="terminal-header flex items-center gap-2 px-4 py-2">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
    <span className="text-xs text-primary/60 ml-2">{title}</span>
  </div>
  <div className="terminal-content p-4 font-mono">
    {children}
  </div>
</div>
```

**Command Prompt Pattern:**
```tsx
<div className="flex items-center gap-2">
  <span className="text-primary/80">$</span>
  <span className="text-primary/60">{command}</span>
  <span className="animate-pulse">▌</span>
</div>
```

**Status Badge Pattern:**
```tsx
<Badge variant={status === 'active' ? 'default' : 'secondary'}>
  <StatusIcon className="w-3 h-3 mr-1" />
  {status.toUpperCase()}
</Badge>
```

---

## 8. Content Copilot Architecture

### Overview

Content Copilot is a **sophisticated AI-assisted content creation system** that solves the problem of tedious form-filling in Sanity Studio. It uses a conversational approach to naturally extract information and populate structured fields.

**Key Innovation:** Three-phase conversation flow (Story, Transition, Field-Focused) that prioritizes natural interaction while gradually populating structured data.

**Current Status:** Fully operational after fixing draft document ID resolution and API permissions issues.

### Architecture Layers

#### 1. Frontend Layer

**Component:** `ContentCopilotView.tsx`
- Uses Vercel AI SDK's `useChat` hook
- Manages conversation state
- Renders messages with tool results
- Custom `ToolDisplay` components for each tool type
- Side-by-side with Sanity Studio (via AutoPreviewPane)

**Integration:** `AutoPreviewPane.tsx`
- "Super hacky" integration with Sanity Studio
- Hidden field in schema enables auto-preview
- Provides side-by-side view of conversation + document

#### 2. API Layer

**Routes:**
- `/api/content-copilot/regular` - Main creation mode
- `/api/content-copilot/refinement` - Improvement mode

**Flow:**
1. Receive messages and document context
2. Create/retrieve Supabase conversation
3. Generate system prompt with schema and document state
4. Stream AI response with tool calling
5. Execute tools asynchronously (Sanity mutations)
6. Save conversation on completion

#### 3. Tool Layer

**Primitive Operations Architecture:**
- `writeTool` - Write value to any path in document
- `deleteTool` - Delete value from any path
- `arrayTool` - Array operations (append, remove, update, reorder)
- `queryTool` - Query Sanity documents with GROQ

**Design Philosophy:**
- Primitive operations can manipulate ANY part of document structure
- No hardcoded field mappings required
- Direct Sanity API calls for flexibility
- Rich feedback on success/failure

**Tool Example (writeTool):**
```typescript
writeTool = tool({
  description: 'Write/set a value at any path in a Sanity document',
  parameters: z.object({
    documentId: z.string(),
    path: z.string(),  // e.g., "title", "technologies[0].name"
    value: z.any(),
    createIfMissing: z.boolean().optional()
  }),
  execute: async ({ documentId, path, value }) => {
    // Resolve draft vs published document ID
    let resolvedId = documentId;
    if (!documentId.startsWith('drafts.')) {
      try {
        const draftId = `drafts.${documentId}`;
        const draftDoc = await sanityClient.getDocument(draftId);
        if (draftDoc) {
          resolvedId = draftId;
        }
      } catch (error) {
        // Draft doesn't exist, use published ID
      }
    }

    // Use Sanity mutations API to update document
    const writeResult = await writeToPath(resolvedId, path, value);

    // Check if write actually succeeded
    if (!writeResult.success) {
      return {
        success: false,
        operation: "write",
        errorType: "WRITE_FAILED",
        errorMessage: writeResult.error?.message || "Failed to write to document",
        suggestion: "Check Sanity API permissions and document state."
      };
    }

    return {
      success: true,
      message: `Updated ${path} to "${value}"`,
      documentId: resolvedId,
      path,
      newValue: value
    };
  }
});
```

**Key Improvements:**
- Draft document ID resolution (tries `drafts.{id}` first)
- Proper error checking of write operation result
- Accurate success/failure reporting

#### 4. Prompt Layer

**System Prompt:** `generateContentCopilotSystemPrompt()`

**Key Elements:**
- Identity: "You are Dave, Will's AI assistant"
- Context: Operating in Sanity Studio for content creation
- Purpose: Foster natural conversation, understand complete story
- Conversation Phases: Story → Transition → Field-Focused
- Schema Information: Serialized schema with field descriptions
- Document State: Current document data
- Tool Descriptions: What each tool does

**Three-Phase Approach:**
1. **Story Phase (3-5 messages):** Focus on understanding project narrative
2. **Transition Phase:** Continue conversation while populating fields
3. **Field-Focused Phase:** Refine specific fields and complete missing data

#### 5. Persistence Layer

**Supabase Storage:**
- Conversations table: Metadata and context
- Messages table: Individual messages with parts (text, tool calls, results)
- Parent-child relationships for refinement conversations

**Message Format (Vercel AI SDK):**
```typescript
{
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Let me update that...' },
    {
      type: 'tool-call',
      toolCallId: 'call_123',
      toolName: 'writeTool',
      args: { documentId: '...', path: 'title', value: 'New Title' }
    },
    {
      type: 'tool-result',
      toolCallId: 'call_123',
      toolName: 'writeTool',
      result: { success: true, message: 'Updated title' }
    }
  ]
}
```

### Known Implementation Details

**Draft Document Handling:**
- Sanity documents in Studio have `drafts.{id}` prefix
- All write operations must use `resolveDocumentId()` helper
- Helper tries draft version first, falls back to published
- Implemented in: `helpers.ts` (writeToPath, deleteFromPath, performArrayOperation)
- Also in: `improvedSanityTools.ts` (writeTool, deleteTool, arrayTool)

**API Permissions:**
- Sanity API token requires editor/write permissions (not just read)
- Configured in Sanity dashboard
- Environment variable: `SANITY_API_TOKEN`

**Message Display Logic:**
- User messages: stored with `parts: [{type: 'text', text: '...'}]`
- UI expects `content` field for simple user messages
- Transformation logic in: `messagesManager.ts` (loadChat) and `/api/conversation/get`
- Assistant messages: keep complex `parts` structure for tool calls

---

## 9. Routing & Navigation

### Public Routes

**Visible in Navigation:**
- `/` - Home page
- `/projects` - All projects grid
- `/consulting` - Consulting services

**Not in Navigation (Deprecated or Experimental):**
- `/about` - About page (exists but hidden)
- `/stats` - Stats page (experimental, undefined vision)
- `/dave` - Dave AI Assistant (incomplete UI)

### Dynamic Routes

**Project Detail Pages:**
- `/projects/[slug]` - Individual project pages
- Static generation with `generateStaticParams`
- ISR revalidation: 3600 seconds (1 hour)

### Admin Routes

**Protected Routes:**
- `/contentCopilot` - Content Copilot interface
- `/studio` - Sanity Studio (Sanity authentication)

### API Routes

**Content Copilot:**
- `POST /api/content-copilot/regular`
- `POST /api/content-copilot/refinement`

**Conversation Management:**
- `GET /api/conversation/get?id=<id>`
- `POST /api/conversation/save-message`
- `POST /api/conversation/save-messages`

### Navigation Component

**Location:** `src/components/custom/navBar.tsx`

**Structure:**
- Sticky top navigation
- Three visible links: All Projects, Home, Consulting
- Dave AI Assistant commented out (ready to enable when complete)
- Radix UI NavigationMenu for accessibility

---

## 10. Styling System

### Tailwind Configuration

**Custom Theme:**
```typescript
{
  colors: {
    // Terminal aesthetic colors
    mainbg: '#FAF5E6',
    darkgreen: '#2F3F3D',
    olivebrown: '#4A4643',
    lightblue: '#B2D2DA',

    // Radix UI tokens
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    // ... and more
  },

  fontFamily: {
    // Monospace fonts for terminal aesthetic
    courierp: ['Courier Prime', 'monospace'],
    cutivemono: ['Cutive Mono', 'monospace'],

    // Additional fonts for variety
    archivenarrow: ['Archivo Narrow', 'sans-serif'],
    barlow: ['Barlow', 'sans-serif'],
    // ... 15+ font families
  },

  animation: {
    'accordion-down': 'accordion-down 0.2s ease-out',
    'accordion-up': 'accordion-up 0.2s ease-out',
    'fade-in': 'fade-in 0.8s ease-in-out forwards',
    'scan': 'scan 4s linear infinite',  // Terminal scan line
  }
}
```

### Design Tokens

**Terminal Aesthetic:**
- Dark backgrounds: `bg-zinc-900`, `bg-black`
- Primary accents: `text-primary`, `border-primary/20`
- Monospace fonts: `font-mono`, `font-courierp`
- Glow effects: `shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]`
- Window controls: Red/yellow/green dots
- Scan lines: Animated overlays

**Component Styling:**
- Cards: `border border-primary/20 rounded-md`
- Buttons: `bg-primary/10 hover:bg-primary/20 transition-all`
- Badges: `px-2 py-1 text-xs font-mono uppercase`
- Inputs: Terminal-styled with cursor effects

### CSS Architecture

**Global Styles:** `app/globals.css`
- CSS variables for theming
- Radix UI base styles
- Custom utility classes

**Component Styles:**
- Tailwind utility classes (primary method)
- CSS Modules (not used)
- Styled Components (not used)
- Inline styles (minimal, dynamic values only)

---

## 11. Performance Optimization

### Build-Time Optimization

**Static Generation:**
- Project pages pre-rendered at build time
- ISR revalidation every 3600 seconds (1 hour)
- `generateStaticParams` for dynamic routes
- Faster initial page loads

**Image Optimization:**
- Next.js Image component
- Automatic WebP conversion
- Lazy loading by default
- Responsive images with `srcset`
- Sanity CDN for CMS images

### Runtime Optimization

**Code Splitting:**
- Automatic with Next.js App Router
- Route-based splitting
- Component-level dynamic imports (where needed)

**Data Fetching:**
- Server components for data fetching
- Parallel data fetching where possible
- Minimal client-side JavaScript

**Asset Optimization:**
- Vercel CDN for static assets
- Gzip/Brotli compression
- Edge caching

### Performance Targets

**Goal:** "Fast enough"
- No specific metrics defined
- Subjective feel is acceptable
- Mobile performance important
- Lighthouse scores nice-to-have, not required

---

## 12. Security & Authentication

### Current State

**No Authentication Required:**
- Public site accessible to all
- Sanity Studio uses Sanity authentication
- No user accounts or login

**API Route Security:**
- No rate limiting implemented
- No CORS configuration visible
- Environment variables for API keys
- Vercel serverless function isolation

**Recommendations:**
- Add rate limiting to API routes
- Implement authentication for admin routes if needed
- Consider CORS headers for API routes
- Validate environment variables at runtime

### Environment Variables

**Required Variables:**
```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID="..."
NEXT_PUBLIC_SANITY_DATASET="..."
NEXT_PUBLIC_SANITY_API_VERSION="..."
SANITY_API_TOKEN="..."  # Read/write access

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."  # Server-side only

# Anthropic
ANTHROPIC_API_KEY="..."

# GitHub (optional)
GITHUB_TOKEN="..."
```

**Management:**
- Local: `.env.local` file (not in repo)
- Production: Vercel environment variables
- No secrets management system
- Manual synchronization required

---

## 13. Development Workflow

### Local Development

**Setup:**
```bash
npm install
# Create .env.local with required variables
npm run dev  # Start dev server on localhost:3000
```

**Sanity Studio:**
- Access at `http://localhost:3000/studio`
- Requires Sanity authentication
- Live preview of content changes

### Deployment Process

**CI/CD:**
- Vercel GitHub integration
- Automatic deployments on push to main
- No staging environment
- Instant rollback capability

**Build Process:**
```bash
npm run build   # Build Next.js app
npm run start   # Start production server
```

### Code Quality

**Linting & Formatting:**
```bash
npm run lint    # ESLint
npm run pretty  # Prettier formatting
```

**No Testing:**
- No test suite implemented
- No CI test runs
- Manual testing only

### Git Workflow

**Branch Strategy:**
- Code directly on `main` branch
- No feature branches
- No pull request process
- Solo developer workflow

**Commit Messages:**
- Informal commit messages
- No strict conventions
- Focus on shipping fast

---

## 14. Dependencies Management

### Critical Dependencies

**Must Not Break:**
- `next` - Core framework
- `react` - UI library
- `sanity` - Content management
- `@supabase/supabase-js` - Database client
- `ai` - Vercel AI SDK
- `@ai-sdk/anthropic` - Claude integration
- `zod` - Schema validation

**High Risk of Breaking Changes:**
- `sanity` - Frequent updates, Content Copilot integration fragile
- `@radix-ui/*` - Many packages, potential breaking changes
- `ai` - Relatively new, API may evolve

### Update Strategy

**Approach:**
- Update when necessary (bugs, security, features)
- No regular update cadence
- Test locally before deploying
- Be prepared for breaking changes

**Known Issue:**
- Sanity version update likely broke Content Copilot
- AutoPreviewPane integration is fragile
- Need to investigate and fix

### Deprecated Code

**Safe to Delete:**
- `src/components/custom/deprecated/magic8ball.tsx`
- `src/components/custom/deprecated/matrixRain.tsx`
- `src/components/custom/deprecated/matrixButton.tsx`

---

## 15. Known Issues & Technical Debt

### Critical Issues

**None - Content Copilot is operational**

### High Priority

**1. Deprecated Code Cleanup (P1)**
- Deprecated components in `/deprecated` folder
- Safe to delete per interview
- Not blocking but adds clutter

**2. About/Stats/Dave Pages Not in Use (P1)**
- About page exists but not in nav
- Stats page experimental with no vision
- Dave AI backend complete but UI missing
- Decision needed: Remove or complete?

### Medium Priority

**3. No Authentication on Admin Routes (P2)**
- Content Copilot accessible without auth
- Relies on obscurity for security
- Should add auth if site becomes public

**4. No Rate Limiting on API Routes (P2)**
- API routes open to abuse
- Could rack up Anthropic API costs
- Acceptable risk for low-traffic site

**5. Environment Variable Validation (P2)**
- No runtime validation of required env vars
- May fail silently if misconfigured
- Add validation on app startup

### Low Priority

**6. No Test Suite (P3)**
- Acceptable per project philosophy
- Risk of regressions during refactoring
- "No tests needed baby"

**7. No Monitoring/Analytics (P3)**
- No error tracking
- No performance monitoring
- No user analytics
- Acceptable for personal site

**8. Accessibility Audit Needed (P3)**
- Terminal aesthetic may have a11y issues
- No keyboard navigation testing
- No screen reader testing
- Not required but nice to have

---

## 16. Future Technical Improvements

### Short-Term (Next Sprint)

**1. Clean Up Deprecated Code**
- Delete deprecated components
- Remove unused dependencies
- Clean up commented code

**2. SEO Optimization**
- Add proper meta tags
- Optimize for "Will Diamond" search
- Add structured data (JSON-LD)
- Improve page titles and descriptions

### Medium-Term (Next 3 Months)

**3. Dave AI Completion (If Use Case Emerges)**
- Build chat UI at `/dave`
- Populate knowledge base in Sanity
- Test conversation quality
- Add to navigation if valuable

**4. Stats Page Vision & Implementation**
- Define what stats to show
- Integrate real data sources (GitHub API, etc.)
- Make it fun and interactive
- Add to navigation

**5. Blog Functionality (If Topics Emerge)**
- Add blog post schema to Sanity
- Create blog list and detail pages
- Use Content Copilot for post creation
- Add RSS feed

### Long-Term (6+ Months)

**6. Site-Wide Terminal Interface**
- Command-line navigation (cd, ls, cat, etc.)
- Virtual file system
- Easter eggs and hidden commands
- Interactive exploration

**7. Vector Search for Dave AI**
- Integrate Supabase pgvector
- Generate embeddings for knowledge base
- Semantic search capabilities
- Improved question answering

**8. Analytics & Monitoring**
- Add error tracking (Sentry?)
- Performance monitoring
- Basic user analytics (privacy-focused)
- Content effectiveness tracking

---

## 17. Code Conventions

### TypeScript

**Style:**
- Strict mode enabled
- Explicit return types optional (type inference preferred)
- Interface over type for object shapes
- Functional components (React)

**Naming:**
- PascalCase for components and types
- camelCase for functions and variables
- UPPER_CASE for constants
- Descriptive names over short abbreviations

**Imports:**
- Use path aliases: `@/` for `src/`
- Group imports: external → internal → relative
- Named imports preferred over default

### React

**Component Style:**
- Functional components only
- Hooks for state management
- Server components by default (App Router)
- Client components when needed ('use client' directive)

**File Organization:**
- One component per file
- Co-locate related components
- Shared UI components in `components/ui`
- Custom components in `components/custom`

### CSS/Styling

**Approach:**
- Tailwind utility classes (primary)
- Custom CSS in globals.css (minimal)
- No CSS modules
- No inline styles (except dynamic values)

**Class Naming:**
- Use `cn()` utility for conditional classes
- Group related utilities
- Maintain readability over brevity

---

## 18. Testing Strategy

**Philosophy:** No tests needed for personal site

**Rationale:**
- Solo developer, no team coordination
- Manual testing sufficient
- Faster iteration without test maintenance
- Acceptable risk for non-critical application

**Manual Testing:**
- Test locally before deploying
- Click through critical paths
- Check on mobile devices
- Verify Sanity Studio integration

**Future Consideration:**
- If site becomes more complex
- If collaborators join
- If downtime becomes costly
- If manual testing becomes burdensome

---

## 19. Monitoring & Observability

**Current State:** No monitoring implemented

**Acceptable for Now:**
- Low traffic volume
- Non-critical application
- Solo developer can respond manually

**Future Additions (If Needed):**
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Log aggregation (Vercel Logs)
- Uptime monitoring (UptimeRobot)

---

## 20. Documentation Standards

### Specification-Driven Development

**Hierarchy:**
1. **project-specification.md** (this file's sibling) - Source of truth for WHAT and WHY
2. **repository-specification.md** (this file) - Source of truth for HOW
3. **Feature Specifications** - Detailed specs for major features
4. **Code Documentation** - Inline comments for complex logic

**When to Update Specs:**
- After significant architectural changes
- When adding major features
- When technical decisions change
- When patterns evolve

**Interview-Based Updates:**
- Capture decisions in real-time
- Document rationale, not just facts
- Update specs based on actual usage
- Reflect reality, not ideals

---

## 21. Changelog

### 2025-09-30 - Initial Repository Specification
- Created repository specification based on interview and codebase analysis
- Documented all technical decisions with rationale
- Captured architecture, data models, and component structure
- Identified known issues (Content Copilot broken, deprecated code)
- Established code conventions and development workflow
- Defined future technical improvements

### 2025-09-30 - Content Copilot Fixed & Schema Simplified
**Schema Migration:**
- Simplified conversations table (removed parent_conversation_id, refinement_type)
- Removed messages JSONB column from conversations (messages table is single source of truth)
- Updated ConversationType: 'content-copilot' | 'dave' (no more mode distinction)
- Messages table now has content_parts (not parts), external_id, proper constraints

**Content Copilot Fixes:**
- Fixed model name configuration (use environment variable)
- Implemented draft document ID resolution in helpers.ts:
  - `resolveDocumentId()` tries `drafts.{id}` first, falls back to published
  - Applied to writeToPath(), deleteFromPath(), performArrayOperation()
- Updated Sanity API token permissions (read → editor)
- Fixed tool error handling:
  - Tools now check writeToPath() result before returning success
  - Proper error propagation from Sanity API
  - Accurate success/failure reporting
- Fixed user message display on page reload:
  - Extract text from simple content_parts into content field
  - Updated both messagesManager.ts and /api/conversation/get
- Removed excessive debug logging (kept essential error logging)

**Cleanup:**
- Deleted temporary migration scripts (analyzeConversations.ts, checkMessagesTable.ts, simplifySchema.sql)
- Updated comments removing "refinement mode" references
- Removed deprecated messages column reference in saveChat()

**Status:** Content Copilot fully operational