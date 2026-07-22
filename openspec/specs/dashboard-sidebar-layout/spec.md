# Dashboard Sidebar Layout Specification

## Purpose

This capability replaces the top header navigation system with a modern dashboard-style collapsible sidebar. It optimizes viewport space utilization on larger screens while maintaining a clean, accessible layout for both desktop and mobile users.

## Requirements

### Requirement: Responsive Sidebar Navigation
The system SHALL display a responsive navigation sidebar for authenticated users across all main application layouts.

#### Scenario: Desktop view displaying expanded sidebar
- **WHEN** an authenticated user opens the application on a desktop viewport
- **THEN** the application renders a vertical sidebar containing links to Tableau de Bord, Assistant IA, Mon Profil, Extension modal, Theme Toggle, and User Account details.

#### Scenario: Mobile view slide-over menu
- **WHEN** an authenticated user opens the application on a mobile viewport
- **THEN** the sidebar is collapsed into a top app bar with a toggle button that slides out the mobile drawer navigation upon click.

### Requirement: Layout Adaptation and Real Estate Optimization
The layout system SHALL wrap page content with an adaptable sidebar layout that adjusts padding and overflow behavior per page requirements.

#### Scenario: Full-height page layout for AI Assistant
- **WHEN** the user navigates to `/assistant`
- **THEN** the content container expands to full available height without page-level scrollbars, providing maximum space for the AI chat panel.

#### Scenario: Scrollable content layout for Dashboard and Profile
- **WHEN** the user navigates to `/` or `/profile`
- **THEN** the content container provides a clean scrollable canvas with uniform padding next to the sidebar.
