# AGENTS.md — AI Agent Guidance & Repository Rules

This document provides mandatory guidance for autonomous AI coding agents (Antigravity, Claude Code, GitHub Copilot, Cursor, Windsurf, Devin) operating in `akazad13/shopizy-app`.

---

## 1. System Identity & Architecture

**Product**: `Shopizy SPA` — Customer storefront and admin management portal for the Shopizy e-commerce ecosystem.
- **Runtime**: Angular Standalone Architecture, TypeScript.
- **Styling**: Tailwind CSS v3.
- **Payments**: Stripe Elements / `@stripe/stripe-js`.
- **Real-Time**: `@microsoft/signalr` for live order telemetry and merchant dashboard stats.
- **E2E Testing**: Playwright multi-persona browser automation (`Customer`, `Admin`, `Guest`).

### Project Layout (`src/`):
- `src/app/core/`: Singleton services, HTTP auth interceptors, route guards (`auth.guard`, `admin.guard`).
- `src/app/shared/`: Reusable components (Navbar, Footer, ProductCard, Pagination, LoadingSpinner).
- `src/app/features/`: Feature modules:
  - `shop/`: Catalog browsing, faceted filtering, search, and product details.
  - `cart/`: Sliding reactive cart drawer and checkout review.
  - `checkout/`: Multi-step address selection, carrier selection, Stripe payment.
  - `orders/`: Order history and SignalR live status tracker.
  - `admin/`: Product management, inventory stock adjustment, fulfillment.
- `e2e/`: Playwright test suites and authentication fixtures.

---

## 2. Inviolable Architectural Invariants

1. **Angular Standalone Standards**:
   - Use Standalone Components (`standalone: true`). Do not generate legacy `NgModule` wrappers.
   - Prefer Angular Signals and modern RxJS pipe patterns for state management.
2. **PCI-DSS Compliance**:
   - Never capture or store credit card numbers in Angular components or local state. Use Stripe Elements for all card payment input.
3. **Strict Peer Dependency Safeguard**:
   - Because `@stripe/stripe-js` has strict peer constraints with `ngx-stripe`, always run `npm install --legacy-peer-deps` or use exact versions when installing packages.
4. **Environment Configuration**:
   - API endpoints and Stripe publishable keys must come from `src/environments/environment.ts` and `environment.prod.ts`.

---

## 3. Commands Cheat Sheet

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start Angular dev server
npm start

# Run production build
npm run build

# Run unit tests
npm test -- --watch=false

# Run Playwright E2E tests
npx playwright test
```

---

## 4. Verification Gates for AI Agents

Before submitting code changes or finishing a turn:
1. Run `npm run build` — Angular AOT production build must succeed with **0 errors**.
2. Verify responsive layout for mobile checkout viewports.
