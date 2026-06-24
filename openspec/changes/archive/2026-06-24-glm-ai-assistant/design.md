## Context

The JobTracker application is a client-side Nuxt SPA that handles candidate applications. We want to add an AI Assistant feature that uses the `glm-4.5-flash` model from Zhipu AI to assist with cover letters, follow-up emails, and interview prep. We currently have a Supabase backend and an Edge Function (`analyze-job`) using Groq.

## Goals / Non-Goals

**Goals:**
- Implement a chat workspace interface in `app/pages/assistant.vue`.
- Allow the user to bind a Pinia application record as context for the session.
- Implement a secure Supabase Edge Function `ai-assistant` to proxy requests to the Zhipu AI endpoint using the `glm-4.5-flash` model.
- Offer single-click task shortcuts to generate customized French follow-up emails, cover letters, and interview questions.

**Non-Goals:**
- Storing chat logs in the database. Conversations will be held in-memory during the active browser session.
- Support for multiple chat rooms/threads in this phase.

## Decisions

### Decision 1: Proxy Zhipu AI Requests via Supabase Edge Function
To prevent exposing the Zhipu AI API key (`ZHIPU_API_KEY`) to the client, we will run queries through a secure Edge Function proxy.
*Alternatives Considered:* Direct client completions (rejected due to security risks regarding API credentials leakage).

### Decision 2: Chat History Session Persistence
Chat history will be stored reactively using a simple Vue `ref` array of messages in `app/pages/assistant.vue`.
*Alternatives Considered:* Supabase database tables for conversations (rejected to keep schema simple and avoid DB load for ephemeral chat logs).

### Decision 3: Standard Fetch inside Deno Edge Function
We will use native Deno `fetch()` to call `https://open.bigmodel.cn/api/paas/v4/chat/completions` directly without installing external SDKs, matching OpenAI payload formats.

## Risks / Trade-offs

- **[Risk] Missing API Key** → If the `ZHIPU_API_KEY` is not set in the Supabase environment, the Edge Function will throw an error.
  - *Mitigation:* The frontend will display a clear, user-friendly alert box telling the user that the assistant is currently offline or key configuration is required.
- **[Risk] High Token Cost on Long Context** → Sending large job descriptions repeatedly increases latency.
  - *Mitigation:* We will truncate description fields (missions/skills) to a maximum of 4000 characters before sending them to the Edge Function.
