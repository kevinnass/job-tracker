## 1. Sidebar Link Integration

- [x] 1.1 Add the "Archives" navigation link with a box/archive icon in `app/components/AppSidebar.vue`.
- [x] 1.2 Update `app/components/AppTopbar.vue` to dynamically return "Archives" as the page title when routing to `/archive`.

## 2. Dashboard Filter Toggle

- [x] 2.1 Refactor `app/pages/index.vue` to add a responsive checkbox or pill switcher for "Masquer les candidatures fermées" (accepted, rejected).
- [x] 2.2 Implement the filter logic on `filteredApplications` computed property to hide accepted/rejected status when the filter is active.

## 3. Dedicated Archive Page

- [x] 3.1 Create `app/pages/archive.vue` leveraging the same table format and search capability, pre-filtered to display only accepted and rejected applications.

## 4. Verification

- [x] 4.1 Verify toggling, page rendering, and search capability on `/archive`.
- [x] 4.2 Verify project builds successfully (`npm run build`).
