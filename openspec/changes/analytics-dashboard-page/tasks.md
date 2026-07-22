## 1. Sidebar Link Integration

- [x] 1.1 Add the "Analyses" navigation link with a bar-chart/trending SVG icon in `app/components/AppSidebar.vue`.
- [x] 1.2 Update `app/components/AppTopbar.vue` to dynamically return "Analyses" as the page title when routing to `/analytics`.

## 2. Analytics Calculations

- [x] 2.1 Implement computed helpers to group applications by month, status, and job platform (parsed from URL hostnames: e.g. `linkedin.com`, `indeed.com`, `welcome to the jungle`).
- [x] 2.2 Calculate recruitment pipeline metrics (Total -> Interview conversion rate, Interview -> Offer conversion rate).

## 3. Dedicated Analytics Page

- [x] 3.1 Create `app/pages/analytics.vue` incorporating responsive grid layouts, key stats panels, custom SVG donut charts (status distribution), and vertical SVG bar charts (monthly application progression).
- [x] 3.2 Add empty/fallback state handling for users with zero applications.

## 4. Verification

- [x] 4.1 Verify layout integration and data reactivity on `/analytics`.
- [x] 4.2 Verify project builds successfully (`npm run build`).
