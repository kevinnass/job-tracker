# Data Export Spec

## Purpose
Specifies the requirements for exporting candidate job application data into CSV and PDF formats for offline tracking and reporting.

## Requirements

### Requirement: Export to CSV
The system SHALL allow authenticated users to export all of their job applications into a single CSV file.

#### Scenario: Successful CSV Export
- **WHEN** the user triggers the "Exporter au format CSV" action
- **THEN** the system SHALL compile all applications from the store, format them into a valid CSV string, and trigger a download of a file named `jobtracker-export.csv`.

### Requirement: Export to PDF (Print Layout)
The system SHALL provide a print-friendly layout of the user's job applications suitable for printing or saving directly as a PDF through the browser's print options.

#### Scenario: Triggers Browser Print Dialog
- **WHEN** the user triggers the "Exporter au format PDF / Imprimer" action
- **THEN** the system SHALL open a new print window containing a clean, readable layout of all job applications and immediately invoke the browser's native print interface.
