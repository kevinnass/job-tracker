## Why

Users currently only see raw numbers of job applications (e.g. Total, Applied, Interview, Accepted, Rejected) via simple cards on the main dashboard. To gain deeper insights into their job hunting performance, they need advanced graphical visualizations representing metrics like status distribution, response rates, and application trends over time.

## What Changes

- **Sidebar Integration**: Add an "Analyses" link in `AppSidebar.vue` using a `bar-chart` / activity icon.
- **Analytics Dashboard Page (`app/pages/analytics.vue`)**: Create a new page displaying structured stats, charts, and metrics:
  - **Status distribution** (visual representation like a pie/donut chart, styled using custom responsive Tailwind layout or SVG charts).
  - **Success & Response rates** (percentage of applications leading to interviews).
  - **Monthly progression chart** (number of applications submitted per month).
  - **Application sources / platforms** (if parsed or derived, e.g. LinkedIn, Indeed, etc.).
- **Topbar Synchronization**: Add the "Analyses" title to `AppTopbar.vue` breadcrumbs when on the page.

## Capabilities

### New Capabilities
- `analytics-dashboard-page`: Renders visual charts, progression metrics, and response rates representing job hunting analytics.

### Modified Capabilities

## Impact

- **Pages**: `app/pages/analytics.vue` (new).
- **Components**: `app/components/AppSidebar.vue` (modified), `app/components/AppTopbar.vue` (modified).
- **Routes**: `/analytics`.
