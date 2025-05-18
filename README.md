# Personal Portfolio & AI Experimentation Platform: "I Want To Be An AI Engineer"

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Assuming MIT, please update if incorrect -->

Welcome to the repository for my personal website and AI experimentation platform! This project serves as an interactive resume, a showcase of my technical abilities, and a playground for AI-driven features.

**Note:** For highly detailed internal documentation, development history, and specific feature deep-dives (primarily intended for LLM-assisted development and my own reference), please see `projectDocumentation.md`.

## Overview

The primary goals of this personal website are:
*   Serve as a dynamic and interactive resume.
*   Showcase my technical skills and projects, particularly in AI engineering.
*   Express my personality through unique, interactive components and a distinct terminal-inspired aesthetic.
*   Develop and integrate "Dave," an AI assistant designed to represent me and engage with visitors.
*   Provide a compelling demonstration of my capabilities to potential employers and collaborators.

## ✨ Key Features

*   **Interactive Terminal UI/UX:** A pervasive terminal-inspired theme provides a unique user experience, with elements like simulated command executions, ASCII art, and retro aesthetics.
*   **Comprehensive Project Showcase:**
    *   **Featured Projects:** Highlighted on the homepage.
    *   **Dedicated Projects Page:** A filterable grid (`/projects`) displaying all projects with options to filter by status, category, and search terms.
    *   **Detailed Project Pages:** Dynamically generated pages for each project (`/projects/[slug]`) featuring rich media (images, videos), problem/solution descriptions, technical challenges, key insights, and technologies used.
    *   **Terminal-Styled Cards:** Consistent and visually appealing project cards and detail views.
*   **Content Copilot (Admin Feature):**
    *   An AI-assisted content creation and editing tool for Sanity CMS, designed to make content management conversational and intuitive.
    *   **Narrative-First Approach:** Employs a unique conversational UX with three distinct phases (Story, Transition, Field-Focused) to naturally extract information and populate content fields without explicit form-filling.
    *   **Advanced Sanity Interaction:** Utilizes a powerful suite of custom-defined primitive tools (`writeTool`, `deleteTool`, `arrayTool`, `queryTool`) built with Zod schemas for precise and flexible manipulation of Sanity documents. These tools provide rich feedback on operations.
    *   **Refinement Mode:** Allows for focused conversations to improve and polish existing content.
    *   **Powered by Vercel AI SDK:** Leverages the `useChat` hook on the frontend and `streamText` on the backend for responsive, streaming interactions with LLMs like Anthropic's Claude.
    *   **Asynchronous Tool Calling:** Supports asynchronous execution of its custom Sanity manipulation tools.
*   **"Dave" AI Assistant (In Progress):**
    *   A planned AI persona to answer questions about my skills, experience, and projects.
    *   Aims to showcase personality and engage visitors interactively.
    *   Backend API built with Vercel AI SDK (Claude 3.7 Sonnet) with tool integration is complete.
    *   Data layer (`dave-data.ts`) connects to Sanity CMS for projects, skills, and a dedicated knowledge base.
*   **Sanity CMS Integration:**
    *   Embedded Sanity Studio (`/studio`) for seamless content management.
    *   Custom, type-safe schemas for projects, skills, knowledge base entries, and more.
    *   GROQ for efficient content retrieval.
*   **Supabase for LLM Operations:**
    *   Utilizes Supabase (PostgreSQL) for robust persistence of LLM conversation history for Content Copilot (and eventually Dave).
    *   Stores complete conversation context, including structured messages (text, tool calls, and tool results) within JSONB fields.
    *   Supports linked conversations for features like Content Copilot's Refinement Mode.
*   **Responsive Design:** Ensures a consistent and accessible experience across various devices and screen sizes.
*   **Interactive Home Page:** Features an animated boot sequence, a refactored Hero section with a simulated terminal interface, domain expertise highlights, and a tech stack overview.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14, React 18, TypeScript
*   **Styling:** Tailwind CSS, ShadCN UI
*   **UI Libraries:** Radix UI (underlying ShadCN), Lucide React (icons)
*   **Data Visualization:** Recharts
*   **Content Management:** Sanity CMS (Embedded Studio, GROQ queries)
*   **AI (Content Copilot & Dave):**
    *   **Vercel AI SDK:** Core for LLM interactions (frontend: `useChat`, backend: `streamText`), asynchronous tool calling, Zod-defined custom tools.
    *   **Anthropic Claude Models** (e.g., Claude 3.7 Sonnet)
*   **Database (for LLM Ops):** Supabase (PostgreSQL)
*   **Deployment:** Vercel

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/spartypkp/iwanttobeanaiengineer.git
    cd iwanttobeanaiengineer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Sanity-specific environment variables (project ID, dataset, API version, token), Supabase connection details (URL, anon key), and any AI-related API keys. Refer to `sanity/env.ts`, `src/lib/utils/supabase/server.ts` (for typical Supabase env var names like `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), and the Vercel AI SDK documentation for required variables.
    Example `.env.local`:
    ```env
    # Sanity
    NEXT_PUBLIC_SANITY_PROJECT_ID="..."
    NEXT_PUBLIC_SANITY_DATASET="..."
    NEXT_PUBLIC_SANITY_API_VERSION="..."
    SANITY_API_READ_TOKEN="..." # If using a token for read access
    SANITY_API_WRITE_TOKEN="..." # For tools that modify Sanity data

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL="..."
    NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
    SUPABASE_SERVICE_ROLE_KEY="..." # If using service role for backend operations

    # AI Provider (e.g., Anthropic)
    ANTHROPIC_API_KEY="..."
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

5.  **Access Sanity Studio:**
    Navigate to `http://localhost:3000/studio` to access the embedded Sanity CMS. You may need to log in with your Sanity credentials.

6.  **Set up Supabase Database:**
    Ensure your Supabase instance is running and the schema (from `src/lib/utils/supabase/schema.sql`) has been applied.

## 📁 Project Structure (Simplified)

```
/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router (pages, API routes, layouts)
│   │   ├── (admin)/    # Admin-specific routes (e.g., Content Copilot)
│   │   ├── api/        # API endpoints (Content Copilot, Dave)
│   │   ├── projects/   # Project listing and detail pages
│   │   └── studio/     # Embedded Sanity Studio
│   ├── components/     # React components (UI, custom, Content Copilot)
│   ├── sanity/         # Sanity CMS configuration, schemas, client, helpers
│   ├── lib/
│   │   ├── prompts.ts  # System prompts for LLMs
│   │   ├── tools/      # Custom AI tools (e.g., improvedSanityTools.ts)
│   │   └── utils/      # Utility functions (Supabase client, schema serialization)
├── projectDocumentation.md # Detailed internal documentation
├── sanity.config.ts    # Sanity Studio main configuration
└── README.md           # This file
```
For a more detailed breakdown, please refer to `projectDocumentation.md`.

## ☁️ Deployment

This project is deployed on [Vercel](https://vercel.com/). The Vercel platform provides seamless integration with Next.js, CI/CD, and serverless functions for API routes. Supabase is used as the backend database for LLM conversation data.

## 🔮 Future Enhancements

*   **Full "Dave" AI Assistant Integration:** Complete the UI for the AI assistant and deploy it site-wide.
*   **Enhanced Stats Page:** Integrate real data sources and build out more interactive visualizations.
*   **Site-Wide Interactive Terminal:** Extend the terminal interface for site navigation and interaction beyond the Hero section.
*   **Knowledge Base Population:** Continue populating the Sanity knowledge base for "Dave".
*   **Vector Search for "Dave":** Integrate Supabase pgvector or another vector database for semantic search capabilities.

## 🧑‍💻 Author & Contact

**Will Diamond**

*   GitHub: [@spartypkp](https://github.com/spartypkp)
*   LinkedIn: [Will Diamond](https://www.linkedin.com/in/will-diamond-b1724520b/)
*   Twitter / X: [@itsreallywillyd](https://x.com/itsreallywillyd)

---

Feel free to explore the code, and don't hesitate to reach out if you have any questions or collaboration ideas!