# Admin Template Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the `V3 Lite` single-application admin template in `front/V3Lite/` with login, layout, dynamic menu routing, permission guards, mock data, and demo pages.

**Architecture:** Use a single Vue 3 + Vite application with domain-based module boundaries. Authentication, permission loading, request handling, and route transformation are implemented as separate layers so that `V2` and `V1` can evolve without replacing the foundation.

**Tech Stack:** Vue 3, TypeScript, Vite, Vue Router, Pinia, TailwindCSS, Element Plus, Axios, Sass, ESLint, Prettier, Stylelint, Husky, lint-staged, commitlint, Vitest, Vue Test Utils

**Directory Sync Note:** The current repository implementation lives in `front/V3Lite/`. All file paths, commands, and documentation references below have been aligned to that actual directory.

---

### Task 1: Initialize the Frontend Workspace

**Files:**
- Create: `front/V3Lite/package.json`
- Create: `front/V3Lite/index.html`
- Create: `front/V3Lite/vite.config.ts`
- Create: `front/V3Lite/tsconfig.json`
- Create: `front/V3Lite/tsconfig.app.json`
- Create: `front/V3Lite/tsconfig.node.json`
- Create: `front/V3Lite/src/main.ts`
- Create: `front/V3Lite/src/App.vue`
- Create: `front/V3Lite/src/env.d.ts`

**Step 1: Write the failing scaffold check**

Create a minimal check by running:

```bash
pnpm create vite front/V3Lite --template vue-ts
```

Expected: project scaffold completes successfully.

**Step 2: Add the minimal project files**

Initialize the app and keep the structure minimal before adding business modules.

**Step 3: Verify the app boots**

Run:

```bash
cd front/V3Lite && pnpm install && pnpm dev
```

Expected: Vite serves the app locally and the starter page loads.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "chore: initialize frontend workspace"
```

### Task 2: Add Base Tooling and Quality Gates

**Files:**
- Create: `front/V3Lite/.editorconfig`
- Create: `front/V3Lite/.gitignore`
- Create: `front/V3Lite/eslint.config.js`
- Create: `front/V3Lite/.prettierrc.cjs`
- Create: `front/V3Lite/.stylelintrc.cjs`
- Create: `front/V3Lite/commitlint.config.cjs`
- Create: `front/V3Lite/.husky/pre-commit`
- Create: `front/V3Lite/.husky/commit-msg`
- Modify: `front/V3Lite/package.json`

**Step 1: Add lint/test scripts**

Add scripts for:

```json
{
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "format": "prettier --write .",
  "stylelint": "stylelint \"src/**/*.{vue,scss,css}\"",
  "test": "vitest run"
}
```

**Step 2: Install and configure linting**

Run:

```bash
cd front/V3Lite && pnpm add -D eslint prettier stylelint husky lint-staged commitlint @commitlint/config-conventional
```

Expected: tooling installs without peer dependency conflicts.

**Step 3: Verify lint commands execute**

Run:

```bash
cd front/V3Lite && pnpm lint
cd front/V3Lite && pnpm stylelint
```

Expected: commands run and either pass or return only expected starter warnings to fix immediately.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "chore: add frontend quality tooling"
```

### Task 3: Add Core UI Dependencies and Style Foundation

**Files:**
- Modify: `front/V3Lite/package.json`
- Create: `front/V3Lite/postcss.config.cjs`
- Create: `front/V3Lite/tailwind.config.ts`
- Create: `front/V3Lite/src/styles/index.scss`
- Create: `front/V3Lite/src/styles/tailwind.css`
- Modify: `front/V3Lite/src/main.ts`

**Step 1: Install UI and style dependencies**

Run:

```bash
cd front/V3Lite && pnpm add vue-router pinia axios element-plus
cd front/V3Lite && pnpm add -D tailwindcss postcss autoprefixer sass unplugin-auto-import unplugin-vue-components vite-plugin-svg-icons
```

Expected: packages install successfully.

**Step 2: Add Tailwind and Sass entrypoints**

Configure Tailwind for utility layout and `scss` for component-scoped styling.

**Step 3: Verify style pipeline**

Run:

```bash
cd front/V3Lite && pnpm build
```

Expected: build completes and style assets are generated without Sass or PostCSS errors.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add ui and style foundation"
```

### Task 4: Set Up App Shell, Router, and Layout Frame

**Files:**
- Create: `front/V3Lite/src/layouts/default/index.vue`
- Create: `front/V3Lite/src/layouts/components/AppHeader.vue`
- Create: `front/V3Lite/src/layouts/components/AppSidebar.vue`
- Create: `front/V3Lite/src/layouts/components/AppBreadcrumb.vue`
- Create: `front/V3Lite/src/router/index.ts`
- Create: `front/V3Lite/src/router/routes/static.ts`
- Create: `front/V3Lite/src/app/router/setup-router.ts`
- Modify: `front/V3Lite/src/App.vue`

**Step 1: Write a route smoke test**

Create:

- `front/V3Lite/src/router/__tests__/router.spec.ts`

Test that the router can render login and root routes without crashing.

**Step 2: Build the minimal shell**

Add the default admin layout with header, sidebar, and route outlet placeholders.

**Step 3: Verify routing**

Run:

```bash
cd front/V3Lite && pnpm test -- router
cd front/V3Lite && pnpm dev
```

Expected: test passes and local app navigates between base routes.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add app shell and base router"
```

### Task 5: Implement Authentication and Request Layer

**Files:**
- Create: `front/V3Lite/src/api/auth/index.ts`
- Create: `front/V3Lite/src/modules/auth/service.ts`
- Create: `front/V3Lite/src/stores/user/index.ts`
- Create: `front/V3Lite/src/utils/storage.ts`
- Create: `front/V3Lite/src/utils/request.ts`
- Create: `front/V3Lite/src/types/api.ts`
- Create: `front/V3Lite/src/views/auth/login.vue`

**Step 1: Write failing tests for auth store and request headers**

Create:

- `front/V3Lite/src/stores/user/__tests__/user.spec.ts`
- `front/V3Lite/src/utils/__tests__/request.spec.ts`

Cover:

- token persistence
- login action state updates
- auth header injection

**Step 2: Implement minimal auth flow**

Add request instance, token storage, login API wrapper, and user store.

**Step 3: Verify tests and app flow**

Run:

```bash
cd front/V3Lite && pnpm test -- user
cd front/V3Lite && pnpm test -- request
cd front/V3Lite && pnpm dev
```

Expected: tests pass and login page renders with request layer wired.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add authentication and request layer"
```

### Task 6: Implement Dynamic Menu, Permission Store, and Route Transformation

**Files:**
- Create: `front/V3Lite/src/stores/permission/index.ts`
- Create: `front/V3Lite/src/router/transform/menu-to-routes.ts`
- Create: `front/V3Lite/src/types/permission.ts`
- Create: `front/V3Lite/src/constants/app.ts`
- Modify: `front/V3Lite/src/router/index.ts`
- Modify: `front/V3Lite/src/app/router/setup-router.ts`

**Step 1: Write failing tests for menu transformation**

Create:

- `front/V3Lite/src/router/transform/__tests__/menu-to-routes.spec.ts`

Cover:

- nested menu conversion
- missing component fallback handling
- hidden menu metadata mapping

**Step 2: Implement route transformer and permission store**

Convert backend menu payloads into route records and register them dynamically.

**Step 3: Verify dynamic routes**

Run:

```bash
cd front/V3Lite && pnpm test -- menu-to-routes
cd front/V3Lite && pnpm dev
```

Expected: mock login can load menu data and render the sidebar from dynamic routes.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add dynamic menu routing and permission store"
```

### Task 7: Add Route Guards, Permission Directive, and Access Utilities

**Files:**
- Create: `front/V3Lite/src/directives/permission.ts`
- Create: `front/V3Lite/src/composables/use-permission.ts`
- Create: `front/V3Lite/src/app/router/__tests__/guard.spec.ts`
- Modify: `front/V3Lite/src/main.ts`
- Modify: `front/V3Lite/src/app/router/setup-router.ts`

**Implementation Note:** The current codebase keeps auth and permission guards co-located in `src/app/router/setup-router.ts` instead of splitting them into separate `auth-guard.ts` and `permission-guard.ts` files.

**Step 1: Write failing tests for permission utilities**

Create:

- `front/V3Lite/src/directives/__tests__/permission.spec.ts`
- `front/V3Lite/src/composables/__tests__/use-permission.spec.ts`
- `front/V3Lite/src/app/router/__tests__/guard.spec.ts`

Cover:

- element hidden when permission missing
- element visible when permission exists
- composable boolean output
- unauthenticated redirects and no-access routing

**Step 2: Implement guards and directive**

Ensure:

- unauthenticated users redirect to login
- authenticated users cannot reopen login
- no-access states route to `403`
- button-level permission works consistently

**Step 3: Verify the flow**

Run:

```bash
cd front/V3Lite && pnpm test -- permission
cd front/V3Lite && pnpm test -- guard
cd front/V3Lite && pnpm dev
```

Expected: tests pass and manual browser checks confirm route protection and button visibility logic.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add route guards and permission utilities"
```

### Task 8: Build V3 Demo Pages and Error Pages

**Files:**
- Create: `front/V3Lite/src/views/dashboard/index.vue`
- Create: `front/V3Lite/src/views/demo/list.vue`
- Create: `front/V3Lite/src/views/demo/menu.vue`
- Create: `front/V3Lite/src/views/workspace/index.vue`
- Create: `front/V3Lite/src/views/error/403.vue`
- Create: `front/V3Lite/src/views/error/404.vue`
- Create: `front/V3Lite/src/views/error/route-missing.vue`
- Modify: `front/V3Lite/src/router/routes/static.ts`
- Modify: `front/V3Lite/src/layouts/components/AppHeader.vue`
- Modify: `front/V3Lite/src/layouts/components/AppSidebar.vue`
- Modify: `front/V3Lite/src/stores/tabs/index.ts`

**Step 1: Write render and interaction smoke tests**

Create:

- `front/V3Lite/src/views/demo/__tests__/list.spec.ts`
- `front/V3Lite/src/layouts/components/__tests__/AppHeader.spec.ts`
- `front/V3Lite/src/layouts/components/__tests__/AppSidebar.spec.ts`
- `front/V3Lite/src/stores/tabs/__tests__/tabs.spec.ts`

Cover:

- dashboard and demo list entry behavior
- query area, table area, and pagination rendering
- header tabs and sidebar navigation behavior
- `403`, `404`, and missing-route fallback behavior

**Step 2: Implement the pages**

Use:

- Tailwind utilities for spacing and layout
- `scoped scss` for page-local polish
- Element Plus for table, form, button, dialog, loading, and layout primitives

**Step 3: Verify UI and build**

Run:

```bash
cd front/V3Lite && pnpm test -- list
cd front/V3Lite && pnpm test -- tabs
cd front/V3Lite && pnpm build
```

Expected: tests pass and production build succeeds.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add v3 demo and error pages"
```

### Task 9: Add Mock Data, Environment Config, and Developer Experience Helpers

**Files:**
- Create: `front/V3Lite/.env.development`
- Create: `front/V3Lite/.env.test`
- Create: `front/V3Lite/.env.production`
- Create: `front/V3Lite/mock/auth.ts`
- Create: `front/V3Lite/mock/menu.ts`
- Create: `front/V3Lite/mock/demo.ts`
- Create: `front/V3Lite/src/constants/env.ts`
- Create: `front/V3Lite/src/api/demo/index.ts`
- Modify: `front/V3Lite/vite.config.ts`

**Step 1: Write a mock contract test**

Create:

- `front/V3Lite/mock/__tests__/contracts.spec.ts`

Cover:

- login payload shape
- user info payload shape
- menu tree payload shape
- permission code array shape
- demo list payload shape

**Step 2: Implement mock handlers and env toggles**

Support running the full login and permission chain without backend services.

**Step 3: Verify mock development flow**

Run:

```bash
cd front/V3Lite && pnpm test -- contracts
cd front/V3Lite && pnpm dev
```

Expected: local development can complete login and render menus using mock data.

**Step 4: Commit**

```bash
git add front/V3Lite
git commit -m "feat: add mock data and environment config"
```

### Task 10: Document Usage and Delivery Notes

**Files:**
- Create: `front/V3Lite/README.md`
- Modify: `docs/plans/admin-template-design.md`
- Modify: `docs/plans/admin-template-implementation.md`

**Step 1: Write usage documentation**

Document:

- install and run commands
- environment variables
- login and permission flow
- how to add a new page
- how backend menu `component` values should map to `front/V3Lite/src/views`

**Step 2: Run final verification**

Run:

```bash
cd front/V3Lite && pnpm lint
cd front/V3Lite && pnpm stylelint
cd front/V3Lite && pnpm test
cd front/V3Lite && pnpm build
```

Expected: all commands pass cleanly.

**Step 3: Commit**

```bash
git add front/V3Lite docs/plans
git commit -m "docs: add admin template usage and delivery notes"
```

## Notes for Execution

- Default to `V3 Lite` only. Do not start `V2` or `V1` work during this plan.
- Keep all implementation inside `front/V3Lite/` unless documentation changes are required.
- Use mock data to finish the whole route and permission chain before depending on real backend services.
- Prefer small, reviewable commits after each task.
