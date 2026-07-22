## Context

The main dashboard (`app/pages/index.vue`) currently displays all applications. Users need to keep this list tidy by hiding resolved applications (`accepted`, `rejected`) while retaining a separate section to view them.

## Goals / Non-Goals

**Goals:**
- Provide a toggle filter on the main dashboard to easily hide/show `accepted` and `rejected` applications.
- Add an "Archives" link with a clean archive icon in `AppSidebar.vue`.
- Create a new `archive.vue` page under `/archive` which automatically filters applications to show only `accepted` and `rejected` ones.
- Synchronize stats cards with active filters on the dashboard.

**Non-Goals:**
- Modifying the Supabase database schema (using existing statuses to determine "archived" state instead).

## Decisions

- **Client-Side Filtering**: Since all user applications are loaded in the Pinia store anyway, filtering by status `accepted`/`rejected` client-side is extremely fast, responsive, and doesn't require backend schema additions.
- **Toggle Storage**: Save the toggle filter preference in local state or reactive `useState` to persist the setting during session navigation.

## Risks / Trade-offs

- **[Risk] Confusion over "Total" Stat Card**: The dashboard total card might mismatch the filtered list count.
  - *Mitigation*: The total card displays the total count of *all* applications, but the table will adjust row visibility according to the active toggle. We will add a clear visual indicator/label showing when some applications are hidden.
