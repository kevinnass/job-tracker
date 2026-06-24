## ADDED Requirements

### Requirement: CV File Upload
The profile page SHALL allow users to upload a CV/resume file (PDF or DOCX, max 5 MB) to a private Supabase Storage bucket.

#### Scenario: User uploads a valid CV
- **WHEN** the user selects or drops a PDF or DOCX file (≤ 5 MB) onto the upload zone and clicks "Analyser le CV"
- **THEN** the system SHALL upload the file to the `cv-uploads` bucket under `{user_id}/cv.{ext}`, call the `parse-cv` Edge Function, and display a loading state

#### Scenario: User uploads an invalid file type
- **WHEN** the user attempts to upload a file that is not PDF or DOCX
- **THEN** the system SHALL display an error message "Seuls les fichiers PDF et DOCX sont acceptés" and NOT upload the file

#### Scenario: User uploads a file exceeding the size limit
- **WHEN** the user attempts to upload a file larger than 5 MB
- **THEN** the system SHALL display an error message "Le fichier ne doit pas dépasser 5 Mo" and NOT upload the file

### Requirement: CV Parsing and Profile Pre-fill
After a successful upload, the system SHALL extract structured career data from the CV using the `parse-cv` Edge Function and pre-fill the profile form fields.

#### Scenario: Successful CV parse
- **WHEN** the `parse-cv` Edge Function returns a structured profile payload
- **THEN** the system SHALL pre-fill all matching profile form fields (name, title, summary, skills, experience, education, languages) with the extracted data, keeping any fields not present in the CV at their current values

#### Scenario: Partial CV data extraction
- **WHEN** the CV parse returns only some fields (e.g., experience but no education)
- **THEN** the system SHALL fill only the returned fields and leave other fields unchanged

#### Scenario: CV parse failure
- **WHEN** the `parse-cv` Edge Function returns an error or times out
- **THEN** the system SHALL display an error message "L'analyse du CV a échoué. Veuillez remplir le profil manuellement." and leave all form fields unchanged

### Requirement: CV Parse Edge Function
The `parse-cv` Supabase Edge Function SHALL accept a file path in Supabase Storage, extract text from the file, call GLM-4.7-flash with a structured extraction prompt, and return a JSON profile payload.

#### Scenario: PDF text extraction
- **WHEN** the function receives a path to a PDF file in storage
- **THEN** the function SHALL read the file bytes, extract plain text, and pass it to GLM-4.7-flash

#### Scenario: DOCX text extraction
- **WHEN** the function receives a path to a DOCX file in storage
- **THEN** the function SHALL read the file bytes, extract plain text using a DOCX parser, and pass it to GLM-4.7-flash

#### Scenario: Structured profile extraction
- **WHEN** GLM-4.7-flash processes the CV text
- **THEN** the function SHALL return a JSON object with fields: `full_name`, `job_title`, `professional_summary`, `skills` (array), `languages` (array), `experience` (array of {title, company, start, end, description}), `education` (array of {degree, institution, year})
