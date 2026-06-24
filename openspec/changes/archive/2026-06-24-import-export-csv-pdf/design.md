## Context

JobTracker users currently have no capability to import their existing data or generate exports (CSV or PDF reports). We want to introduce a local client-side import/export module to support these features without adding heavy external dependencies to the Nuxt build.

## Goals / Non-Goals

**Goals:**
- Implement data export to CSV format.
- Implement report printing/saving to PDF format using browser-native print windows.
- Implement CSV data upload, client-side parsing, mapping, and database batch insertion.
- Provide a clean modal interface for these actions.

**Non-Goals:**
- Server-side PDF generation or file hosting.
- Complex CSV mapping UIs (we will support a standard set of headers).

## Decisions

### 1. Zero-Dependency CSV Parser and Generator
To avoid bloating the application, we will write lightweight utility functions in a new file `app/utils/csv.ts`:
- **CSV Generator:** Iterates through application data, wraps text in quotes, escapes double quotes (`""`), and triggers a local file download using `data:text/csv;charset=utf-8`.
- **CSV Parser:** Standard split-line parser supporting quoted strings (handling comma inside quotes) to transform CSV strings into arrays of objects.

### 2. PDF Export via Print Window
Rather than using heavy Canvas/PDF generator libraries (like `jspdf`), we will:
1. Open a new browser window (`window.open`).
2. Generate a clean HTML document styled with print-friendly layout (simple clean borders, no buttons, black and white optimized).
3. Populate it with all application details in a table structure.
4. Automatically trigger `window.print()` when the document completes loading, and close the temporary window.

### 3. File Headers & Mapping
The CSV importer will map standard headers (case-insensitive, supporting both French and English):
- Company: `Entreprise`, `Company`, `company_name`, `company`
- Profile: `Poste`, `Profil`, `Job`, `job_profile`
- Salary: `Salaire`, `proposed_salary`, `salary`
- URL: `Lien`, `url`, `link`
- Status: `Statut`, `status` (mapped to valid ENUM values; defaults to `draft`)
- Date: `Date`, `applied_at`
- Missions: `Missions`, `main_missions`
- Feedback: `Retours`, `Notes`, `company_feedback`

We will batch insert these using a single Supabase query `supabase.from('job_applications').insert(...)`.

## Risks / Trade-offs

- **Risk:** CSV parsing might fail on poorly formatted files.
  - **Mitigation:** Wrap the parser in try/catch blocks, report validation errors to the user in the UI, and provide a template header example in the modal so users know what layout is expected.
