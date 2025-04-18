# Personal Website Documentation

## Project Overview

This repository contains the code for a personal website/portfolio for Will Diamond, an AI Engineer. The website serves as an interactive resume, personal site, and showcase of technical abilities. The project is built using NextJS, React, TypeScript, and ShadCN UI components.

### Project Purpose

The primary goals of this personal website are:
1. Serve as an interactive resume
2. Showcase technical skills and projects prominently
3. Present personality through interactive components
4. Eventually incorporate an AI assistant ("Dave") that can represent the owner
5. Provide a compelling case for potential employers

## Project Structure

```
/
├── public/             # Static assets (images, etc.)
├── src/                # Source code
│   ├── app/            # Next.js app directory
│   │   ├── about/      # About page
│   │   ├── dailyBlogs/ # Blog page (to be removed)
│   │   ├── dave/       # AI assistant page (future implementation)
│   │   ├── projects/   # Projects page
│   │   ├── stats/      # Statistics page (future implementation)
│   │   ├── layout.tsx  # Root layout component
│   │   ├── page.tsx    # Home page
│   │   └── globals.css # Global styles
│   ├── components/     # Reusable components
│   │   ├── custom/     # Custom components for the site
│   │   └── ui/         # ShadCN UI components
│   └── lib/            # Utilities and type definitions
│       ├── hooks/      # Custom React hooks
│       ├── utils/      # Utility functions
│       ├── api.ts      # API functions
│       └── types.ts    # TypeScript type definitions
├── public/             # Static files
├── package.json        # Dependencies and scripts
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Key Components

### Core Layout Components

- **RootLayout (`src/app/layout.tsx`)**: The main layout wrapper that includes the navigation bar and analytics.
- **NavBar (`src/components/custom/navBar.tsx`)**: Navigation menu for the site with links to all major sections.

### Home Page Components

- **Hero (`src/components/custom/hero.tsx`)**: Hero section displaying name, title, tagline, and image.
- **DomainExpertise (`src/components/custom/domainExpertise.tsx`)**: Cards highlighting areas of expertise.
- **TechStack (`src/components/custom/techStack.tsx`)**: Cards showing technical skills categorized by domain.
- **ContactCTA (`src/components/custom/contactCTA.tsx`)**: Call-to-action section for contacting.

### Project Components

- **ProjectCard (`src/components/custom/projectCard.tsx`)**: Card component for displaying project information.
- **Projects Page (`src/app/projects/page.tsx`)**: Page that displays all featured projects.

### Interactive Components

- **HiringQuiz (`src/components/custom/hiringQuiz.tsx`)**: Interactive component that playfully encourages visitors to review the resume.
- **Magic8Ball (`src/components/custom/magic8ball.tsx`)**: Fun interactive component that adds personality to the site.

### UI Components

The project uses ShadCN UI library for consistent styling across the site, with components like:
- Accordion, Card, Dialog, Button
- Form components (Input, Checkbox, etc.)
- Navigation components (NavigationMenu)
- Data display components (Table, Charts)

## Pages

### Home Page (`src/app/page.tsx`)

The landing page includes:
- Hero section with name, title, and tagline
- Domain expertise cards
- Tech stack cards
- Featured projects section (commented out but high priority for implementation)
- Contact CTA

### About Page (`src/app/about/page.tsx`)

A detailed about page with:
- Profile information
- Work experience
- Programming language proficiency visualization
- Development tools and frameworks
- Social media links
- Resume download

### Projects Page (`src/app/projects/page.tsx`)

Features detailed project cards for:
- Daily Blog Builder
- Open Source Legislation
- I Want To Be An AI Engineer
- PGTyped Pydantic

### Future "Dave" AI Assistant Page

Planned as an interactive AI representation of the site owner that can:
- Answer questions about skills and experience
- Showcase personality
- Potentially convince visitors of hiring potential

### Stats Page

Currently undeveloped but planned to showcase interesting metrics and visualizations.

## Technical Stack

### Frontend
- NextJS 14.2.0
- React 18.2.0
- TypeScript
- Tailwind CSS
- ShadCN UI components

### UI Component Libraries
- Radix UI (underlying ShadCN components)
- Lucide React (for icons)
- React Hook Form (for forms)
- Recharts (for data visualization)

### Data Visualization
- Recharts
- D3.js

### Deployment
- Vercel

## Current State of Development

The project is being revitalized with several key focus areas:
- The Featured Projects section is a top priority but currently commented out
- Blog functionality is a relic from a previous version and should be removed
- The "Dave" AI assistant is planned for future implementation
- The Stats page is a canvas for future fun experimentation
- Several interactive components add personality but need integration

## Database Usage

- Previous implementation used InstantDB (primarily for blogs)
- Future database needs (if any) will use Supabase
- No current active database requirements

## Assets

The public directory contains various images used throughout the site:
- Project thumbnails
- Profile picture
- Statistics visualizations

## Development Environment

### Scripts
- `dev`: Run development server with Next.js
- `build`: Build the application
- `start`: Start the production server
- `lint`: Run linter
- `pretty`: Format code with Prettier

## Initial Revitalization Plan

Based on the current state and priorities, the initial revitalization plan includes:

1. **Clean Up Obsolete Code**
   - Remove blog functionality and related components
   - Update navigation to reflect current priorities
   - Clean up commented-out sections that aren't coming back

2. **Project Showcase Enhancement (HIGH PRIORITY)**
   - Design and implement a more prominent Featured Projects section on the homepage
   - Improve the project detail page template
   - Polish, document, and showcase existing projects
   - Consider organizing projects by category or technologies used

3. **Interactive Elements**
   - Properly integrate the existing fun interactive components
   - Ensure they add personality without hampering usability

4. **Foundation for Future "Dave" AI**
   - Maintain basic structure for the future AI assistant
   - Plan integration points without blocking other improvements

5. **Stats Page Concept**
   - Identify interesting metrics to track
   - Design visualizations that highlight skills and accomplishments

## Dependencies

The project uses a comprehensive set of dependencies including:
- React and Next.js ecosystem
- UI libraries (Radix UI, ShadCN)
- Data visualization tools (Recharts, D3)
- AI-related packages (OpenAI, AI) for future AI assistant functionality
- Form handling (React Hook Form)
- And many other utilities for a rich interactive experience 

## Revitalization Progress

The following revitalization steps have been completed:

### 1. Cleaning Up Obsolete Code
- **Removed Blog Functionality**: 
  - Deleted `src/app/dailyBlogs` directory and all blog-related components
  - Removed blog-related components: `blogFeed.tsx`, `blogPreview.tsx`, and blog post components
  - Cleaned up API functions in `api.ts` that were related to blog functionality
  - Removed blog-related types from `types.ts`
  - Removed blog-related dependencies from `package.json` including InstantDB, react-quill, react-markdown, etc.

- **Updated Navigation**:
  - Streamlined the navigation bar by removing commented-out sections
  - Updated menu items to focus on key sections: Home, Projects, About Me, and Statistics
  - Improved the navigation component's code organization

### 2. Project Showcase Enhancement
- **Featured Projects Section**:
  - Created a new `FeaturedProjects` component for the homepage
  - Implemented a responsive grid layout with cards for each featured project
  - Added proper image handling with Next.js Image component
  - Included project details, tags, and links to project pages
  - Updated the homepage to showcase three featured projects
  - Added hover effects including image scaling and gradient overlays
  - Implemented badge system for technology tags
  - Added "View All Projects" button linking to the projects page
  
- **Project Detail Page Improvements**:
  - Enhanced `ProjectCard` component with improved layout and styling
  - Added visual hover effects for better interactivity
  - Improved display of project status, dates, and technologies
  - Better organized project information with clear section headers
  - Added proper button styling for GitHub and live demo links
  
- **Projects Page Enhancements**:
  - Added filtering capability by project status (Active, Maintenance, Archived)
  - Improved layout with better spacing and organization
  - Added project count summary and filtering feedback
  - Added technical skills showcase section aggregating all technologies used

### 3. Interactive Elements
- **Stats Page Implementation**:
  - Created a basic Stats page with sample data visualizations
  - Implemented tabs for different categories of statistics
  - Added various chart types (bar, line, pie, area) for different metrics
  - Provided a foundation for future real data integration
  - Used Recharts library for responsive and interactive visualizations

- **Dave AI Assistant Placeholder**:
  - Created a basic chat interface for the future AI assistant
  - Implemented UI for message history, user input, and responses
  - Added simulated responses to demonstrate the concept
  - Included clear indication that it's a placeholder for future implementation
  - Designed for eventual integration with actual AI capabilities

### 4. Home Page Implementation
- **Homepage Structure**:
  - Implemented a clean, logical flow of components
  - Added a Matrix Rain effect toggle for visual interest
  - Incorporated a welcome terminal message with typewriter effect
  - Integrated Hero, DomainExpertise, and TechStack components
  - Added the new FeaturedProjects section showcasing key work
  - Included ContactCTA component for engagement
  - Added a footer with social links
  - Ensured consistent spacing and styling throughout
  - Made the page fully responsive across all device sizes

### 5. Next Steps
The following items from the revitalization plan still need to be addressed:
- Integrate real data sources for the Stats page
- Implement the actual AI functionality for Dave
- Add more interactive elements to the home page
- Further polish the UI/UX across all pages
- Consider adding a blog functionality replacement focused on technical content 