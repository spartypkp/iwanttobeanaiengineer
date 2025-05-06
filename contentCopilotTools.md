# Content Copilot Tools

## Current Tools

The Content Copilot currently has the following tools implemented:

### Sanity CMS Document Tools

1. **`writeFieldTool`**
   - **Purpose**: Update a specific field in a Sanity document
   - **Usage**: For simple, factual information clearly stated by the user
   - **Parameters**: 
     - `documentId`: Sanity document ID
     - `fieldPath`: Path to the field (e.g., "title", "description")
     - `value`: The new value to set
   - **Features**: 
     - Supports nested fields with dot notation
     - Handles primitive and complex values
     - Provides success/failure feedback

2. **`addToArrayTool`**
   - **Purpose**: Add an item to an array field in a Sanity document
   - **Usage**: For adding new elements without modifying existing ones
   - **Parameters**:
     - `documentId`: Sanity document ID
     - `arrayPath`: Path to the array field
     - `item`: The item to add to the array
   - **Features**:
     - Automatically generates keys for items
     - Handles both primitive arrays and object arrays
     - Detects array type and formats items appropriately

3. **`removeFromArrayTool`**
   - **Purpose**: Remove an item from an array field by its _key
   - **Usage**: For deleting existing array items
   - **Parameters**:
     - `documentId`: Sanity document ID
     - `arrayPath`: Path to the array field
     - `itemKey`: The _key of the item to remove
   - **Features**:
     - Safe removal with proper error handling
     - Updates document state immediately

## GitHub API Tool Integration Ideas

Based on the available GitHub API tools, here are the most valuable options for enhancing the Content Copilot:

### High Priority Tools

1. **`getRepository`**
   - **Potential Use**: Automatically populate project details from GitHub
   - **Value**: Extract repository description, languages, topics, README content
   - **Project Fields It Could Update**:
     - `title`, `description`, `github`
     - `technologies` (based on languages)
     - `tags` (based on topics)
     - `timeline.status` (based on last commit date)
     - `problem` and `solution` (extracted from README)

2. **`listPullRequests` / `getPullRequest`**
   - **Potential Use**: Extract development challenges and technical insights
   - **Value**: PR descriptions and discussions often contain valuable implementation details
   - **Project Fields It Could Update**:
     - `challenges` (from PR descriptions)
     - `approach` (from PR implementation strategy)
     - `technicalInsights` (from code changes)

3. **`getPullRequestChanges`**
   - **Potential Use**: Extract code samples for technical insights
   - **Value**: Get actual code examples with context for documentation
   - **Project Fields It Could Update**:
     - `technicalInsights.code` (with relevant code snippets)
     - `technicalInsights.description` (with context from PR description)

### Medium Priority Tools

4. **`searchRepositories`**
   - **Potential Use**: Find related projects or technologies
   - **Value**: Discover similar work or complementary tools
   - **Content Creation Benefit**: Suggest related project ideas or technologies

5. **`listIssueComments`**
   - **Potential Use**: Extract user feedback and problem statements
   - **Value**: Issues often contain valuable problem descriptions and user stories
   - **Project Fields It Could Update**:
     - `problem` (from issue descriptions)
     - `challenges` (from reported bugs or feature requests)
     - `learnings` (from problem resolutions)

### Lower Priority Tools

6. **`createIssue`**
   - **Potential Use**: Create content TODOs or improvement requests
   - **Value**: Track content gaps identified during content creation

7. **`labelIssue`**
   - **Potential Use**: Categorize content-related issues
   - **Value**: Organize content improvement tasks

## Implementation Strategy

1. **Phase 1: Repository Data Extraction**
   - Implement `getRepository` to automatically populate project details
   - Create a workflow to suggest fields based on GitHub data

2. **Phase 2: Technical Insights Extraction**
   - Add `getPullRequest` and `getPullRequestChanges` to extract code examples
   - Build a system to suggest technical insights from PR content

3. **Phase 3: Issue-Based Content Enrichment**
   - Implement `listIssueComments` to extract user stories and challenges
   - Create a system to generate problem/solution content from issues

## Technical Architecture Considerations

1. **Authentication**: Implement GitHub OAuth for secure API access
2. **Rate Limiting**: Add request caching and rate limit handling
3. **Data Transformation**: Create adapters to convert GitHub data to Sanity schemas
4. **UI Integration**: Add GitHub URL input with preview of extractable content
5. **Selective Application**: Allow user to choose which fields to update from GitHub data 