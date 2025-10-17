# Project Specification: I Want To Be An AI Engineer

**Project Name:** Will Diamond's Personal Website & Portfolio
**Domain:** iwanttobeanaiengineer (will-diamond.com)
**Owner:** Will Diamond (@spartypkp)
**Created:** 2025-09-30
**Last Updated:** 2025-09-30
**Status:** Active Production

---

## 1. Project Vision

### Purpose

This website is a **showcase of builder mentality** - a demonstration of experimentation, problem-solving, and the satisfaction of making things work. It serves as both an advanced demo platform and an interactive resume that helps secure future opportunities while remaining fun and personally fulfilling.

The site is an experiment in pushing boundaries: building custom tools that solve real problems (like Content Copilot for easier project documentation), integrating AI in creative ways, and creating an experience that intimidates and awes visitors - technical and non-technical alike.

### Core Philosophy

**"Builder Mentality"**
- Experimentation over perfection
- Solving real problems with custom tools
- Having fun while building
- The satisfaction of making things work
- Learning by doing, not just reading

**"Ship It"**
- No tests needed - iterate and improve based on actual use
- Code on main, deploy fast
- Perfect is the enemy of done
- Batch updates when motivated

### What Makes This Special

This is **not a typical developer portfolio**. It's an advanced demo website with:
- Interactive terminal-inspired aesthetic designed to impress
- AI-powered content management (Content Copilot)
- Sophisticated architecture that showcases technical capability
- Projects that are interactive, scalable, and demonstrate real problem-solving
- A personality that comes through in every interaction

The terminal aesthetic isn't just for show - it's a statement: "I build cool things that work, and I'm not afraid to be bold about it."

---

## 2. Target Audience

Audience priority (in order):

### 1. Myself (Primary)
- This site must be fun and satisfying to work on
- Must solve my own problems (e.g., documenting projects efficiently)
- A playground for experimentation and learning
- A reflection of my personality and interests

### 2. Friends (Secondary)
- People who know me and want to see what I'm building
- Fellow developers and builders who appreciate the craft
- Those who understand the technical choices and appreciate the depth

### 3. Recruiters & Professional Connections (Tertiary)
- Hiring managers at AI companies seeking talented engineers
- Potential consulting clients looking for AI/full-stack expertise
- Professional network who want to understand my capabilities
- People interested in learning more about me professionally

**Key Insight:** The site filters for the right opportunities. If someone is impressed by the terminal aesthetic and builder mentality, they're likely a good fit. If they're put off by it, that's okay too.

---

## 3. Success Criteria

### Primary Goals

**1. Effective Project Showcase**
- Projects are documented thoroughly and compellingly
- Technical depth is evident without being overwhelming
- Problem-solving approach is clear in each project
- Content Copilot makes documentation easy and enjoyable

**2. SEO & Discoverability**
- **Critical:** First Google result for "Will Diamond" is this website
- Discoverable for relevant searches (AI engineer, portfolio, etc.)
- Professional online presence that represents me accurately

**3. Job Search Support**
- Functions as an interactive resume that stands out
- Demonstrates technical capability and builder mentality
- Creates conversation starters in interviews
- Helps secure next role/opportunity

### Secondary Goals

**4. Personal Satisfaction**
- Fun to work on and maintain
- Experiments with new technologies successfully
- Solves real problems (like content creation friction)
- Reflects personality and interests authentically

**5. Professional Credibility**
- Impressive to technical and non-technical audiences
- Demonstrates AI engineering expertise
- Shows full-stack capability
- Establishes consulting credentials

### Metrics (Nice to Have)

- Time saved using Content Copilot for project documentation
- Positive feedback from visitors (friends, recruiters)
- Interview conversion rate improvements
- Google ranking for "Will Diamond"
- Site traffic and engagement (low priority)

---

## 4. Scope & Boundaries

### In Scope (Current)

**Core Pages:**
- Home page with hero, featured projects, journey, testimonials, contact
- Projects page with filterable grid and individual project detail pages
- Consulting page describing services and expertise

**Critical Features:**
- Content Copilot for AI-assisted project documentation
- Sanity CMS integration for content management
- Terminal-inspired UI/UX throughout
- Responsive design for all devices
- Project showcase with rich media (images, videos, code snippets)

**Infrastructure:**
- Next.js 14 App Router architecture
- Sanity CMS with embedded Studio
- Supabase for conversation persistence
- Vercel deployment
- Free tier hosting (cost is negligible)

### In Scope (Future Possibilities)

**Potential Features:**
- Blog posts (topic TBD - maybe technical tutorials, AI learnings, career advice)
- Stats page with real-time metrics (GitHub commits, LOC, fun personal stats)
- Enhanced terminal interface with more interactivity
- Dave AI Assistant (when use case becomes clearer)

### Out of Scope

**Explicitly Not Included:**
- Test suite (not needed for personal site)
- Staging environment (code on main, deploy direct)
- About page (removed from public navigation)
- Stats page (exists but deprioritized until vision is clearer)
- Dave AI Assistant (backend complete, UI deferred until compelling use case)
- Analytics and tracking (low priority)
- User accounts or authentication (not needed)
- Comments or social features
- Blog functionality (maybe future)

### Technical Constraints

**Must Haves:**
- Fast enough performance (no specific benchmarks)
- Works well on mobile
- Sanity Studio embedded and functional
- Content Copilot working reliably
- Environment variables in `.env.local`

**Nice to Haves:**
- Optimal SEO
- Perfect accessibility (not required)
- Comprehensive documentation (specs are enough)
- Advanced performance optimization

---

## 5. User Experience Goals

### Primary Experience: Intimidate and Awe

The site should make visitors think:
- "Wow, this person really knows what they're doing"
- "This is different from every other portfolio I've seen"
- "I want to work with/hire this person"
- (For non-technical visitors) "I don't understand everything, but this is clearly impressive"

### Interaction Principles

**1. Terminal Aesthetic is a Feature**
- Bold, distinctive, memorable
- Conveys technical competence
- Creates a cohesive brand identity
- Fun to interact with

**2. Content Over Chrome**
- Projects are the star
- UI enhances but doesn't distract
- Terminal styling is consistent but not overwhelming
- Clear calls-to-action (contact, view projects)

**3. Progressive Disclosure**
- Home page hooks with featured projects
- Projects page allows deep exploration
- Individual project pages reveal technical depth
- Easy to skim, rewarding to dive deep

**4. Mobile-Friendly**
- Must work well on phones
- Terminal aesthetic adapts gracefully
- Content remains accessible
- Performance is acceptable

### Tone & Voice

**Personality:**
- Confident but not arrogant
- Technical but not elitist
- Playful but professional
- Direct and honest

**Communication Style:**
- Clear and concise
- Shows, doesn't tell
- Technical depth available but not forced
- Personality shines through

---

## 6. Content Strategy

### Current Content Model

**Projects** (Primary Content)
- Batch documentation approach: build several projects, then document together
- Content Copilot makes documentation enjoyable and efficient (when working)
- Rich project details: problem, solution, challenges, technical insights
- Media-rich presentations with images, videos, code snippets
- Technologies tagged by category

**Static Pages**
- Home: Hero, featured projects, journey, testimonials, contact CTA
- Consulting: Services, expertise, contact information
- Projects: Filterable grid with search

### Content Update Cadence

**Reality:** Updates come in batches when motivated
- Build projects over time
- Document when Content Copilot is working and motivation strikes
- No regular schedule required
- Quality over frequency

**Ideal State:**
- Content Copilot makes documentation frictionless
- Projects documented shortly after completion
- Portfolio stays current with latest work

### Future Content

**Blog Posts (Maybe Someday)**
- Topic undefined (technical tutorials? AI learnings? career advice?)
- Low priority until clear value emerges
- Would fit naturally into existing architecture

**Stats/Metrics**
- Fun real-time stats (GitHub, LOC, personal metrics)
- Experimental and playful
- Low priority, high fun factor

---

## 7. Brand Identity

### Visual Identity

**Terminal Aesthetic:**
- Monospace fonts (Courier Prime, Cutive Mono)
- Dark backgrounds with accent colors
- Terminal window controls
- Scan lines and cursor animations
- Command-line style prompts
- Matrix-inspired color schemes

**Color Palette:**
- Primary: Terminal green/cyan accents
- Background: Dark grays and blacks
- Text: High contrast for readability
- Accents: Neon-style highlights

### Personality Traits

**Builder:** Focused on making things work, solving problems, shipping features
**Experimenter:** Willing to try new tech, push boundaries, learn by doing
**Technical:** Deep expertise without being pretentious
**Bold:** Not afraid to stand out or do things differently
**Authentic:** Real projects, real problems, real solutions

### Key Messages

1. **"I build things that work"** - Demonstrated through portfolio of real projects
2. **"I solve real problems"** - Content Copilot, project implementations show practical thinking
3. **"I experiment and learn"** - Trying Sanity after being a "Postgres hardliner"
4. **"I have strong technical skills"** - Architecture, AI integration, full-stack capability
5. **"I'm not your typical developer"** - Terminal aesthetic, builder mentality, bold choices

---

## 8. Technical Philosophy

### Core Principles

**1. Ship Fast, Iterate Later**
- Code on main branch
- No staging environment needed
- Deploy directly to production via Vercel
- Fix issues as they arise

**2. Use the Right Tool for the Job**
- Next.js App Router: Standard for web development
- Sanity: Experimenting with CMS after Postgres background
- Supabase: Right tool for LLM conversation management
- Claude: Better "soft skills" for interviewing and conversation

**3. Solve Real Problems**
- Content Copilot solves documentation friction
- Architecture choices based on actual needs
- Don't over-engineer for hypothetical scenarios

**4. Experiment and Learn**
- Try new technologies (Sanity CMS)
- Build custom solutions (Content Copilot)
- Learn by doing, not just reading
- Embrace "super hacky" solutions if they work

### Development Approach

**Quality Standards:**
- No tests required ("No tests needed baby")
- Code review: Self-review before deploy
- Performance: "Fast enough" is the goal
- Accessibility: Best effort, not strict compliance
- SEO: Important for discoverability

**Maintenance Philosophy:**
- Fix critical issues immediately (e.g., Content Copilot broken)
- Clean up deprecated code when convenient
- Update dependencies when necessary
- Keep it simple and maintainable

---

## 9. Business Context

### Personal Goals

**Immediate (Next 3-6 Months):**
- Fix Content Copilot to enable efficient project documentation
- Document current projects sitting in the backlog
- Optimize for "Will Diamond" Google ranking
- Use site actively during job search

**Medium Term (6-12 Months):**
- Site stays current with latest projects
- Consulting page generates inbound opportunities
- Content Copilot proves its value through regular use
- Experimental stats page if inspiration strikes

**Long Term (1+ Years):**
- Portfolio reflects ongoing growth and experimentation
- Blog posts if natural topics emerge
- Dave AI if compelling use case materializes
- Continue experimenting with new AI features

### Success Scenarios

**Job Search Success:**
- Recruiters/hiring managers are impressed by portfolio
- Site creates conversation starters in interviews
- Terminal aesthetic and Content Copilot demonstrate innovation
- Lands role at AI-focused company

**Consulting Success:**
- Inbound leads from consulting page
- Portfolio demonstrates full-stack + AI expertise
- Projects show practical problem-solving capability
- Site establishes credibility

**Personal Success:**
- Fun to work on and maintain
- Documents projects efficiently
- Reflects personality authentically
- Experiments with interesting technologies
- Friends think it's cool

---

## 10. Risks & Constraints

### Known Risks

**1. Content Copilot Reliability**
- "Super hacky" integration may be fragile over time
- Draft document ID resolution required special handling
- Future Sanity updates could break integration again
- **Mitigation:** Monitor Sanity updates carefully, document integration patterns, consider more robust approach if issues recur

**2. Maintenance Burden**
- Solo developer, no team
- Updates come in batches when motivated
- Dependencies may go out of date
- **Mitigation:** Keep architecture simple, minimize dependencies, accept some staleness

**3. Over-Engineering**
- Risk of adding features that don't serve core goals
- Dave AI backend built but no clear use case yet
- Stats page exists but undefined vision
- **Mitigation:** Stay focused on core mission (showcase projects), defer non-critical features

**4. SEO Competition**
- "Will Diamond" may compete with other Will Diamonds
- Generic portfolio terms highly competitive
- **Mitigation:** Focus on name SEO first, optimize metadata, ensure discoverability

### Technical Constraints

**Free Tier Services:**
- Vercel (hosting)
- Sanity (CMS)
- Supabase (database)
- Anthropic API (negligible cost)
- **Impact:** Must stay within free tier limits (non-issue currently)

**Solo Development:**
- Limited time and attention
- No code review process
- No dedicated QA
- **Impact:** Accept imperfection, prioritize ruthlessly

**Browser Compatibility:**
- Terminal aesthetic uses modern CSS
- May not work perfectly in older browsers
- **Impact:** Acceptable trade-off for target audience

---

## 11. Future Vision

### 1 Year Horizon

**Most Likely:**
- Portfolio is up-to-date with current projects
- Content Copilot works reliably and is used regularly
- Google ranks site first for "Will Diamond"
- Site has helped land new job/opportunities
- Terminal aesthetic has been refined

**Possible:**
- Blog posts have been written (topic TBD)
- Stats page has fun real-time metrics
- Additional AI experiments integrated
- Consulting page has generated leads

**Unlikely but Cool:**
- Dave AI is fully functional with clear value proposition
- Site-wide terminal interface with command navigation
- Community recognition for innovative portfolio approach
- Content Copilot becomes a product for others

### Long-Term Dream

This site evolves into a **living showcase of building in public** - always reflecting current work, experiments, and growth. It becomes known as an example of how to do developer portfolios differently: bold, technical, and genuinely useful.

The builder mentality philosophy spreads: more developers prioritize shipping and experimentation over perfection and over-engineering.

---

## 12. Decision Authority

**Owner:** Will Diamond
**Decision-Making:** Solo - all technical and product decisions made by Will
**Feedback:** Welcome from friends and colleagues, but final decisions remain with Will
**Philosophy:** Trust instincts, experiment freely, course-correct based on actual usage

---

## 13. External Integrations

### Calendly Scheduling Links

**Coffee Chat** (Home Page)
- URL: `https://calendly.com/willdiamond3/coffee-chat`
- Purpose: Casual conversation with friends, fellow developers, and potential collaborators
- Location: Home page contact CTA

**Discovery Call** (Consulting Page)
- URL: `https://calendly.com/willdiamond3/30min`
- Purpose: 30-minute consultation call for potential consulting clients
- Location: Consulting page contact section

**Usage Notes:**
- Links should open in new tab/window
- Terminal-styled buttons for consistency
- Clear CTAs describing what each meeting is for

---

## 14. Related Documentation

- [repository-specification.md](./repository-specification.md) - Technical implementation details
- [project-analysis.md](./features/project-analysis.md) - Comprehensive codebase analysis
- [projectDocumentation.md](../projectDocumentation.md) - Detailed internal documentation
- [README.md](../README.md) - Setup and getting started guide

---

## 15. Changelog

### 2025-09-30 - Initial Specification
- Created project specification based on interview with Will
- Documented vision, goals, audience, and success criteria
- Established scope and boundaries
- Defined technical philosophy and development approach
- Captured current state and future vision

### 2025-09-30 - Content Copilot Fixed & Schema Simplified
- Fixed Content Copilot streaming and document access issues
- Implemented draft document ID resolution for Sanity documents
- Updated Sanity API token permissions (read → editor)
- Fixed tool error handling to report actual failures
- Simplified database schema (removed refinement mode)
- Messages table now single source of truth
- Fixed user message display on page reload
- Cleaned up temporary migration scripts

### 2025-10-17 - Calendly Integration Documentation
- Added External Integrations section with Calendly links
- Coffee Chat link: https://calendly.com/willdiamond3/coffee-chat (for home page)
- Discovery Call link: https://calendly.com/willdiamond3/30min (for consulting page)
- Documented usage notes and purpose for each link