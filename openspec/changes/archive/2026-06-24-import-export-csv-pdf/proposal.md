## Why

Currently, JobTracker users cannot back up their job search data, export reports for unemployment agencies (e.g., France Travail/Pôle Emploi, which often require job application proof), or import their existing spreadsheets (Excel/Google Sheets). Adding a CSV import/export system and a print-friendly PDF export system solves these data portability and compliance needs.

## What Changes

- **Export to CSV:** A button to export all user job applications as a clean comma-separated CSV file.
- **Export to PDF:** A button to generate a clean, print-optimized document of job applications, triggering the browser's print/PDF generation dialog.
- **Import from CSV:** An upload modal allowing users to drag and drop or select a CSV file, parse it, map its fields, and batch-upload the applications to Supabase.
- **UI Actions Panel:** Add an "Actions de données" (Data Actions) section in the dashboard to house these import/export controls.

## Capabilities

### New Capabilities
- `data-import-export`: Imports job applications from CSV files, and exports lists to CSV and print-optimized PDF layouts.

## Impact

- `app/components/ImportExportModal.vue`: A new modal component handling CSV upload, file parsing, and CSV/PDF download actions.
- `app/pages/index.vue`: Add a button to trigger the `ImportExportModal`.
- `app/utils/csv.ts`: Add helper functions to parse CSV strings, validate fields, and generate CSV downloads.
- `app/utils/pdf.ts`: Add helper functions to generate a hidden print frame or printable window layout for high-quality PDF exports.
