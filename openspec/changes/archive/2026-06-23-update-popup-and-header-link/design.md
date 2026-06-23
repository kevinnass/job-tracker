## Context

The JobTracker Chrome Extension is now distributed via the official Chrome Web Store under the ID `knbmpoomilinaimijfjlaocpimmkhpml`.
Currently:
1. The web application's header has a button to install the extension, but it triggers `ExtensionInstructionModal.vue`, which contains a manual, 4-step local development setup instructions (downloading files, enabling developer mode, loading unpacked extension). This is outdated and slow for regular users.
2. The Chrome extension popup (`extension/popup.html` and `extension/popup.js`) has basic UI, and lacks direct integration features like opening the web app dashboard.

This design outlines the simplified installation instructions using the web store link and improvements to the popup UI.

## Goals / Non-Goals

**Goals:**
- Update `AppHeader.vue` and `ExtensionInstructionModal.vue` to prominently display and link to the Chrome Web Store page.
- Update `popup.html` and `popup.js` to clean up typography, style the extension popup with premium aesthetics, add a "Tableau de bord" button in the header, and show a "Voir mon dashboard" button upon successful job saving.
- Align messaging and styling across the extension popup.

**Non-Goals:**
- Rewriting the scraper logic or database connection methods.
- Modifying the AI analysis edge functions.

## Decisions

### 1. Update `ExtensionInstructionModal.vue`
We will simplify the modal to prioritize the Chrome Web Store installation:
* **Primary action:** A large, stylized button "Installer depuis le Chrome Web Store" linking to the extension URL.
* **Secondary instructions:** A brief 2-step overview of how the extension functions (1. Install from store, 2. Scrape with one-click on job boards).
* **Aesthetics:** Retain the glassmorphism backdrop and clean modal structures.

### 2. Update `AppHeader.vue`
* The "Ajouter l'extension" button will still trigger the modal, keeping the onboarding flow consistent while ensuring the modal points to the correct location.

### 3. Update Extension Popup UI (`popup.html` & `popup.js`)
* **Branding Header:** Add a small link/icon to easily open the user's dashboard (`https://job-tracker-opal-ten.vercel.app`) from the extension popup.
* **Success State Action:** Upon successfully saving a job, display a button `Voir sur le dashboard` (linking to the web app) so users can immediately view the parsed details.
* **Styling Polish:** Update fonts to use modern system font stack, adjust border radius to match `--radius` standard, and clean up font sizes.

## Risks / Trade-offs

- **Risk:** Session syncing relies on the user visiting `https://job-tracker-opal-ten.vercel.app` first so the extension can query local storage.
  - **Mitigation:** The extension popup clearly explains this link: "Veuillez vous connecter sur le site JobTracker d'abord." Clicking the login button opens the exact dashboard URL.
