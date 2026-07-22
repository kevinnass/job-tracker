## Context

Currently, the web application relies on `AppHeader.vue` rendered at the top of `layouts/default.vue` and `layouts/assistant.vue`. As the application features grow (Dashboard, AI Assistant, User Profile, Extension Integration), a top navigation header reduces available vertical space and does not scale well for desktop dashboard productivity.

Transitioning to a dedicated dashboard layout with a collapsible sidebar (`AppSidebar.vue`) provides an optimized layout structure with better screen utilization.

## Goals / Non-Goals

**Goals:**
- Create `AppSidebar.vue` to centralize main navigation links (Tableau de bord, Assistant IA, Mon Profil), actions (Extension modal, Theme toggle), and user profile controls.
- Maintain responsive drawer menu on mobile devices while using a sleek vertical sidebar on desktop.
- Adapt `layouts/default.vue` and `layouts/assistant.vue` to share a unified layout shell.
- Preserve existing routing, state, and authentication flows without breaking any features.

**Non-Goals:**
- Modifying backend APIs or database schemas.
- Changing individual page feature logic outside of layout structure.

## Decisions

- **Sidebar Component Architecture**: Build `AppSidebar.vue` as a standalone component using Vue 3 Composition API & Tailwind CSS, supporting collapsed icon-only mode and expanded mode.
- **Top Header Simplified**: Maintain a compact topbar (`AppTopbar.vue` or refactored header) for mobile menu triggers and page context title/breadcrumbs.
- **Layout Integration**: Update `layouts/default.vue` for scrollable content and `layouts/assistant.vue` for full-height fixed viewport content.

## Risks / Trade-offs

- **[Risk] Mobile Drawer Accessibility**: Mobile screen widths require auto-closing drawer on route changes.
  - *Mitigation*: Watch `useRoute()` to close mobile menu drawer upon navigation.
- **[Risk] Assistant Page Height**: `/assistant` requires flex-1 overflow hidden layout to prevent double scrollbars.
  - *Mitigation*: Pass layout height constraints via layout slots/props or dedicated `assistant` layout structure.
