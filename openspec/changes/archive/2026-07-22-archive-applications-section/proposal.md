## Why

As users add more job applications, the main dashboard can become cluttered with inactive, completed, or rejected applications. To maintain a clean and productive workspace, users need a way to filter/hide these completed (accepted) and inactive (rejected) applications from the main view, while keeping a dedicated "Archives" section accessible to review their history.

## What Changes

- **Sidebar Integration**: Add an "Archives" link to [`AppSidebar.vue`](file:///Users/kevin/Documents/GitHub/job-application/app/components/AppSidebar.vue) with an archive icon.
- **Dedicated Archives Page (`app/pages/archive.vue`)**: A new page rendering only the archived applications (statuses: `accepted`, `rejected`), with the search bar and action buttons.
- **Dashboard Filter Toggle (`app/pages/index.vue`)**: Add a toggle on the main dashboard to "Hide closed/archived applications" (candidatures acceptées et refusées) so the dashboard only shows active/in-progress applications (`draft`, `applied`, `interview`).
- **Store / Stats Alignment**: Keep the dashboard stats cards clickable to toggle filters normally, but ensure active/inactive filtering behaves intuitively.

## Capabilities

### New Capabilities
- `archive-applications-section`: Introduce a dedicated archive section and filter toggle to manage closed (accepted/rejected) applications.

### Modified Capabilities

## Impact

- **Pages**: `app/pages/archive.vue` (new), `app/pages/index.vue` (modified).
- **Components**: `app/components/AppSidebar.vue` (modified), `app/components/AppTopbar.vue` (modified).
- **Navigation**: Dedicated `/archive` route.
