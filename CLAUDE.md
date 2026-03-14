# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start        # Dev server at http://localhost:4200
npm run build        # Production build → dist/shopizy-app
npm run watch        # Build in watch mode (development)
npm run test         # Run unit tests via Karma
npm run lint         # ESLint with zero warnings tolerance (--max-warnings=0)
```

To run a single test file, use:
```bash
npx ng test --include="**/auth.service.spec.ts"
```

ESLint packages may require `--legacy-peer-deps` when installing.

## Architecture

**Shopizy** is an Angular 21 e-commerce SPA (standalone components, no lazy loading) backed by a REST API at `http://localhost:5054` (configurable via `src/environments/`).

### Layer Structure

- **`src/app/api/`** — Thin HTTP wrappers (one file per domain: auth, cart, product, order, payment, user, category). All use `HttpClient` + environment `apiUrl`.
- **`src/app/services/`** — Business logic using `BehaviorSubject` + RxJS. No NgRx.
- **`src/app/components/`** — Feature-organized standalone components. Nested under `RootComponent` for the shared header/footer layout; auth routes live under `/auth` outside of it.
- **`src/app/interfaces/`** — TypeScript models for all data structures.
- **`src/app/resolvers/`** — Pre-load route data (product details, order details) before navigation.

### State Management

Services hold `BehaviorSubject` state exposed via `.asObservable()`:
- **`AuthService`** / **`AuthApi`** — user state persisted to `localStorage`
- **`CartService`** — dual-mode cart: `localStorage` for guests, API for authenticated users; syncs on login

### Auth Flow

- JWT tokens via `@auth0/angular-jwt`
- `TokenService` extracts/decodes tokens, checks expiry, reads roles
- `authTokenInterceptor` (functional interceptor) attaches `Bearer` token to all non-auth API requests
- `AuthGuard` has two modes: redirect to `/auth/signin` when unauthenticated, or redirect away when already logged in

### Testing

Test helpers are centralized at `src/app/testing/test-helpers.ts`:
- `COMMON_TEST_IMPORTS` — shared test module imports
- `createProductApiSpy`, `provideSpy` — factory functions to avoid live HTTP calls
- Use `HttpClientTestingModule` in unit tests; `karma.conf.js` uses headless Chrome for CI

### Key Config Files

| File | Purpose |
|------|---------|
| `src/app/app.config.ts` | DI providers: router, HTTP client, Stripe |
| `src/app/app.routes.ts` | All route definitions |
| `src/environments/environment*.ts` | `apiUrl` per environment |
| `.eslintrc.json` | ESLint rules for TS + Angular templates |
