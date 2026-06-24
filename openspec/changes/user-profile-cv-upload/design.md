## Context

JobTracker currently passes job application data (company name, role, missions, skills) to the AI assistant as context. However, there is no persistent user identity — the AI doesn't know who it's talking to, their experience level, skills, or writing style. This means every generated cover letter starts from zero and can't be personalized without the user pasting in their background each time.

The existing stack: Nuxt 3 frontend, Supabase (Postgres + Auth + Storage + Edge Functions), GLM-4.7-flash via Zhipu AI.

## Goals / Non-Goals

**Goals:**
- Store a structured user profile (personal info, skills, experience, education, languages) in Supabase
- Allow CV/resume upload (PDF or DOCX) that auto-fills profile fields using AI extraction
- Inject user profile into AI assistant system prompts for personalized output
- Add a user dropdown menu in the AppHeader (Profile + Logout) replacing the standalone logout button
- New `/profile` page with form UI + CV upload zone

**Non-Goals:**
- Public profile pages or profile sharing between users
- Multi-CV management or versioning (one active CV at a time)
- Resume builder / PDF generation from profile
- OAuth data sync (LinkedIn import, etc.)

## Decisions

### 1. Profile storage: Single `user_profiles` table (not JSONB columns on auth.users)
Storing profile in a dedicated `user_profiles` table (with `user_id` FK to `auth.users`) keeps the schema explicit and allows RLS policies identical to `job_applications`. Alternative: extending `auth.users.raw_user_meta_data` would avoid a new table but is unstructured and pollutes auth metadata.

### 2. CV parsing: Dedicated `parse-cv` Edge Function calling GLM-4.7-flash
The CV (PDF/DOCX) is uploaded to Supabase Storage, then the Edge Function reads it, sends the text to GLM-4.7-flash with a structured JSON extraction prompt, and returns a profile payload. Alternative: client-side PDF parsing (PDF.js) would avoid Edge Function cost but cannot handle DOCX and yields lower-quality extraction vs. an LLM.

### 3. CV text extraction: Server-side with `pdf-parse` / `mammoth` libraries in the Edge Function
The Edge Function extracts raw text from the uploaded file before sending to GLM. This keeps the LLM call small (text only, not binary). Alternative: send base64 binary to a multimodal model — more expensive and slower.

### 4. Profile injection into AI assistant: System prompt prepend
The `ai-assistant` Edge Function will accept an optional `userProfile` field in its request body. If present, a formatted profile block is prepended to the system prompt. The frontend fetches the user profile before each AI call and passes it along. Alternative: fetch profile server-side in the Edge Function — cleaner but requires an extra Supabase admin call per request.

### 5. Header dropdown: CSS-only with Vue `ref` toggle
A simple `v-show` dropdown anchored to the user name button. No external library needed. Closes on outside click via a `@click.outside` directive or a global click listener.

## Risks / Trade-offs

- **CV parsing quality** → Mitigation: Show extracted data in an editable preview before saving; user can correct anything the AI misread.
- **Large PDF files** → Mitigation: Enforce a 5 MB upload limit client-side and in Supabase Storage bucket policy.
- **Profile data leaking between users** → Mitigation: Row-level security policy `user_id = auth.uid()` on `user_profiles`; storage bucket paths scoped to `{user_id}/cv.*`.
- **Edge Function cold start on parse-cv** → Mitigation: Parse-CV only runs on explicit user action (upload button), not on every chat message — acceptable latency.
- **Profile context in every AI call increases token count** → Trade-off accepted; profile is ~200 tokens max; benefit (personalization) outweighs cost.

## Migration Plan

1. Apply new SQL migration: create `user_profiles` table + RLS + `cv-uploads` storage bucket
2. Deploy `parse-cv` Edge Function
3. Modify `ai-assistant` Edge Function to accept optional `userProfile`
4. Ship frontend changes (AppHeader dropdown, `/profile` page)
5. No data migration needed — existing users simply have no profile row until they visit `/profile`

## Open Questions

- Should the `/profile` page be accessible without being logged in (show a login prompt), or redirect to `/login` via middleware? → Decision: redirect via Nuxt middleware (same pattern as other auth-gated pages).
