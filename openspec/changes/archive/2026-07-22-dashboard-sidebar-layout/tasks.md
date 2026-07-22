## 1. Sidebar Component Creation

- [x] 1.1 Create `app/components/AppSidebar.vue` with brand header, primary navigation links (Tableau de bord, Assistant IA), user action triggers (Extension modal, ThemeToggle), and user profile dropdown/logout.
- [x] 1.2 Implement sidebar state (collapse/expand toggle on desktop, responsive drawer toggle on mobile).

## 2. Layouts Refactoring

- [x] 2.1 Refactor `app/layouts/default.vue` to incorporate `AppSidebar` and flexible main content area with topbar.
- [x] 2.2 Refactor `app/layouts/assistant.vue` to integrate `AppSidebar` while preserving full-height chat screen container without unwanted page scrollbars.

## 3. Verification & Polish

- [x] 3.1 Verify navigation between pages (`/`, `/assistant`, `/profile`) works smoothly on both desktop and mobile viewports.
- [x] 3.2 Verify build (`npm run build`) completes cleanly with zero errors.
