# Extension Integration Spec

## Purpose
Specifies the integration requirements for the JobTracker Chrome extension and its connection with the main web application and header dashboard interfaces.

## Requirements

### Requirement: Header Web Store Link
The application header SHALL provide a direct link or trigger to install the official JobTracker Chrome extension from the Chrome Web Store.

#### Scenario: Clicking link from header
- **WHEN** the user clicks the "Ajouter l'extension" button or link in the header
- **THEN** the system SHALL display a modal containing a direct download/install action pointing to `https://chromewebstore.google.com/detail/knbmpoomilinaimijfjlaocpimmkhpml?utm_source=item-share-cb`.

### Requirement: Simplified Installation Modal
The extension installation instruction modal SHALL be updated to replace the manual developer mode installation guide with a direct install flow directing users to the Chrome Web Store.

#### Scenario: Opening extension install modal
- **WHEN** the authenticated user clicks the "Ajouter l'extension" button in the header
- **THEN** the system SHALL display the simplified modal containing a prominent link to download the extension from the Chrome Web Store, alongside a brief overview of how to use it.

### Requirement: Updated Extension Popup Content
The Chrome extension's popup UI SHALL be updated to improve messaging, clarify status, and ensure the popup content displays clear status labels and correct instructions.

#### Scenario: Opening extension popup
- **WHEN** the user opens the extension popup in Chrome
- **THEN** the system SHALL display standard branding, clear login status indicator (authenticated email or a button to login), a status selector, and a direct save action.
