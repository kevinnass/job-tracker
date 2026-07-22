## ADDED Requirements

### Requirement: Navigation link for Analytics
The system SHALL display an "Analyses" link in the main navigation sidebar.

#### Scenario: Sidebar displays Analytics link
- **WHEN** the authenticated user views the sidebar
- **THEN** the navigation items include "Analyses" with a bar-chart/trending icon linking to `/analytics`.

### Requirement: Analytics Visualizations
The system SHALL calculate and display visualizations representing the user's job application performance metrics.

#### Scenario: Display of key metrics
- **WHEN** the user navigates to `/analytics`
- **THEN** the system shows:
  1. Response Rate (percentage of applications resulting in an interview).
  2. Status Distribution (pie or donut representation of applications).
  3. Progression Rate (applications submitted per month or weekly chart).
  4. Platform Distribution (LinkedIn, Indeed, others parsed from URLs).
