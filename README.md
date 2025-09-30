# Will Diamond - Portfolio & AI Experimentation

**Personal Website & AI Portfolio** • [will-diamond.com](https://will-diamond.com)

A bold, terminal-inspired portfolio showcasing AI engineering projects and experimentation. Built in public as a demonstration of builder mentality and technical capability.

> **Note:** The repo name "iwanttobeanaiengineer" is legacy from the original concept. The production site is at **will-diamond.com**.

## 🏗️ Building in Public

This repo represents my approach to portfolio development: experiment boldly, ship fast, and solve real problems. The code is public not just to showcase the end result, but to share the journey - including the experiments, the "super hacky" solutions, and the satisfaction of making things work.

**For Visitors:** Explore the code, see how I build, and feel free to fork for your own use.
**For Recruiters:** This repo demonstrates real-world problem-solving, architectural thinking, and comfort with modern AI tooling.
**For Me:** A playground for experimentation and a forcing function to document my work.

> **Note:** For detailed technical specifications and architecture decisions, see the [`/specs`](./specs) folder. The specs are designed as living documentation for LLM-assisted development and maintaining long-term context.

---

## Why This Project Exists

**Primary Goals:**
- **Interactive Resume:** Showcase projects and skills in a memorable, technical way
- **Builder Mentality:** Demonstrate experimentation and problem-solving over perfection
- **AI Experimentation:** Push boundaries with AI-powered features like Content Copilot
- **Personal Expression:** Bold terminal aesthetic that stands out from typical portfolios
- **Learn by Doing:** Try new tech (Sanity CMS after being a "Postgres hardliner"), build custom tools, iterate based on real use

**Philosophy:** Ship it. No tests needed. Code on main. Perfect is the enemy of done.

---

## ✨ What Makes This Special

### Terminal Aesthetic
A bold, distinctive UI that intimidates and awes. Monospace fonts, scan line animations, terminal window controls, command prompts. Not just for show - it's a statement: "I build cool things that work."

### Content Copilot (The Flagship Feature)
An AI-powered content creation tool that solves a real problem: the tedium of filling out 30+ fields in Sanity CMS.

**Key Innovation:** Three-phase conversational flow (Story → Transition → Field-Focused) that prioritizes natural conversation while gradually populating structured data.

**Technical Highlights:**
- Primitive tool architecture (`writeTool`, `deleteTool`, `arrayTool`, `queryTool`) can manipulate ANY document structure
- No hardcoded field mappings - works with any Sanity schema
- Draft document ID resolution for seamless Studio integration
- Streaming responses with Vercel AI SDK + Claude 3.7 Sonnet
- Conversation persistence in Supabase for context maintenance

**Status:** Fully operational (recently fixed after Sanity integration challenges)

### Project Showcase
- Rich media (images, videos, code snippets)
- Problem/solution storytelling approach
- Technical insights and learnings for each project
- Filterable grid with search
- Terminal-styled cards throughout

### "Dave" AI Assistant (Backend Complete, UI Pending)
Planned AI persona to answer questions about my skills and experience. Backend with Claude integration is built, waiting for compelling use case before building UI.

---

## 🛠️ Architecture Overview

**Modern Jamstack with AI enhancements:**
- Static generation with ISR (revalidate every hour)
- Server components for data fetching
- API routes for AI features
- Vercel serverless functions

**Key Technical Decisions:**
- **Next.js App Router:** Will's standard for web development, server components for performance
- **Sanity CMS:** Experimenting with CMS after being a Postgres hardliner - wanted to expand horizons
- **Supabase for Conversations:** Right tool for complex LLM conversation management (messages, tool calls, threading)
- **Claude over GPT-4:** Better "soft skills" for conversational interfaces
- **No Tests:** Personal site, solo developer, ship fast and iterate
- **Code on Main:** No staging environment, Vercel rollbacks provide safety net

**The Stack:**
- **Frontend:** Next.js 14 App Router, React 18, TypeScript
- **Styling:** Tailwind CSS, ShadCN UI (Radix UI primitives)
- **CMS:** Sanity (embedded Studio, GROQ queries, custom schemas)
- **AI:** Vercel AI SDK, Anthropic Claude
- **Database:** Supabase (PostgreSQL for LLM conversation persistence)
- **Deployment:** Vercel (free tier)

See [`/specs/repository-specification.md`](./specs/repository-specification.md) for detailed architecture documentation.

---

## 🚀 Running Locally (If You Want to Fork)

**Prerequisites:**
- Node.js 18+
- npm/yarn/pnpm

**Setup:**
```bash
# Clone and install
git clone https://github.com/spartypkp/iwanttobeanaiengineer.git
cd iwanttobeanaiengineer
npm install

# Set up environment variables
cp .env.example .env.local  # You'll need your own API keys
```

**Required Environment Variables:**
```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2024-03-01"
SANITY_API_TOKEN="your-editor-token"  # Needs write permissions

# Supabase (for LLM conversations)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Anthropic (for Content Copilot & Dave)
ANTHROPIC_API_KEY="your-api-key"
DEFAULT_ANTHROPIC_MODEL="claude-sonnet-4-5"
```

**Run development server:**
```bash
npm run dev
# Open http://localhost:3000
# Sanity Studio at http://localhost:3000/studio
```

**Database Setup:**
The Supabase schema is documented in `/specs/repository-specification.md` section 4.

---

## 📁 Project Structure

```
/
├── specs/                          # Living specifications (source of truth)
│   ├── project-specification.md    # Vision, goals, philosophy
│   ├── repository-specification.md # Technical architecture
│   └── features/                   # Feature-specific specs
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # Public pages (home, projects, consulting)
│   │   ├── (admin)/contentCopilot/ # Content Copilot UI
│   │   ├── (sanity)/studio/        # Embedded Sanity Studio
│   │   └── api/                    # API routes (content-copilot, conversation)
│   │
│   ├── components/
│   │   ├── custom/                 # Project showcase, terminal UI
│   │   ├── content-copilot/        # Content Copilot components
│   │   └── ui/                     # ShadCN UI primitives
│   │
│   ├── sanity/                     # Sanity configuration
│   │   ├── schemaTypes/            # Content schemas (project, skill, etc.)
│   │   └── lib/                    # Client, helpers, CRUD operations
│   │
│   └── lib/
│       ├── tools/                  # AI tools (Sanity manipulation, GitHub)
│       ├── utils/                  # Supabase clients, utilities
│       └── prompts.ts              # LLM system prompts
│
├── projectDocumentation.md         # Legacy detailed docs
└── README.md                       # You are here
```

**Key Documentation:**
- [`/specs`](./specs) - Technical specifications (maintained as living docs)
- [`projectDocumentation.md`](./projectDocumentation.md) - Legacy comprehensive docs

---

## 🚢 Deployment

**Platform:** Vercel (automatic deployments from `main` branch)
**Philosophy:** Code on main, no staging, deploy direct to production
**Rollback:** Instant via Vercel dashboard if needed
**Cost:** Free tier for all services (Vercel, Sanity, Supabase, Anthropic usage negligible)

---

## 🔮 What's Next

**Short-term:**
- Document backlog projects using Content Copilot
- SEO optimization (first Google result for "Will Diamond")
- Clean up deprecated components

**Maybe Someday:**
- Complete Dave AI (if compelling use case emerges)
- Blog posts (if natural topics emerge)
- Stats page with real-time metrics (when vision becomes clearer)
- Site-wide terminal interface with command navigation
- Vector search for Dave (Supabase pgvector)

**Philosophy:** Features get built when they solve real problems or spark genuine interest. No roadmap, just motivated iteration.

---

## 📬 Connect

**Will Diamond**

- Website: [will-diamond.com](https://will-diamond.com)
- GitHub: [@spartypkp](https://github.com/spartypkp)
- LinkedIn: [Will Diamond](https://www.linkedin.com/in/will-diamond-b1724520b/)
- Twitter/X: [@itsreallywillyd](https://x.com/itsreallywillyd)

---

## 📝 Notes for Developers

**If you're forking this:**
- You'll need your own Sanity project, Supabase instance, and Anthropic API key
- The Content Copilot integration with Sanity is "super hacky" (uses hidden preview field) but works
- No tests, no staging - embrace the chaos or add structure as you see fit
- The terminal aesthetic uses modern CSS that may not work in older browsers

**If you're a recruiter:**
- This represents my actual working style: experiment, iterate, ship
- The specs show how I think about architecture and documentation
- Content Copilot demonstrates AI tool building and LLM integration
- The "no tests" philosophy is specific to personal projects, not professional work

**If you have questions or ideas:**
- Open an issue or PR
- This is a learning-in-public project, feedback welcome

---

**License:** MIT (or whatever - feel free to use, learn from, or adapt)

Built with builder mentality. Shipped with confidence. Maintained with motivation.
