## 1. Database & Storage Setup

- [x] 1.1 Write SQL migration to create `user_profiles` table (user_id, full_name, job_title, professional_summary, skills TEXT[], languages TEXT[], experience_json JSONB, education_json JSONB, linkedin_url, portfolio_url, created_at, updated_at)
- [x] 1.2 Add RLS policies on `user_profiles`: authenticated users can SELECT, INSERT, UPDATE their own row (`user_id = auth.uid()`)
- [x] 1.3 Create `cv-uploads` Supabase Storage bucket (private, 5 MB max file size)
- [x] 1.4 Add Storage RLS policies: users can upload/read/delete only within their own `{user_id}/` folder
- [ ] 1.5 Apply migration to Supabase project and verify table and bucket exist

## 2. CV Parse Edge Function

- [x] 2.1 Scaffold new Supabase Edge Function `parse-cv` at `supabase/functions/parse-cv/index.ts`
- [x] 2.2 Implement PDF text extraction using a Deno-compatible PDF parser (e.g., `pdf-parse` via npm shim or `pdfjs-dist`)
- [x] 2.3 Implement DOCX text extraction using `mammoth` or equivalent Deno-compatible library
- [x] 2.4 Build GLM-4.7-flash prompt that requests a structured JSON response (full_name, job_title, professional_summary, skills, languages, experience[], education[])
- [x] 2.5 Call Zhipu AI API with extracted text and return parsed JSON profile to caller
- [x] 2.6 Add error handling: malformed file, API failure, empty extraction — return descriptive error messages
- [ ] 2.7 Deploy `parse-cv` Edge Function to Supabase and smoke test with a sample CV

## 3. AI Assistant Edge Function Update

- [x] 3.1 Update `supabase/functions/ai-assistant/index.ts` to accept optional `userProfile` in the request body
- [x] 3.2 If `userProfile` is present, prepend a formatted French profile block to the system prompt (e.g., "Voici le profil du candidat : Nom: ..., Titre: ..., Compétences: ..., Expérience: ...")
- [ ] 3.3 Deploy updated `ai-assistant` Edge Function

## 4. AppHeader Dropdown Menu

- [x] 4.1 Add a `showUserMenu` ref and click toggle in `app/components/AppHeader.vue`
- [x] 4.2 Replace the standalone "Déconnexion" text button with a dropdown trigger (user name + chevron icon)
- [x] 4.3 Implement dropdown panel with "Mon Profil" (→ `/profile`) and "Se déconnecter" items
- [x] 4.4 Add outside-click handler to close the dropdown when clicking elsewhere on the page
- [x] 4.5 Add Escape key handler to close the dropdown
- [x] 4.6 Style the dropdown with a premium card look (shadow, border, rounded-xl) consistent with the app's design system

## 5. Profile Page — Core Form

- [x] 5.1 Create `app/pages/profile.vue` with `definePageMeta({ middleware: 'auth' })` (or equivalent auth guard)
- [x] 5.2 Fetch existing profile on mount from `user_profiles` and pre-fill all form fields
- [x] 5.3 Implement text fields: full name, job title, professional summary (textarea), skills (tag input or comma-separated text), languages (tag input), LinkedIn URL, portfolio URL
- [x] 5.4 Implement dynamic experience section: add/remove entries, each with: job title, company, start date, end date, description textarea
- [x] 5.5 Implement dynamic education section: add/remove entries, each with: degree, institution, graduation year
- [x] 5.6 Implement "Enregistrer le profil" button that upserts the form data to `user_profiles`
- [x] 5.7 Show success toast/banner after successful save and error message on failure
- [x] 5.8 Apply the app's premium design system: gradient header, card sections, indigo accent colors

## 6. Profile Page — CV Upload

- [x] 6.1 Add a CV upload drop-zone section to the profile page (drag-and-drop + click to browse)
- [x] 6.2 Validate file type (PDF/DOCX) and size (≤ 5 MB) client-side before upload, showing inline error messages
- [x] 6.3 On valid file selection: upload to `cv-uploads/{user_id}/cv.{ext}` via Supabase Storage client
- [x] 6.4 After upload: call `parse-cv` Edge Function with the storage path and display a loading state
- [x] 6.5 On successful parse: pre-fill all matching form fields with the extracted data and show a "CV analysé avec succès" confirmation
- [x] 6.6 On parse error: display "L'analyse du CV a échoué. Veuillez remplir le profil manuellement." and leave form fields unchanged
- [x] 6.7 Show a "CV actuellement chargé" indicator if a CV already exists in storage for the user

## 7. AI Assistant Frontend Integration

- [x] 7.1 In `app/pages/assistant.vue`, fetch the current user's profile on mount (from `user_profiles` table)
- [x] 7.2 Pass the fetched `userProfile` object in the request body to the `ai-assistant` Edge Function alongside messages and application context
- [x] 7.3 If no profile exists, pass `userProfile: null` (Edge Function handles gracefully)

## 8. Verification

- [ ] 8.1 Test: new user visits `/profile`, saves a profile, verifies data persists after page reload
- [ ] 8.2 Test: upload a PDF CV, verify form fields are pre-filled with extracted data
- [ ] 8.3 Test: upload a DOCX CV, verify extraction works
- [ ] 8.4 Test: upload invalid file type — verify error message shown
- [ ] 8.5 Test: generate a cover letter in the assistant with profile saved — verify the output references the user's actual name, skills, and experience
- [ ] 8.6 Test: AppHeader dropdown opens/closes correctly, "Mon Profil" navigates, "Se déconnecter" logs out
- [ ] 8.7 Test: unauthenticated user navigating to `/profile` is redirected to `/login`
