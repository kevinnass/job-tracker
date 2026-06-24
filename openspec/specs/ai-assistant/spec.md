# AI Assistant Spec

## Purpose
Specifies requirements for the interactive AI Assistant workspace integrated with Zhipu AI's GLM-4.5-flash model to assist with job search tasks (cover letters, follow-ups, and interview prep).

## Requirements

### Requirement: Navigation to AI Assistant
The system SHALL provide a clear navigation link to the AI Assistant workspace for authenticated users.

#### Scenario: Authenticated user navigates to Assistant
- **WHEN** the authenticated user clicks on the "Assistant IA" link in the header
- **THEN** the system SHALL transition the route to `/assistant` and display the workspace.

### Requirement: Interactive Chat Interface
The workspace SHALL feature an interactive chat interface allowing the user to converse with the AI model.

#### Scenario: User sends message
- **WHEN** the user enters text in the message input and clicks the send button
- **THEN** the system SHALL add the message to the local chat stream, call the proxy Edge Function, display a loading state, and render the AI response.

### Requirement: Application Context Binding
The workspace SHALL allow users to bind an existing job application to the conversation session as active context.

#### Scenario: Selecting an application context
- **WHEN** the user chooses a job application from the context selector
- **THEN** the system SHALL set the active application context, display the selection in the UI, and include its details (company name, profile, missions, skills) in the system prompts sent to the backend.

### Requirement: Predefined Prompt Shortcuts
The workspace SHALL offer quick action buttons to trigger customized job search tasks.

#### Scenario: Generating a cover letter
- **WHEN** a job application context is selected and the user clicks the "Rédiger une lettre de motivation" button
- **THEN** the system SHALL trigger a chat prompt requesting a structured French cover letter adapted to the company name, profile, and missions of the active context.

### Requirement: GLM-4.5-flash Backend Proxy
The backend SHALL route requests securely to the Zhipu AI completions API using the `glm-4.7-flash` model.

#### Scenario: Chat completion request
- **WHEN** the `ai-assistant` Supabase Edge Function is invoked with user chat history
- **THEN** the function SHALL authenticate using the configured `ZHIPU_API_KEY`, format the payload for `glm-4.5-flash`, send it to the Zhipu Big Model endpoint, and return the response.
