## Why

The JobTracker Chrome Extension is now officially published on the Chrome Web Store. The previous manual "Developer Mode" installation instructions are no longer the primary method for users to install it. Adding a direct link to the Chrome Web Store on the landing/header interface improves the onboarding experience. Additionally, the Chrome extension's popup UI content needs updates to align with this release and improve usability.

## What Changes

- **Add Link to Header:** Link the "Ajouter l'extension" button (or add a dedicated header item/icon) in the Vue app header directly to the official Chrome Web Store listing.
- **Update Extension Instruction Modal:** Simplify or replace the instructions in `ExtensionInstructionModal.vue` to direct users to the Chrome Web Store instead of requiring manual zip downloads, developer mode activation, and folder loading.
- **Update Extension Popup UI:** Refresh the content and design of the extension popup (`popup.html` and `popup.js`) to mention the official store distribution, clean up branding, and improve the status messaging.

## Capabilities

### Modified Capabilities
- `extension-integration`: Update the client-side headers/modals to direct to the Chrome Web Store page and polish the extension's popup content.

## Impact

- `app/components/AppHeader.vue`: The button action or link will point to the Chrome Web Store URL.
- `app/components/ExtensionInstructionModal.vue`: Content will be simplified to a simple link/onboarding pointer to the Chrome Web Store.
- `extension/popup.html`: The HTML layout, branding, and status labels will be updated.
- `extension/popup.js`: If any configuration or URLs need alignment with the public store release.
