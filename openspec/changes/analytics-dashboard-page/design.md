## Context

Users need visual indicators to track their job application progress. Creating a dedicated Analytics page `/analytics` filled with custom SVG charts provides a premium, responsive dashboard without bloat.

## Goals / Non-Goals

**Goals:**
- Design clean visual charts (donut/pie for status, bar chart for monthly progress, progress indicators for conversion rates).
- Add the "Analyses" link in `AppSidebar.vue` using a bar-chart SVG icon.
- Calculate and aggregate store data:
  - Conversion rates: Total -> Applied -> Interview -> Offer (Accepted).
  - Platform/Source distribution parsed from job application URLs (e.g. LinkedIn, Welcome to the Jungle, Indeed).
  - Chronological trend (applications per month).

**Non-Goals:**
- Using heavy third-party canvas or charting libraries. We will build custom, responsive, lightweight SVG/CSS charts for ultimate design control and fast loading.

## Decisions

- **Interactive SVGs**: Use SVG `<circle>` and `<rect>` elements styled with Tailwind to build the donut and bar charts. This ensures perfect dark-mode support and seamless animations.
- **Conversion funnel**: Create a linear funnel visualization representing recruitment pipeline efficiency.

## Risks / Trade-offs

- **[Risk] Insufficient application data for charts**: If the user has few or zero applications, the charts might look empty or break.
  - *Mitigation*: Render an elegant fallback or "empty state" explaining that more data is needed to populate analytics.
