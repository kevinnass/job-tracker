## MODIFIED Requirements

### Requirement: Application Context Binding
The workspace SHALL allow users to bind an existing job application to the conversation session as active context. When a user profile exists, the system SHALL also inject that profile into the AI system prompt alongside the job application data.

#### Scenario: Selecting an application context with user profile
- **WHEN** the user chooses a job application from the context selector AND a user profile exists for the authenticated user
- **THEN** the system SHALL set the active application context AND include both the job application fields (company name, profile, missions, skills) AND the user's profile (name, title, summary, skills, experience) in the system prompts sent to the backend

#### Scenario: Selecting an application context without user profile
- **WHEN** the user chooses a job application from the context selector AND no user profile exists
- **THEN** the system SHALL behave as before: include only job application fields in the system prompt

### Requirement: GLM-4.7-flash Backend Proxy
The backend SHALL route requests securely to the Zhipu AI completions API using the `glm-4.7-flash` model. The Edge Function SHALL accept an optional `userProfile` field in the request body and inject it into the system prompt.

#### Scenario: Chat completion request with user profile
- **WHEN** the `ai-assistant` Supabase Edge Function is invoked with user chat history AND a `userProfile` object
- **THEN** the function SHALL prepend a formatted profile block to the system prompt before the job application context block, enabling the model to personalize cover letters, follow-up emails, and interview prep with the user's actual background

#### Scenario: Chat completion request without user profile
- **WHEN** the `ai-assistant` Supabase Edge Function is invoked with user chat history but NO `userProfile`
- **THEN** the function SHALL behave as before with no profile injection
