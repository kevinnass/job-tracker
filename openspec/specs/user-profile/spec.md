# User Profile Spec

## Purpose
Specifies requirements for user career profiles, forms, database storage, and integration in headers.

## Requirements

### Requirement: User Profile Page Access
The system SHALL provide a `/profile` route accessible to authenticated users for viewing and editing their career profile.

#### Scenario: Authenticated user navigates to profile
- **WHEN** an authenticated user clicks "Mon Profil" in the header dropdown or navigates to `/profile`
- **THEN** the system SHALL render the profile page with all saved fields pre-filled (or empty placeholders for first-time visitors)

#### Scenario: Unauthenticated access attempt
- **WHEN** an unauthenticated user navigates to `/profile`
- **THEN** the system SHALL redirect the user to `/login`

### Requirement: Profile Form Fields
The profile page SHALL expose form fields for all career-relevant personal data.

#### Scenario: User fills in profile fields
- **WHEN** the user fills in any combination of: full name, job title, professional summary, skills (comma-separated or tags), spoken languages, LinkedIn URL, portfolio URL
- **THEN** the system SHALL display the entered data in the corresponding input fields

#### Scenario: User saves profile
- **WHEN** the user clicks "Enregistrer le profil"
- **THEN** the system SHALL upsert the data to the `user_profiles` table for the authenticated user and display a success confirmation

### Requirement: Experience and Education Sections
The profile SHALL allow users to add structured entries for professional experience and education.

#### Scenario: Adding an experience entry
- **WHEN** the user clicks "Ajouter une expérience" and fills in job title, company, start date, end date, and description
- **THEN** the system SHALL append the entry to the experience list and include it when saving the profile

#### Scenario: Removing an experience entry
- **WHEN** the user clicks the delete icon on an experience card
- **THEN** the system SHALL remove the entry from the list immediately

#### Scenario: Adding an education entry
- **WHEN** the user clicks "Ajouter une formation" and fills in degree, institution, year
- **THEN** the system SHALL append the entry to the education list

### Requirement: Profile Header Dropdown in AppHeader
The AppHeader SHALL replace the standalone logout button with a dropdown menu triggered by clicking the user's name/avatar.

#### Scenario: User opens dropdown
- **WHEN** an authenticated user clicks on their name or avatar in the header
- **THEN** the system SHALL display a dropdown menu with two items: "Mon Profil" (navigates to `/profile`) and "Se déconnecter"

#### Scenario: User closes dropdown
- **WHEN** the user clicks outside the dropdown or presses Escape
- **THEN** the system SHALL hide the dropdown menu

#### Scenario: User clicks "Mon Profil" in dropdown
- **WHEN** the user clicks "Mon Profil" in the dropdown
- **THEN** the system SHALL navigate to `/profile` and close the dropdown

#### Scenario: User clicks "Se déconnecter" in dropdown
- **WHEN** the user clicks "Se déconnecter" in the dropdown
- **THEN** the system SHALL sign out the user and redirect to `/login`

### Requirement: Profile Deletion
The profile page SHALL allow users to delete their entire profile and associated CV.

#### Scenario: Deleting user profile
- **WHEN** the user clicks the "Supprimer le profil" button in the page header and confirms the prompt
- **THEN** the system SHALL delete the CV file from Supabase Storage, delete the row in the `user_profiles` table, clear the local profile form state, and switch to blank edit mode with a success confirmation banner

