# Archive Applications Section Specification

## Purpose

Provides capabilities to hide closed or inactive applications (accepted/rejected statuses) from the main user dashboard while maintaining their historical record in a dedicated and easily accessible "Masqués" navigation section.

## Requirements

### Requirement: Navigation Link for Archives
The system SHALL display an "Archives" link in the main navigation sidebar.

#### Scenario: Sidebar displays Archive page link
- **WHEN** the authenticated user views the sidebar
- **THEN** the navigation items include "Masqués" with a box/archive icon linking to `/archive`.

### Requirement: Archive View Filter
The system SHALL support filtering out accepted and rejected applications from the main dashboard to keep it focused on active candidatures.

#### Scenario: Toggle visibility of closed applications
- **WHEN** the user checks "Masquer les candidatures refusées" on the main dashboard page
- **THEN** the application table hides rows with status `accepted` and `rejected`.

### Requirement: Dedicated Archives Page
The system SHALL render a dedicated Archives page at `/archive` showcasing only completed or closed applications.

#### Scenario: Display of closed applications in Archives
- **WHEN** the user navigates to `/archive`
- **THEN** the system displays only the applications with status `accepted` and `rejected`, supporting search, view, edit, and deletion actions.
