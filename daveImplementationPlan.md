# Dave AI Assistant Implementation Plan with Vercel AI SDK

## Technology Stack

- **Model Provider**: Anthropic Claude
- **Frontend Framework**: Next.js App Router
- **AI Integration**: Vercel AI SDK
- **Styling**: Tailwind CSS with custom terminal aesthetics
- **Type Safety**: TypeScript with Zod for schema validation

## Setup Steps

### 1. Install Dependencies

```bash
npm install ai @ai-sdk/react @ai-sdk/anthropic zod
```

### 2. Environment Configuration

Create/update `.env.local` with:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## Implementation Structure

### API Route Handler

Create a route handler at `app/api/dave/route.ts`:

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// System prompt to establish Dave's persona
const DAVE_SYSTEM_PROMPT = `
You are Dave, an AI assistant created by Will Diamond to represent him on his portfolio website. Your purpose is to help visitors understand Will's skills, experience, and projects.

STYLE AND TONE:
- Knowledgeable but conversational and friendly
- Technical when appropriate but clear and accessible
- Occasionally witty but primarily focused on providing value
- Confident about Will's abilities based on factual information
- Terminal-inspired in your presentation (concise, direct)

KNOWLEDGE BASE:
- Will is an AI Engineer with expertise in [specifics from resume]
- His key projects include [project details]
- His technical skills span [skill details]
- His professional experience includes [experience details]

GUIDELINES:
- Answer questions about Will's professional background accurately
- Highlight relevant projects when discussing skills
- Be honest about limitations - if you don't know something, say so
- Keep responses concise and information-dense
- Format code examples with proper syntax highlighting
- When relevant, suggest viewing specific portfolio sections for more details

PROHIBITED:
- Don't invent credentials, projects, or experience not in your knowledge base
- Don't provide personal contact information beyond what's on the portfolio
- Don't claim to be Will himself - you represent him as Dave
- Don't discuss the specific technical details of how you were implemented
`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-opus-20240229'),
    system: DAVE_SYSTEM_PROMPT,
    messages,
    tools: {
      getProjectDetails: tool({
        description: 'Get detailed information about a specific project',
        parameters: z.object({
          projectName: z.string().describe('The name of the project to get details for'),
        }),
        execute: async ({ projectName }) => {
          // This would be replaced with actual retrieval logic from your projects database
          // For now, returning mock data
          return {
            name: projectName,
            description: `Description for ${projectName}`,
            technologies: ["React", "TypeScript", "Next.js"],
            githubUrl: `https://github.com/spartypkp/${projectName}`,
            // Additional details would be populated here
          };
        },
      }),
      getSkillExpertise: tool({
        description: 'Get Will\'s expertise level and experience with a specific skill or technology',
        parameters: z.object({
          skill: z.string().describe('The skill or technology to get expertise information for'),
        }),
        execute: async ({ skill }) => {
          // This would be replaced with actual skill data
          return {
            skill,
            expertiseLevel: "Advanced",
            yearsExperience: 3,
            relatedProjects: ["Project A", "Project B"],
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
```

### Terminal-Styled UI Component

Create a new file at `src/components/custom/terminalChat.tsx`:

```typescript
'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Send, X, Minus, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalChatProps {
  initialMessages?: any[];
  className?: string;
}

export const TerminalChat: React.FC<TerminalChatProps> = ({
  initialMessages = [],
  className,
}) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/dave',
    initialMessages,
    maxSteps: 3, // Allow multi-step tool execution
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Simulate typing indicator when loading
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      // Keep typing indicator visible for a short time after response starts
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className={cn("flex flex-col rounded-md border border-zinc-800 shadow-md overflow-hidden bg-black text-green-400", className)}>
      {/* Terminal header */}
      <div className="flex items-center p-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex space-x-2 mr-4">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="text-xs font-mono text-zinc-400 flex-1 text-center">dave@portfolio:~</div>
        <div className="flex space-x-2">
          <button className="text-zinc-400 hover:text-zinc-200">
            <Minus size={14} />
          </button>
          <button className="text-zinc-400 hover:text-zinc-200">
            <Square size={14} />
          </button>
          <button className="text-zinc-400 hover:text-zinc-200">
            <X size={14} />
          </button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-black font-mono text-sm h-[400px] terminal-scrollbar">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="mb-4 terminal-text">
            <pre className="text-xs text-green-400 mb-4">
{`
 ______   _______  __   __  _______ 
|      | |   _   ||  | |  ||       |
|  _    ||  |_|  ||  |_|  ||    ___|
| | |   ||       ||       ||   |___ 
| |_|   ||       ||       ||    ___|
|       ||   _   | |     | |   |___ 
|______| |__| |__|  |___|  |_______|
                                     
`}
            </pre>
            <p className="text-green-400">Welcome to Dave Terminal v1.0.0</p>
            <p className="text-zinc-500">Will Diamond's AI Assistant</p>
            <p className="text-zinc-500 mb-4">Type <span className="text-green-500">help</span> for available commands or ask anything about Will's skills and projects.</p>
          </div>
        )}
        
        {/* Message history */}
        {messages.map((message, i) => (
          <div key={i} className="mb-4">
            {message.role === 'user' ? (
              <div className="mb-2">
                <span className="text-yellow-500">visitor@portfolio:~$ </span>
                <span>{message.content}</span>
              </div>
            ) : (
              <div className="mb-2">
                <span className="text-green-500">dave@portfolio:~$ </span>
                {message.parts.map((part, j) => {
                  switch (part.type) {
                    case 'text':
                      return <span key={j} className="whitespace-pre-wrap">{part.text}</span>;
                    case 'tool-invocation':
                      return (
                        <div key={j} className="text-zinc-500 text-xs border-l-2 border-zinc-700 pl-2 my-2">
                          [Tool: {part.toolInvocation.toolName}]<br />
                          <span className="text-zinc-600">
                            {JSON.stringify(part.toolInvocation.toolInput, null, 2)}
                          </span>
                          <br />
                          <span className="text-zinc-400">
                            Result: {JSON.stringify(part.toolInvocation.toolOutput, null, 2)}
                          </span>
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="mb-2">
            <span className="text-green-500">dave@portfolio:~$ </span>
            <span className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-2 bg-zinc-900 flex items-center">
        <span className="text-yellow-500 text-sm mr-2 font-mono">$</span>
        <input
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm"
          value={input}
          placeholder="Ask about Will's skills, projects, or experience..."
          onChange={handleInputChange}
        />
        <button 
          type="submit"
          className="ml-2 text-zinc-400 hover:text-green-500 transition-colors"
          disabled={isLoading}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
```

### CSS Styles

Add these styles to your global CSS file:

```css
/* Terminal aesthetic styles */
.terminal-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.terminal-scrollbar::-webkit-scrollbar-track {
  background: #111;
}

.terminal-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

.terminal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #444;
}

/* Scan lines effect */
.terminal-text {
  position: relative;
}

.terminal-text::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
  opacity: 0.1;
}

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
}

.typing-indicator .dot {
  width: 4px;
  height: 4px;
  margin: 0 1px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
```

### Update Dave Page

Update `src/app/dave/page.tsx`:

```typescript
'use client';

import { TerminalChat } from '@/components/custom/terminalChat';
import DaveIcon from '@/components/custom/dave';

export default function DavePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <div className="mb-4 flex justify-center">
          <DaveIcon size={64} color="#22c55e" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Chat with Dave</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dave is Will&apos;s AI representative. Ask anything about his skills, experience, 
          or projects to learn why he would be a great addition to your team.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
            <h3 className="text-sm font-semibold mb-2 text-zinc-400">Suggested Questions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button className="text-left text-primary hover:underline w-full">
                  What are Will&apos;s core skills?
                </button>
              </li>
              <li>
                <button className="text-left text-primary hover:underline w-full">
                  Tell me about his background in AI
                </button>
              </li>
              <li>
                <button className="text-left text-primary hover:underline w-full">
                  What projects has he worked on?
                </button>
              </li>
              <li>
                <button className="text-left text-primary hover:underline w-full">
                  Why should I hire Will?
                </button>
              </li>
            </ul>
          </div>
          
          <div className="rounded-md border border-zinc-800 p-4 bg-zinc-900/50">
            <h3 className="text-sm font-semibold mb-2 text-zinc-400">Available Commands</h3>
            <div className="text-xs text-zinc-500 font-mono space-y-1">
              <p><span className="text-green-500">help</span> - Show available commands</p>
              <p><span className="text-green-500">projects</span> - List Will&apos;s projects</p>
              <p><span className="text-green-500">skills</span> - Show Will&apos;s skills</p>
              <p><span className="text-green-500">contact</span> - Get contact info</p>
              <p><span className="text-green-500">clear</span> - Clear conversation</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <TerminalChat className="w-full h-[600px]" />
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500">
        <p>
          Powered by Anthropic Claude via Vercel AI SDK. Dave has knowledge about Will&apos;s 
          experience, projects, and skills to provide accurate information.
        </p>
      </div>
    </div>
  );
}
```

## Additional Implementation Details

### 1. Knowledge Base Integration

To provide Dave with accurate information about Will, implement a RAG (Retrieval Augmented Generation) system:

1. **Content Organization**:
   - Create structured data files for projects, skills, and experience
   - Store these in a format that can be easily retrieved

2. **Vector Database Setup**:
   - Use a simple solution like `@xenova/transformers` for embedding generation
   - Store embeddings in a lightweight solution like `@supabase/vector` or local JSON

3. **Retrieval Function**:
   - Implement a function to fetch relevant content based on user queries
   - Add this to the tools API for transparent retrieval

### 2. Command System Implementation

Implement special commands that trigger specific actions:

```typescript
// In route.ts handler
const handleCommand = (command: string) => {
  switch (command.toLowerCase()) {
    case 'help':
      return { type: 'help', content: helpContent };
    case 'projects':
      return { type: 'projects', content: projectsContent };
    case 'skills':
      return { type: 'skills', content: skillsContent };
    // Add more commands as needed
    default:
      return null;
  }
};
```

### 3. TypeScript Schema Definitions

Create type definitions for all data structures:

```typescript
// src/types/dave.ts
export interface ProjectDetail {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  status: 'completed' | 'in-progress' | 'planned';
  highlights: string[];
}

export interface SkillDetail {
  name: string;
  category: 'frontend' | 'backend' | 'ai' | 'data' | 'devops';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
  relatedProjects: string[];
}

// Add more type definitions as needed
```

## Testing Plan

1. **Unit Tests**:
   - Test API route with different queries
   - Validate tool execution and response format

2. **Integration Tests**:
   - Test chat UI with pre-defined conversations
   - Verify terminal styling and animations

3. **Manual Testing**:
   - Test with various common questions about the portfolio
   - Verify response quality and accuracy of information
   - Test edge cases like very long responses or complex queries

## Next Steps After MVP

1. Implement analytics to track common questions and improve responses
2. Add multi-modal capabilities (image uploads, project screenshots)
3. Implement streaming for partial tool results
4. Add persistent session storage to remember conversations
5. Implement feedback mechanism for response quality

## Resource Requirements

- Anthropic API credits (estimated monthly cost based on usage)
- Development time (2-3 days for MVP implementation)
- Content preparation time (1-2 days to structure portfolio content) 