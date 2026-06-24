## 1. Backend Proxy Configuration

- [x] 1.1 Create the Supabase Edge Function `supabase/functions/ai-assistant/index.ts` implementing the Zhipu AI API proxy for the `glm-4.5-flash` model.
- [x] 1.2 Document and support local mock fallbacks or warning messages in the frontend when `ZHIPU_API_KEY` is not present in the environment.

## 2. Navigation & Layout Integration

- [x] 2.1 Update `app/components/AppHeader.vue` to add the "Assistant IA" link in the header layout when a user is authenticated.

## 3. UI Page Implementation

- [x] 3.1 Create `app/pages/assistant.vue` with the interactive chat container, context-mapping sidebar (linked to store applications), and French copywriting.
- [x] 3.2 Add quick action prompts (lettre de motivation, relance, préparation entretien) that dynamically inject active application details.

## 4. Verification

- [x] 4.1 Verify local builds compile correctly without compilation issues.
