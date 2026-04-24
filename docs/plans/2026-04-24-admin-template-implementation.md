# Admin Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the `V3 Lite` single-application admin template in `front/` with login, layout, dynamic menu routing, permission guards, and two demo pages.

**Architecture:** Use a single Vue 3 + Vite application with domain-based module boundaries. Authentication, permission loading, request handling, and route transformation are implemented as separate layers so that `V2` and `V1` can evolve without replacing the foundation.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Pinia, TailwindCSS, Element Plus, Axios, Sass, ESLint, Prettier, Stylelint, Husky, lint-staged, commitlint, Vitest, Vue Test Utils, MSW or vite mock tooling

---

### Task 1: Initialize the Frontend Workspace

**Files:**
- Create: `front/package.json`
- Create: `front/pnpm-workspace.yaml` (only if needed by tooling; otherwise skip)
- Create: `front/index.html`
- Create: `front/vite.config.ts`
- Create: `front/tsconfig.json`
- Create: `front/tsconfig.node.json`
- Create: `front/src/main.ts`
- Create: `front/src/App.vue`
- Create: `front/src/env.d.ts`

**Step 1: Write the failing scaffold check**

Create a minimal check by running:

```bash
pnpm create vite front --template vue-ts
```

Expected: project scaffold completes successfully.

**Step 2: Add the minimal project files**

Initialize the app and keep the structure minimal before adding business modules.

**Step 3: Verify the app boots**

Run:

```bash
cd front && pnpm install && pnpm dev
```

Expected: Vite serves the app locally and the blank starter page loads.

**Step 4: Commit**

```bash
git add front
git commit -m "chore: initialize frontend workspace"
```

### Task 2: Add Base Tooling and Quality Gates

**Files:**
- Create: `front/.editorconfig`
- Create: `front/.gitignore`
- Create: `front/.eslintrc.cjs` or `front/eslint.config.js`
- Create: `front/.prettierrc.cjs`
- Create: `front/.stylelintrc.cjs`
- Create: `front/commitlint.config.cjs`
- Create: `front/.husky/pre-commit`
- Create: `front/.husky/commit-msg`
- Modify: `front/package.json`

**Step 1: Add lint/test scripts**

Add scripts for:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .ts,.vue",
  "format": "prettier --write .",
  "stylelint": "stylelint \"src/**/*.{vue,scss,css}\"",
  "test": "vitest"
}
```

**Step 2: Install and configure linting**

Run:

```bash
cd front && pnpm add -D eslint prettier stylelint husky lint-staged commitlint @commitlint/config-conventional
```

Expected: tooling installs without peer dependency conflicts.

**Step 3: Verify lint commands execute**

Run:

```bash
cd front && pnpm lint
cd front && pnpm stylelint
```

Expected: commands run and either pass or return only expected starter warnings to fix immediately.

**Step 4: Commit**

```bash
git add front
git commit -m "chore: add frontend quality tooling"
```

### Task 3: Add Core UI Dependencies and Style Foundation

**Files:**
- Modify: `front/package.json`
- Create: `front/postcss.config.cjs`
- Create: `front/tailwind.config.ts`
- Create: `front/src/styles/index.scss`
- Create: `front/src/styles/tailwind.css`
- Modify: `front/src/main.ts`

**Step 1: Install UI and style dependencies**

Run:

```bash
cd front && pnpm add vue-router pinia axios element-plus
cd front && pnpm add -D tailwindcss postcss autoprefixer sass unplugin-auto-import unplugin-vue-components vite-plugin-svg-icons
```

Expected: packages install successfully.

**Step 2: Add Tailwind and Sass entrypoints**

Configure Tailwind for utility layout and `scss` for component-scoped styling.

**Step 3: Verify style pipeline**

Run:

```bash
cd front && pnpm build
```

Expected: build completes and style assets are generated without Sass or PostCSS errors.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add ui and style foundation"
```

### Task 4: Set Up App Shell, Router, and Layout Frame

**Files:**
- Create: `front/src/layouts/default/index.vue`
- Create: `front/src/layouts/components/AppHeader.vue`
- Create: `front/src/layouts/components/AppSidebar.vue`
- Create: `front/src/layouts/components/AppBreadcrumb.vue`
- Create: `front/src/router/index.ts`
- Create: `front/src/router/routes/static.ts`
- Create: `front/src/app/router/setup-router.ts`
- Modify: `front/src/App.vue`

**Step 1: Write a route smoke test**

Create:

- `front/src/router/__tests__/router.spec.ts`

Test that the router can render login and dashboard placeholders without crashing.

**Step 2: Build the minimal shell**

Add the default admin layout with header and sidebar placeholders.

**Step 3: Verify routing**

Run:

```bash
cd front && pnpm test -- router
cd front && pnpm dev
```

Expected: test passes and local app navigates between base routes.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add app shell and base router"
```

### Task 5: Implement Authentication and Request Layer

**Files:**
- Create: `front/src/api/auth/index.ts`
- Create: `front/src/modules/auth/service.ts`
- Create: `front/src/stores/user/index.ts`
- Create: `front/src/utils/storage.ts`
- Create: `front/src/utils/request.ts`
- Create: `front/src/types/api.ts`
- Create: `front/src/views/auth/login.vue`

**Step 1: Write failing tests for auth store and request headers**

Create:

- `front/src/stores/user/__tests__/user.spec.ts`
- `front/src/utils/__tests__/request.spec.ts`

Cover:

- token persistence
- login action state updates
- auth header injection

**Step 2: Implement minimal auth flow**

Add request instance, token storage, login API wrapper, and user store.

**Step 3: Verify tests and app flow**

Run:

```bash
cd front && pnpm test -- user
cd front && pnpm test -- request
cd front && pnpm dev
```

Expected: tests pass and login page renders with request layer wired.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add authentication and request layer"
```

### Task 6: Implement Dynamic Menu, Permission Store, and Route Transformation

**Files:**
- Create: `front/src/stores/permission/index.ts`
- Create: `front/src/router/transform/menu-to-routes.ts`
- Create: `front/src/types/permission.ts`
- Create: `front/src/constants/app.ts`
- Modify: `front/src/router/index.ts`
- Modify: `front/src/app/router/setup-router.ts`

**Step 1: Write failing tests for menu transformation**

Create:

- `front/src/router/transform/__tests__/menu-to-routes.spec.ts`

Cover:

- nested menu conversion
- missing component fallback handling
- hidden menu metadata mapping

**Step 2: Implement route transformer and permission store**

Convert backend menu payloads into route records and register them dynamically.

**Step 3: Verify dynamic routes**

Run:

```bash
cd front && pnpm test -- menu-to-routes
cd front && pnpm dev
```

Expected: mock login can load menu data and render the sidebar from dynamic routes.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add dynamic menu routing and permission store"
```

### Task 7: Add Route Guards, Permission Directive, and Access Utilities

**Files:**
- Create: `front/src/app/guard/auth-guard.ts`
- Create: `front/src/app/guard/permission-guard.ts`
- Create: `front/src/directives/permission.ts`
- Create: `front/src/composables/use-permission.ts`
- Modify: `front/src/main.ts`
- Modify: `front/src/app/router/setup-router.ts`

**Step 1: Write failing tests for permission utilities**

Create:

- `front/src/directives/__tests__/permission.spec.ts`
- `front/src/composables/__tests__/use-permission.spec.ts`

Cover:

- element hidden when permission missing
- element visible when permission exists
- composable boolean output

**Step 2: Implement guards and directive**

Ensure:

- unauthenticated users redirect to login
- authenticated users cannot reopen login
- no-access states route to `403`
- button-level permission works consistently

**Step 3: Verify the flow**

Run:

```bash
cd front && pnpm test -- permission
cd front && pnpm dev
```

Expected: tests pass and manual browser checks confirm route protection and button visibility logic.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add route guards and permission utilities"
```

### Task 8: Build V3 Demo Pages and Error Pages

**Files:**
- Create: `front/src/views/dashboard/index.vue`
- Create: `front/src/views/demo/list.vue`
- Create: `front/src/views/error/403.vue`
- Create: `front/src/views/error/404.vue`
- Create: `front/src/components/business/QueryPanel.vue`
- Create: `front/src/components/business/DataTableCard.vue`
- Modify: `front/src/router/routes/static.ts`

**Step 1: Write a render smoke test**

Create:

- `front/src/views/__tests__/pages.spec.ts`

Cover:

- dashboard page renders
- demo list page renders query area and table area
- `403` and `404` pages render key titles

**Step 2: Implement the pages**

Use:

- Tailwind utilities for spacing and layout
- `scoped scss` for page-local polish
- Element Plus for table, form, button, dialog primitives

**Step 3: Verify UI and build**

Run:

```bash
cd front && pnpm test -- pages
cd front && pnpm build
```

Expected: tests pass and production build succeeds.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add v3 demo and error pages"
```

### Task 9: Add Mock Data, Environment Config, and Developer Experience Helpers

**Files:**
- Create: `front/.env.development`
- Create: `front/.env.test`
- Create: `front/.env.production`
- Create: `front/mock/auth.ts`
- Create: `front/mock/menu.ts`
- Create: `front/src/constants/env.ts`
- Create: `front/src/api/demo/index.ts`
- Modify: `front/vite.config.ts`

**Step 1: Write a mock contract test**

Create:

- `front/mock/__tests__/contracts.spec.ts`

Cover:

- login payload shape
- user info payload shape
- menu tree payload shape
- permission code array shape

**Step 2: Implement mock handlers and env toggles**

Support running the full login and permission chain without backend services.

**Step 3: Verify mock development flow**

Run:

```bash
cd front && pnpm test -- contracts
cd front && pnpm dev
```

Expected: local development can complete login and render menus using mock data.

**Step 4: Commit**

```bash
git add front
git commit -m "feat: add mock data and environment config"
```

### Task 10: Document Usage and Delivery Notes

**Files:**
- Create: `front/README.md`
- Modify: `docs/plans/2026-04-24-admin-template-design.md`
- Modify: `docs/plans/2026-04-24-admin-template-implementation.md`

**Step 1: Write usage documentation**

Document:

- install and run commands
- environment variables
- login and permission flow
- how to add a new page
- how backend menu `component` values should map to `src/views`

**Step 2: Run final verification**

Run:

```bash
cd front && pnpm lint
cd front && pnpm stylelint
cd front && pnpm test
cd front && pnpm build
```

Expected: all commands pass cleanly.

**Step 3: Commit**

```bash
git add front docs/plans
git commit -m "docs: add admin template usage and delivery notes"
```

## Notes for Execution

- Default to `V3 Lite` only. Do not start `V2` or `V1` work during this plan.
- Keep all implementation inside `front/` unless documentation changes are required.
- Use mock data to finish the whole route and permission chain before depending on real backend services.
- Prefer small, reviewable commits after each task.
