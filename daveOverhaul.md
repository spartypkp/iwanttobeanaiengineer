# Dave AI Assistant Overhaul Plan

## Overview
This document outlines the plan for transforming "Dave" from a placeholder AI assistant into a fully functional AI-powered portfolio representative using Anthropic's Claude API. The focus is on creating an MVP that demonstrates AI engineering capabilities while providing genuine value to portfolio visitors.

## MVP Requirements

### Core Functionality
- **AI-Powered Responses**: Replace canned responses with real-time AI generation via Claude API
- **Knowledge Base Integration**: Equip Dave with comprehensive knowledge about Will's skills, experience, and projects
- **Terminal-Inspired UI**: Enhance the current interface with terminal aesthetics consistent with the site
- **Basic Conversation Memory**: Maintain context throughout a conversation session

### Technical Approach

#### AI Integration
- **API**: Anthropic Claude API (latest available model)
- **Architecture**: 
  - Serverless function to handle API requests to Claude
  - Client-side state management for conversation history
  - Vector database for RAG implementation (Pinecone or similar)

#### Knowledge Sources
- **Primary Content**:
  - Resume and professional experience
  - Project details and technical implementations
  - Skills and technology expertise
  - Portfolio site content

#### Prompt Engineering
- **Base System Prompt**: Core identity and behavior guidelines for Dave
- **Retrieval Augmentation**: Dynamic content fetching based on query context
- **Conversation Memory**: Previous messages included in context window

### User Experience

#### Interface Enhancements
- **Terminal Styling**: 
  - Monospace font for messages
  - Command prompt indicator (`dave@portfolio:~$`)
  - Cursor animation in chat
  - Terminal window decorations (header bar, minimize/maximize buttons)
  
- **Interaction Improvements**:
  - Typing indicator during response generation
  - Message timestamps in terminal format
  - Code syntax highlighting in responses
  - Support for markdown in messages

#### Guided Interaction
- **Suggested Questions**: 
  - Initial set of 3-5 common questions for visitors to easily click
  - Dynamically suggested follow-up questions based on conversation
  - Help command that shows available topics

## Implementation Plan

### Phase 1: Backend Setup
1. Create serverless function for Claude API integration
2. Implement basic prompt engineering with system instructions
3. Set up secure API key management
4. Create basic knowledge retrieval mechanism

### Phase 2: Frontend Enhancements
1. Update chat UI with terminal styling
2. Implement conversation state management
3. Add typing indicators and loading states
4. Create suggested questions component

### Phase 3: Knowledge Integration
1. Organize portfolio content into queryable format
2. Implement RAG with relevant content chunks
3. Create specialized prompt templates for different question types
4. Implement basic conversation memory

### Phase 4: Testing and Refinement
1. Test with common portfolio visitor questions
2. Refine prompts based on response quality
3. Optimize token usage and response time
4. Implement error handling and fallbacks

## Technical Specifications

### API Implementation
```typescript
// Example serverless function structure
export async function POST(request: Request) {
  const { messages } = await request.json();
  
  // Retrieve relevant content based on query
  const relevantContent = await getRelevantContent(messages[messages.length - 1].content);
  
  // Construct prompt with context
  const enhancedMessages = enhanceWithContext(messages, relevantContent);
  
  // Call Claude API
  const response = await anthropic.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    messages: enhancedMessages,
    system: DAVE_SYSTEM_PROMPT
  });
  
  return Response.json({ response: response.content });
}
```

### System Prompt Draft
```
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
```

## Future Enhancements (Post-MVP)

### Advanced Features
- **Interactive Resume Navigation**: Guide users through specific sections of resume with links
- **Project Explorer Mode**: Deep-dive explanations of specific projects with visuals
- **Code Sample Generation**: Create example code based on Will's coding style
- **Comparative Analysis**: Compare Will's skills to job requirements user provides
- **Technical Debugging**: Allow users to paste code/problems for Dave to analyze
- **Persistent Memory**: Remember returning visitors and previous conversations

### Technical Improvements
- **Fine-tuning**: Train Claude on Will's writing style and communication patterns
- **Multi-modal Integration**: Support image analysis and generation related to projects
- **Analytics Integration**: Track common questions and satisfaction metrics
- **Performance Optimization**: Caching common responses and pre-computing embeddings

## Success Metrics
- **Response Quality**: Accuracy of information about Will's background and skills
- **User Engagement**: Average conversation length and return visitor rate
- **Conversion**: Click-through to contact form after Dave interaction
- **Technical Performance**: Response time and token efficiency
- **Feedback**: Direct user ratings or comments about Dave's helpfulness

## Resource Requirements
- **API Costs**: Estimated Claude API usage and associated costs
- **Development Time**: Engineering hours required for implementation
- **Ongoing Maintenance**: Regular updates to knowledge base and prompts
- **Testing**: User testing sessions to refine interactions

## Timeline
- **MVP Development**: 2-3 weeks
- **Testing and Refinement**: 1 week
- **Launch**: End of month
- **Iterative Improvements**: Ongoing post-launch

## Conclusion
This MVP approach allows for quickly transforming Dave from a placeholder to a functional AI assistant while demonstrating AI engineering capabilities. The initial implementation focuses on core functionality with a clear path for future enhancements based on user interaction and feedback. 