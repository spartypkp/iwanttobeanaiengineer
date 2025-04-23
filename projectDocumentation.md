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
│   │   ├── studio/     # Embedded Sanity Studio
│   │   ├── layout.tsx  # Root layout component
│   │   ├── page.tsx    # Home page
│   │   └── globals.css # Global styles
│   ├── components/     # Reusable components
│   │   ├── custom/     # Custom components for the site
│   │   └── ui/         # ShadCN UI components
│   ├── sanity/         # Sanity CMS configuration
│   │   ├── lib/        # Sanity utility functions
│   │   ├── schemaTypes/ # Sanity content schemas
│   │   ├── env.ts      # Sanity environment variables
│   │   └── structure.ts # Sanity Studio structure definition
│   └── lib/            # Utilities and type definitions
│       ├── hooks/      # Custom React hooks
│       ├── utils/      # Utility functions
│       ├── api.ts      # API functions
│       └── types.ts    # TypeScript type definitions
├── public/             # Static files
├── sanity.config.ts    # Sanity Studio configuration
├── sanity.cli.ts       # Sanity CLI configuration
├── package.json        # Dependencies and scripts
└── tailwind.config.ts  # Tailwind CSS configuration
```

## Key Components

### Core Layout Components

- **RootLayout (`src/app/layout.tsx`)**: The main layout wrapper that includes the navigation bar and analytics.
- **NavBar (`src/components/custom/navBar.tsx`)**: Navigation menu for the site with links to all major sections.

### Home Page Components

- **Hero (`src/components/custom/hero-refactored.tsx`)**: Enhanced hero section with an interactive terminal interface featuring:
  - Real-time typing animation for name, title, and tagline
  - Simulated command execution sequence (whoami, skills, github stats)
  - Terminal-inspired styling with window controls and scan lines
  - Two-column layout with terminal on left, profile information on right
  - Skills display organized by category
  - GitHub contributions calendar integration
  - Profile image with overlay effects and status indicators
  - Professional information and social links

- **ContactCTA (`src/components/custom/contactCTA.tsx`)**: Call-to-action section for contacting.

### Project Components

- **ProjectCard (`src/components/custom/projectCard.tsx`)**: Card component for displaying project information.
- **Projects Page (`src/app/projects/page.tsx`)**: Page that displays all featured projects.

### Interactive Components

- **HiringQuiz (`src/components/custom/hiringQuiz.tsx`)**: Interactive component that playfully encourages visitors to review the resume.
- **Magic8Ball (`src/components/custom/magic8ball.tsx`)**: Fun interactive component that adds personality to the site.
- **TerminalContainer (`src/components/custom/terminalContainer.tsx`)**: Terminal-styled container with typewriter effect.
- **MatrixRain (`src/components/custom/matrixRain.tsx`)**: Matrix-style rain background animation toggle.

### UI Components

The project uses ShadCN UI library for consistent styling across the site, with components like:
- Accordion, Card, Dialog, Button
- Form components (Input, Checkbox, etc.)
- Navigation components (NavigationMenu)
- Data display components (Table, Charts)

## Pages

### Home Page (`src/app/page.tsx`)

The landing page includes:
- An interactive boot sequence terminal that transitions to the main content
- Hero section with animated terminal interface and profile
  - Left column: interactive terminal with typing animations and command execution
  - Right column: profile image, current position, previous experience, education, and social links
- Domain expertise cards
- Tech stack cards
- Featured projects section
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
- react-github-calendar (for GitHub activity visualization)

### Content Management
- Sanity CMS
  - Embedded Sanity Studio in Next.js application
  - Custom schema definitions for blog posts, projects, and author data
  - GROQ query language for content retrieval
  - Real-time content updates
  - Customizable content structure with strongly typed schemas

### Data Visualization
- Recharts
- D3.js
- GitHub Calendar

### Deployment
- Vercel

## Current State of Development

The project is being revitalized with several key focus areas:
- The Featured Projects section is a top priority but currently commented out
- Blog functionality is a relic from a previous version and should be removed
- The "Dave" AI assistant is planned for future implementation
- The Stats page is a canvas for future fun experimentation
- Several interactive components add personality but need integration

## Development Roadmap

### MVP Phase
The MVP (Minimum Viable Product) version of the site focuses on core functionality and essential content:
- Complete and polished home page with hero, domain expertise, tech stack and contact sections
- Project showcase with detailed project information
- About page with professional background
- Basic stats page
- Clean, responsive design across all devices
- Matrix/terminal theme and styling

### Post-MVP Features
After the MVP is complete, the following features will be implemented in order of priority:

1. **Interactive Terminal Interface** (Partially implemented in Hero section)
   - Command-line interface that coexists with the traditional UI
   - Navigation of the site using terminal commands (`cd`, `ls`, `cat`, etc.)
   - Virtual file system reflecting website content structure
   - Easter eggs and interactive commands for technical visitors
   - Integration with the visual UI (terminal commands trigger scrolling to sections)

2. **AI Assistant Integration ("Dave")**
   - Interactive AI representation of the portfolio owner
   - Ability to answer questions about skills and experience
   - Showcase personality through conversational interface

3. **Enhanced Stats and Visualizations**
   - Integration with real data sources
   - Dynamic charts and visualizations
   - Interactive elements for exploring data

4. **Technical Blog or Learning Resources**
   - Content focused on AI engineering, ML, and development
   - Code examples and educational resources

## Current Functionality vs. Planned Features

| Feature | Status | Priority | Timeline |
|---------|--------|----------|----------|
| Home Page | Implemented | High | MVP |
| Projects Showcase | Implemented | High | MVP |
| About Page | Implemented | High | MVP |
| Basic Stats Page | In Progress | Medium | MVP |
| Interactive Terminal | Partially Implemented | High | MVP/Post-MVP |
| AI Assistant (Dave) | Placeholder UI | Medium | Post-MVP |
| Technical Blog | Not Started | Low | Post-MVP |

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
  - Enhanced the Developer Journey component with improved navigation
  - Refined UI controls to favor keyboard and button-based navigation over scroll-hijacking
  - Included ContactCTA component for engagement
  - Added a footer with social links
  - Ensured consistent spacing and styling throughout
  - Made the page fully responsive across all device sizes

### 5. User Experience Improvements
- **Navigation Enhancement**:
  - Replaced scroll-hijacking behaviors with more predictable navigation patterns
  - Added prominent visual cues for interactive elements
  - Improved keyboard navigation throughout the site
  - Enhanced terminal-style UI elements for better visual consistency
  - Optimized component interactions to prevent conflicts with main page scrolling
  - Added clearer instructions for interactive components

### 6. Hero Section Enhancement
- **Interactive Terminal Interface**:
  - Implemented a completely redesigned Hero component (`hero-refactored.tsx`)
  - Created a two-column layout with terminal interface on the left and profile on the right
  - Added realistic typing animations with variable speed for natural feel
  - Implemented a command execution sequence that simulates terminal usage
  - Included skills display organized by category in terminal output style
  - Integrated GitHub Calendar to show real GitHub activity
  - Added animated transitions between command execution states
  - Created a realistic terminal UI with window controls, header bar, and scan lines
  - Included a blinking cursor that accurately represents the interaction state

- **Profile Information Display**:
  - Added a profile image with hover effects and overlays
  - Included current position, previous experience, and education information
  - Implemented social links with interactive hover states
  - Created animated transitions for content appearance
  - Added visual decorations like corner borders and gradient overlays
  - Ensured responsive design for different screen sizes

### 7. Next Steps
The following items from the revitalization plan still need to be addressed:
- Complete the MVP version of the site before implementing advanced features
- Integrate real data sources for the Stats page
- Implement the full interactive terminal interface across the entire site
- Implement the actual AI functionality for Dave
- Further polish the UI/UX across all pages
- Consider adding a blog functionality replacement focused on technical content

## Future Interactive Terminal Feature

The interactive terminal interface has been partially implemented in the Hero section. The plan for the complete feature is:

- Extend the terminal interface to allow navigation throughout the entire site
- Support common bash/zsh commands (`ls`, `cd`, `cat`, etc.) for exploring content
- Implement a virtual file system that mirrors the site's content structure
- Add interactive "executable" commands (e.g., `./contact.exe`, `./skills.sh`)
- Provide auto-completion, command history, and error messages
- Integrate with the visual UI (e.g., using `cd projects` would scroll to the projects section)
- Include easter eggs and hidden features for exploration

## Database Usage

- Sanity CMS database for structured content (projects, blog posts)
- Previous implementation used InstantDB (primarily for blogs)
- Future database needs (if any) may use Supabase for user-generated content
- Sanity's CDN for media assets

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

## Dependencies

The project uses a comprehensive set of dependencies including:
- React and Next.js ecosystem
- UI libraries (Radix UI, ShadCN)
- Data visualization tools (Recharts, D3)
- GitHub integration (react-github-calendar)
- AI-related packages (OpenAI, AI) for future AI assistant functionality
- Form handling (React Hook Form)
- And many other utilities for a rich interactive experience 

## Recent Updates

### Home Page Enhancements

The home page has undergone significant improvements to enhance user experience and navigation:

1. **Hero Section Completely Redesigned**
   - Replaced the original Hero component with a new interactive terminal-based interface
   - Implemented real-time typing animations with natural speed variations
   - Created a command execution sequence that demonstrates skills and GitHub activity
   - Added a two-column layout separating the terminal interface from profile information
   - Integrated react-github-calendar to show real GitHub contributions
   - Improved visual styling with terminal-inspired design elements
   - Enhanced profile presentation with image effects and information sections
   - Added smooth transitions and animations for a polished user experience
   - Ensured responsive design for all screen sizes

2. **Developer Journey Component Refinements**
   - Replaced scroll-based navigation with more intuitive arrow-based navigation
   - Added prominent side navigation arrows for easier milestone traversal
   - Enhanced visual styling of navigation controls with better highlighting and transitions
   - Improved accessibility with clearer navigation instructions and keyboard support
   - Simplified the UI by centralizing the navigation guide
   - Made the component more focused on content by removing distractions

3. **Contact CTA Section Redesign**
   - Transformed into a two-column layout with terminal and contact card sides
   - Added animated terminal section that simulates a contact protocol sequence
   - Implemented a blinking cursor effect for authentic terminal feel
   - Created a staged animation that progresses through command execution
   - Designed a modern contact card with terminal-inspired window controls
   - Added decorative corner brackets and scan line animation effects
   - Improved button styling with numbered options ([01], [02], [03]) for each contact method
   - Enhanced status indicators showing availability and response time
   - Maintained consistent terminal aesthetic with the rest of the site
   - Made the component fully responsive with proper order adjustment on mobile

4. **General Homepage Improvements**
   - Optimized the main page structure for smoother navigation
   - Enhanced the terminal aesthetic throughout the site
   - Improved responsive behavior across different screen sizes
   - Fixed interaction issues between component-specific navigation and page scrolling

These updates create a more controlled, intuitive user experience while maintaining the terminal-inspired aesthetic that gives the site its unique character.

## Sanity CMS Integration

The website now incorporates Sanity CMS to manage structured content, providing several significant benefits:

### Sanity Implementation

1. **Embedded Studio**
   - Sanity Studio is embedded directly in the Next.js application at `/studio` route
   - Allows for seamless content management without leaving the application
   - Customized desk structure for optimized content editing experience

2. **Content Schema**
   - Type-safe schema definitions for various content types:
     - Blog posts with rich text capabilities via `blockContentType`
     - Author profiles with bio and contact information
     - Categories for content organization
     - Future implementation will include project schemas

3. **Data Flow Architecture**
   - Client configuration for content fetching with `next-sanity`
   - Environment variable management for secure project connections
   - Optimized querying with GROQ in the Sanity Vision tool

### Benefits for Project Structure

1. **Content Separation**
   - Clear separation between content and presentation layers
   - Structured content models enable consistent rendering across the site
   - Reduced data duplication with a single source of truth

2. **Developer Experience**
   - Type-safe schema definitions and strongly typed content
   - Real-time content updates with Live Preview capabilities
   - Simplified content queries through GROQ or GraphQL

3. **Future Extensibility**
   - Planned unified project schema to replace hard-coded project data
   - Enhanced filtering and sorting capabilities powered by Sanity queries
   - Potential for internationalization and localized content

### Next Steps for Sanity Integration

1. **Project Schema Migration**
   - Create comprehensive project schemas based on the unified model
   - Migrate existing project data from static files to Sanity
   - Implement query interfaces for featured vs. non-featured projects

2. **Advanced Media Management**
   - Utilize Sanity's image pipeline for optimized media delivery
   - Implement responsive image handling with art direction
   - Create custom asset metadata for improved organization

3. **Content Relationships**
   - Define relationships between projects, technologies, and other content types
   - Create reusable components for consistent content presentation
   - Build advanced filtering based on content relationships 