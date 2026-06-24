## Why

The AI assistant currently has no knowledge of the user — their skills, experience, or career preferences. This means generated cover letters and follow-up emails are generic. Adding a user profile with CV upload gives the AI rich personal context so it can produce highly personalized, job-ready content without the user repeating themselves every session.

## What Changes

- New `/profile` page allowing users to fill in personal career information (name, title, summary, skills, experience, languages, etc.)
- CV/resume upload (PDF or DOCX) that auto-extracts and pre-populates profile fields using AI parsing
- Dropdown user menu in the AppHeader replacing the standalone logout button (clicking the user's name reveals "Mon Profil" and "Se Déconnecter")
- User profile data stored in a new `user_profiles` Supabase table (one row per user)
- The AI assistant Edge Function reads the user's profile and injects it into system prompts alongside job application context
- A new `user_profiles` Supabase storage bucket for CV file uploads

## Capabilities

### New Capabilities
- `user-profile`: Profile page where users enter and save personal career data; profile is used by the AI as persistent context across all sessions
- `cv-upload`: CV/resume file upload on the profile page; AI parses the document and pre-fills profile fields automatically

### Modified Capabilities
- `ai-assistant`: System prompt enriched with the user's profile data (skills, experience, title, summary) so generated letters and emails are personalized

## Impact

- **New DB table**: `user_profiles` (user_id, full_name, job_title, professional_summary, skills, languages, experience_json, education_json, linkedin_url, portfolio_url, created_at, updated_at)
- **New Supabase Storage bucket**: `cv-uploads` (private, per-user)
- **New Edge Function** (or extend existing): `parse-cv` — receives uploaded CV file, calls GLM-4.7-flash to extract structured profile data, returns JSON
- **Modified**: `ai-assistant` Edge Function to accept and inject `userProfile` in system prompt
- **Modified**: `AppHeader.vue` — replace standalone logout button with dropdown (profile + logout)
- **New pages**: `app/pages/profile.vue`
- **New RLS policies**: user can only read/write their own profile row
