## Why

Job seekers often spend significant time crafting customized cover letters, writing follow-up emails, and preparing for interview questions specific to each application. Integrating an intelligent, context-aware AI assistant powered by the GLM-4.5-flash model via Zhipu AI will automate these tedious tasks directly within the dashboard using the candidate's existing application profiles.

## What Changes

- **AI Assistant Workspace (`app/pages/assistant.vue`)**: A new interactive page featuring a clean, responsive chat workspace. Users can discuss job application strategies, get advice, and generate materials.
- **Application Context Mapping**: A sidebar/dropdown selector within the workspace allowing users to choose an existing job application. The details of the application (company, role, missions, skills) are automatically appended as system context for the AI model.
- **Task Shortcuts**: One-click action buttons inside the chat to instantly generate a French cover letter, generate a follow-up email, or simulate a mock interview prep session based on the selected application.
- **API Edge Function (`supabase/functions/ai-assistant/index.ts`)**: A Supabase Edge Function acting as a secure proxy to the Zhipu AI API, utilizing the `glm-4.5-flash` model via `https://open.bigmodel.cn/api/paas/v4/chat/completions`.
- **Navigation Integration (`app/components/AppHeader.vue`)**: Add a navigation link to "Assistant IA" next to the logo for authenticated users.

## Capabilities

### New Capabilities
- `ai-assistant`: Handles job search assistance, tailored cover letter drafting, follow-up generation, mock interview prep, and secure connection to the GLM-4.5-flash backend.

### Modified Capabilities
<!-- None -->

## Impact

- `app/components/AppHeader.vue`: Add navigation linking to `/assistant`.
- `app/pages/assistant.vue`: Core chat workspace page.
- `supabase/functions/ai-assistant/index.ts`: Edge function proxy to Zhipu AI.
- Supabase Secrets: Requires `ZHIPU_API_KEY` configuration.
