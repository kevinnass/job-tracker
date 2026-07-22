## Why

The current application layout relies on a top navigation bar (AppHeader) and full-width container, which limits screen real estate, especially for data-dense pages like the Job Tracker Dashboard and full-height chat interfaces like the AI Assistant. Implementing a modern Dashboard layout with a responsive, collapsible sidebar provides better navigation structure, faster feature access, and an app-like user experience matching modern SaaS tools.

## What Changes

- **New Sidebar Component (`AppSidebar.vue`)**: Dedicated sidebar navigation containing links for Dashboard (Tableau de bord), AI Assistant, User Profile (Mon Profil), Extension modal trigger, theme toggle, and user profile summary / logout. Supports collapsible state on desktop and slide-over menu on mobile.
- **Updated Layout System (`default.vue` & `assistant.vue`)**: Refactor layouts to integrate the sidebar alongside a flexible main content view with topbar status and breadcrumb/header area.
- **Responsive Layout Experience**: Seamless transition between desktop sidebar (collapsible / expanded) and mobile drawer menu.

## Capabilities

### New Capabilities
- `dashboard-sidebar-layout`: Provides a modern sidebar-driven dashboard layout with responsive navigation, collapsible state management, and unified header/sidebar user control.

### Modified Capabilities

## Impact

- **UI Components**: `AppSidebar.vue` (new), `AppHeader.vue` (refactored or replaced by simplified TopHeader), `layouts/default.vue`, `layouts/assistant.vue`.
- **Navigation & Routing**: Responsive layout wrapping for all authenticated routes (`/`, `/assistant`, `/profile`).
- **Dependencies**: No external library required; built using Tailwind CSS and Vue/Nuxt state.
