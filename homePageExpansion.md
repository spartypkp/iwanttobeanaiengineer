# Home Page Expansion: New Personal Sections

This document outlines two new sections to replace the current DomainExpertise and TechStack components with more personality-driven content.

## 1. "Things I Love" Section

A simpler, more opinionated showcase of technologies and tools that you're passionate about. This section will showcase your technical preferences with your personal take on why they matter.

### Design Approach

- **Simplicity First**: Unlike the complex project showcase, this section should be cleaner and more readable
- **Terminal Card Design**: Maintain the terminal aesthetic but with simpler cards
- **Visual Hierarchy**: Each technology gets equal visual weight with a clear structure
- **Minimal Animations**: Subtle hover effects but nothing too distracting

### Core Features

#### Tech Card Components
- Simple terminal-styled cards with:
  - Technology name/logo
  - Category tag (Data, Frontend, ML, DevOps, etc.)
  - Your personal "love statement" (1-2 sentences)
  - Optional small code snippet or visual showing why you love it
  - "Why it matters" brief explanation

#### Layout Options
- **Option 1**: Horizontal scrolling row of cards on smaller screens, grid on larger screens
- **Option 2**: Tabbed interface with categories (Data, Frontend, etc.)
- **Option 3**: Expanding cards that reveal more details on click/hover

#### Visual Elements
- Small icon representing each technology
- Terminal-styled header with tab completion animation
- Color-coding by category (subtle, not overwhelming)
- Binary/matrix background effect at reduced opacity

### Content Structure

Each "love card" would contain:

```
[Icon/Logo] Technology Name
--------------------
Category: Frontend/Backend/ML/etc.

"This technology changed how I think about X because..."

$ why_i_love_it
> Brief personal take or mini story showing why you're passionate about it

[Optional mini-code example or visual]
```

### Example Entries

1. **PostgreSQL + JSONB**
   - Category: Databases
   - Love statement: "The perfect balance between structured data and flexibility"
   - Why it matters: "Combines the reliability of SQL with document-style operations"
   - Code snippet: Simple JSONB query example

2. **Pydantic**
   - Category: Python Ecosystem
   - Love statement: "Type safety that actually makes sense in Python"
   - Why it matters: "Validates complex data structures with minimal boilerplate"
   - Code snippet: Before/after validation example

3. **3D Force Graph**
   - Category: Visualization
   - Love statement: "Turning complex relationships into intuitive visuals"
   - Why it matters: "Makes complex network data immediately understandable"
   - Visual: Mini example of a force graph (static image)

## 2. "Developer Journey" Section

A more personal timeline showing your evolution as a developer, key milestones, and formative experiences. This provides context for your technical preferences and showcases your growth.

### Design Approach

- **Terminal Timeline**: A vertical timeline styled like a terminal session history
- **Command-Response Pattern**: Each milestone as a command with its output
- **Progressive Disclosure**: Focus on key milestones rather than overwhelming detail
- **Visual Storytelling**: Use terminal elements to tell a story

### Core Features

#### Timeline Elements
- Chronological entries showing your technical evolution
- Each entry includes:
  - Year/date
  - Milestone title
  - Brief description of what you learned or accomplished
  - "Command" and "output" representing the experience
  - Optional small visual (screenshot, logo, etc.)

#### Interaction Options
- **Option 1**: Static timeline with subtle highlight on scroll
- **Option 2**: Click to expand entries for more details
- **Option 3**: Filter timeline by category (Education, Work, Personal Projects)

#### Visual Elements
- Terminal prompt prefixing each entry
- "Running command" animation for active entry
- Timestamp styling like a shell history
- Path indicators showing progression

### Content Structure

The timeline would look like:

```
user@will:~/journey$ history | grep milestone
2015: First encountered Python
> Discovered the joy of automation and fell in love with clean syntax

user@will:~/journey$ cat 2018/postgres_revelation.log
> Found JSONB in Postgres and realized I didn't need MongoDB anymore.
> This changed my entire approach to database design.

user@will:~/journey$ view 2020/ml_journey_began.md
> Started exploring machine learning models and realized the importance
> of proper data pipelines and validation. Pydantic became my go-to tool.
```

### Example Timeline Entries

1. **Early Programming Days (2013)**
   - "First discovered programming through..."
   - Command: `cat beginning_notes.txt`
   - Output: Brief story about how you got started

2. **Framework Awakening (2016)**
   - "When I first understood the power of..."
   - Command: `git log --author="Will" --before="2017" --oneline | grep "eureka"`
   - Output: Description of framework revelation

3. **AI Engineering Pivot (2021)**
   - "My journey into AI engineering began when..."
   - Command: `cd ./career && ls -la transformation/`
   - Output: Story of your transition into AI work

## Implementation Considerations

### Shared Design Elements

- Both sections should use the same terminal styling for consistency
- Typography should remain consistent with the rest of the site
- Use the same color scheme, with primary color for accents
- Keep a clean, readable layout despite the terminal aesthetics

### Key Differences from Current Sections

- More personal narrative voice instead of just listing skills/technologies
- Cleaner, more focused cards/timeline entries with less visual complexity
- Stronger emphasis on *why* you like certain technologies, not just what they are
- Timeline approach instead of category cards for experience

### Technical Implementation

#### Things I Love
- Simple card components with consistent sizing
- Flexbox or CSS Grid for layout
- Minimal state management (expand/collapse if interactive)
- Static content with subtle hover effects

#### Developer Journey
- Timeline component with entry styling
- Intersection Observer for scroll animations
- Simple expand/collapse state if needed
- Terminal-like formatting for commands and outputs

### Mobile Considerations

- Cards stack vertically on mobile
- Timeline maintains vertical orientation but condenses spacing
- Touch-friendly tap targets if any interaction is included
- Readable typography at smaller sizes

## Next Steps

1. Select preferred layout approach for each section
2. Gather content (technology favorites and journey milestones)
3. Create simple mockups of both components
4. Implement basic versions without complex animations
5. Integrate with the existing page design
6. Add subtle animations and polish 