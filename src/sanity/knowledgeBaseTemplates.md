# Knowledge Base Templates for Dave AI Assistant

This document provides templates and examples for populating the Knowledge Base entries in Sanity CMS for the Dave AI Assistant.

## Template Categories

Knowledge base items should be categorized for better organization:

- **personal**: Personal information about Will
- **professional**: Professional information, career history, etc.
- **education**: Educational background and credentials
- **projects**: Information about specific projects or project types
- **skills**: Information about technical skills and expertise areas
- **experience**: Work experience and domain knowledge
- **preferences**: Preferences, likes/dislikes, working style
- **faq**: Common questions and answers

## Template Structure

Each knowledge base item should follow this structure:

```
Title: [Brief, descriptive title]
Category: [One of the categories above]
Question: [For FAQ items, the natural language question]
Content: [The main content/answer]
Keywords: [Array of relevant search terms]
Related Projects: [References to relevant projects]
Related Skills: [References to relevant skills]
Priority: [1-10, with 10 being highest priority]
```

## Sample Knowledge Base Items

### Personal Information

```
Title: Will's Background
Category: personal
Question: Who is Will Diamond? / What's your background?
Content: Will Diamond is an AI Engineer who specializes in building applications with Large Language Models (LLMs), vector databases, and modern web technologies. He combines strong technical skills with a focus on creating practical, high-quality solutions. Will has experience in full-stack development, prompt engineering, and building AI-powered tools.
Keywords: ["background", "bio", "about", "will", "diamond", "who", "information", "personal"]
Priority: 10
```

```
Title: Will's Interests
Category: personal
Question: What is Will interested in?
Content: Will is particularly interested in the practical applications of AI, especially how LLMs and other AI technologies can enhance productivity, creativity, and problem-solving. He enjoys exploring the intersection of AI and user experience, creating tools that leverage AI capabilities while providing intuitive interfaces. Outside of work, Will enjoys staying current with ML research papers, hiking, and gaming.
Keywords: ["interests", "hobbies", "likes", "passions", "free time", "personal"]
Priority: 7
```

### Professional Information

```
Title: Current Focus
Category: professional
Question: What is Will currently working on?
Content: Will is currently focused on building AI-powered web applications using Next.js, TypeScript, and the latest LLM APIs. He's particularly interested in exploring RAG (Retrieval Augmented Generation) systems, agentic architectures, and AI-enhanced developer tools. His recent work has centered on creating intelligent assistants like me (Dave) that can represent user knowledge and answer questions effectively.
Keywords: ["current", "now", "focus", "working", "projects", "interests"]
Priority: 9
```

```
Title: Professional Goals
Category: professional
Question: What are Will's career goals?
Content: Will aims to continue growing as an AI Engineer, particularly in the development of innovative tools and applications that leverage LLMs and other AI technologies in practical, useful ways. He's interested in opportunities that allow him to blend his technical skills with product thinking, creating solutions that provide real value. He's passionate about advancing the field of AI tools and infrastructure.
Keywords: ["goals", "career", "ambitions", "future", "plans", "aspirations"]
Priority: 6
```

### Skills Information

```
Title: Core Skills Overview
Category: skills
Question: What are Will's main skills?
Content: Will's core skills include AI Engineering (working with LLMs, embeddings, and vector databases), full-stack web development (with TypeScript, React, and Next.js), and prompt engineering. He's also experienced in Python development, cloud infrastructure (particularly AWS), and has a solid foundation in machine learning concepts. Will combines technical abilities with strong communication skills and business understanding.
Keywords: ["skills", "abilities", "expertise", "technical", "capabilities", "competencies"]
Related Skills: ["AI Engineering", "TypeScript", "React", "Next.js", "Python", "Prompt Engineering"]
Priority: 9
```

```
Title: AI Engineering Expertise
Category: skills
Question: What is Will's experience with AI Engineering?
Content: Will has extensive experience in AI Engineering, particularly working with Large Language Models (LLMs) like GPT and Claude. His expertise includes developing custom RAG systems, creating AI assistants with specific knowledge domains, implementing sophisticated prompting techniques, and building user-friendly interfaces for AI interactions. He's proficient with embedding models, vector databases, and orchestrating complex AI workflows.
Keywords: ["ai", "engineering", "llm", "language models", "gpt", "claude", "embeddings"]
Related Skills: ["AI Engineering", "Prompt Engineering", "LLM APIs"]
Priority: 10
```

### Project Information

```
Title: Portfolio Projects Overview
Category: projects
Question: What projects has Will worked on?
Content: Will has worked on a variety of AI and software projects, including this portfolio website with a terminal-inspired theme and AI assistant (that's me!). Other notable projects include AI-powered productivity tools, specialized RAG systems, and web applications with sophisticated AI features. Each project demonstrates his ability to combine modern web technologies with practical AI applications.
Keywords: ["projects", "portfolio", "work", "examples", "demonstrations", "applications"]
Related Projects: [References to featured projects]
Priority: 8
```

```
Title: Dave AI Assistant Project
Category: projects
Question: How was Dave (the AI assistant) created?
Content: I (Dave) was created as an AI assistant to represent Will on his portfolio site. My implementation uses Claude 3.7 Sonnet with the AI SDK, combined with a custom data layer that connects to Sanity CMS and Supabase. I include RAG functionality with a structured knowledge base, caching for performance, and tools that allow me to access information about Will's projects, skills, and experience to provide accurate responses.
Keywords: ["dave", "assistant", "portfolio", "ai", "implementation", "how"]
Related Projects: [Reference to the portfolio project]
Related Skills: ["AI Engineering", "Claude AI", "RAG", "Next.js"]
Priority: 9
```

### FAQ Items

```
Title: Hiring Will
Category: faq
Question: Is Will available for hire?
Content: Yes, Will is open to discussing new opportunities, particularly in AI Engineering roles that involve working with cutting-edge LLM technologies and building innovative products. He's interested in both full-time positions and contract work, especially with forward-thinking companies that are exploring practical applications of AI. You can contact him through the contact form on this website or via LinkedIn.
Keywords: ["hire", "job", "opportunity", "available", "contact", "work", "employment"]
Priority: 10
```

```
Title: Remote Work Preferences
Category: faq
Question: Does Will work remotely?
Content: Will primarily works remotely and has a strong track record of being highly productive in remote environments. He's set up with a professional home office and all the tools needed for effective remote collaboration. While he's open to occasional in-person meetings, his preference is for remote or hybrid arrangements that emphasize flexibility and focus.
Keywords: ["remote", "work", "location", "office", "hybrid", "virtual"]
Priority: 7
```

## Populating Instructions

When populating the knowledge base in Sanity:

1. Focus on high-priority items first (8-10 priority)
2. Ensure core information about skills, projects, and professional background is covered
3. Include plenty of keywords for each item to improve search capabilities
4. Link knowledge items to relevant projects and skills where applicable
5. Review for factual accuracy and consistency with portfolio content
6. Group related items by category for easier management

## Maintenance Guidelines

The knowledge base should be regularly updated:

1. Add new information as projects, skills, or experience changes
2. Review and update existing entries for accuracy
3. Add new FAQ items based on common questions received
4. Ensure all priority ratings remain consistent
5. Check that relationships between items are maintained

Remember that the knowledge base is the primary source of information for Dave, so keeping it accurate and comprehensive is essential for the AI assistant to function effectively. 