# Codebase Concerns

**Analysis Date:** 2026-03-08

## Tech Debt

**Component Monoliths:**
- Issue: Several Astro UI components are overly large, mixing dense HTML structures, long Tailwind class strings, and inline SVG icons.
- Files: `desarrollo/landing-base/src/components/Hero.astro`, `desarrollo/landing-base/src/components/Plans.astro`, `clientes/restaurante-web/src/pages/index.astro`
- Impact: Harder to maintain, read, and theme. High risk of breaking the layout when making small text/styling adjustments.
- Fix approach: Extract repeating elements (like pricing tiers, icons, buttons) into smaller reusable components (e.g., `PlanCard.astro`, `Button.astro`).

**Duplicate Code Architecture:**
- Issue: Client projects are created by fully copying `desarrollo/landing-base` or `desarrollo/web-base`. There is no shared internal library for core UI components.
- Files: `desarrollo/landing-base/`, `clientes/landing-cliente-prueba/`
- Impact: Bug fixes, accessibility improvements, or base performance enhancements made in the templates cannot be easily backported to existing client projects.
- Fix approach: Evaluate moving core agnostic UI components into a private npm package or shared workspace package instead of pure copy-pasting.

## Known Bugs

**Silent Fallbacks in CMS Client:**
- Symptoms: If environment variables are missing, the application attempts to fetch data from a hardcoded string `'your_project_id'` instead of throwing a configuration error.
- Files: `clientes/restaurante-web/src/lib/cms.ts`
- Trigger: Missing `PUBLIC_SANITY_PROJECT_ID` or `PUBLIC_SANITY_DATASET` environment variables in the Coolify deployment.
- Workaround: Ensure env vars are strictly defined in the deployment panel.
- Fix approach: Fail fast. Throw an explicit error if critical environment variables are undefined before initializing the client.

## Security Considerations

**Environment Variable Management:**
- Risk: While no `.env` files are checked into version control (which is excellent), the environment variables are assumed to be manually provided into Coolify without build-time verification.
- Files: `clientes/restaurante-web/src/lib/cms.ts`, `CLAUDE.md`
- Current mitigation: Gitignore prevents `.env` leaks.
- Recommendations: Implement an environment variable validation step at build time (e.g., using `zod` in `astro.config.mjs` or `cms.ts`) to guarantee required secrets/tokens are present before a deployment proceeds.

## Fragile Areas

**CMS Data Fetching Error Handling:**
- Files: `clientes/restaurante-web/src/lib/cms.ts`
- Why fragile: The `getRestaurantMenu()` function wraps the `sanityClient.fetch` in a try-catch block but returns an empty object `{}` on error. If the Sanity API goes down during a build, Astro will successfully build an empty menu rather than failing the build.
- Safe modification: Remove the empty fallback. Re-throw the error so that the CI/CD pipeline correctly identifies a failed build and prevents deploying a broken/empty site.
- Test coverage: None.

## Test Coverage Gaps

**Entire Application Logic:**
- What's not tested: There are zero automated tests (no unit, integration, or E2E tests) across the base templates and client applications.
- Files: `desarrollo/landing-base/*`, `clientes/restaurante-web/*`
- Risk: High risk of regressions when updating Astro, Tailwind, or modifying data fetching logic. Broken links or malformed data might reach production undetected.
- Priority: High. Establish a baseline testing framework (e.g., Vitest for utility functions like `cms.ts`, Playwright for basic E2E smoke tests on critical paths).
