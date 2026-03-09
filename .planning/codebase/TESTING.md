# Testing Patterns

**Analysis Date:** 2026-03-08

## Test Framework

**Runner:**
- None configured. The base templates (`desarrollo/landing-base`, `clientes/restaurante-web`) do not currently integrate a test runner (e.g., Vitest or Jest).
- Config: Not applicable.

**Assertion Library:**
- None installed.

**Run Commands:**
```bash
# Tests are currently not configured in package.json
# To add testing in the future, install vitest:
npm install -D vitest @vitest/ui
```

## Test File Organization

**Location:**
- No test files exist in the `src/` directory.
- *Recommendation:* Co-locate tests with their target files or place in a `__tests__` directory if unit testing utilities like `src/lib/cms.ts`.

**Naming:**
- *Recommendation:* `[name].test.ts` or `[name].spec.ts`

**Structure:**
```
src/
└── lib/
    ├── cms.ts
    └── cms.test.ts    # Suggested location when tests are added
```

## Test Structure

**Suite Organization:**
```typescript
// Recommended pattern for future implementation
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  it('should behave as expected', () => {
    // Test logic here
  });
});
```

**Patterns:**
- Currently not established.

## Mocking

**Framework:** None.

**Patterns:**
- For external services (like Sanity CMS client in `src/lib/cms.ts`), future tests should mock the `createClient` fetch function.

**What to Mock:**
- API and CMS network calls.
- Third-party SDKs.

**What NOT to Mock:**
- Pure internal utility logic and data transformation functions.

## Fixtures and Factories

**Test Data:**
- Not currently used.

**Location:**
- *Recommendation:* Create a `tests/fixtures/` directory or place alongside test files when introducing test data for CMS payloads.

## Coverage

**Requirements:** None enforced.

**View Coverage:**
- Not applicable.

## Test Types

**Unit Tests:**
- Not used.

**Integration Tests:**
- Not used.

**E2E Tests:**
- Not used. Playwright is recommended if end-to-end testing of Astro pages is needed.

## Common Patterns

**Async Testing:**
- Not established.

**Error Testing:**
- Not established.

---

*Testing analysis: 2026-03-08*