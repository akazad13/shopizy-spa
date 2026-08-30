# 🛍️ Shopizy — Modern E-Commerce Platform

[![Angular](https://img.shields.io/badge/Angular-19.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Testing-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![SignalR](https://img.shields.io/badge/SignalR-Real--Time-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/apps/aspnet/signalr)
[![ESLint](https://img.shields.io/badge/ESLint-Code_Quality-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

**Shopizy** is a responsive, feature-rich e-commerce single-page application (SPA) built with **Angular (Standalone Architecture)**, **Tailwind CSS**, **Stripe Payment Gateway**, and **Microsoft SignalR** for real-time order tracking and administrative metrics.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Customer Storefront](#-customer-storefront)
  - [Cart, Wishlist & Checkout](#-cart-wishlist--checkout)
  - [Order Tracking & Real-Time Updates](#-order-tracking--real-time-updates)
  - [Customer Account Portal](#-customer-account-portal)
  - [Admin Management Suite](#-admin-management-suite)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Dev Server](#running-the-dev-server)
- [Available Scripts](#-available-scripts)
- [Testing & Quality Assurance](#-testing--quality-assurance)
  - [Unit Testing (Karma/Jasmine)](#unit-testing-karmajasmine)
  - [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
  - [Code Linting (ESLint)](#code-linting-eslint)
- [Documentation Index](#-documentation-index)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 🛒 Customer Storefront
- **Modern Landing Page**: Promotional banners, featured products, top categories, and value propositions.
- **Faceted Product Catalog**: Filter by category tree, brand, price range, and rating with instant reactive updates.
- **Debounced Search**: Quick product discovery with keyword search and query string synchronization.
- **Rich Product Details**: Image galleries, inventory/variant selectors, customer reviews, product ratings, and Q&A interactions.

### 🛍️ Cart, Wishlist & Checkout
- **Reactive Cart**: Real-time quantity updates, cart drawer dropdown, and persistent browser storage.
- **Discounts & Loyalty**: Promo code validation, gift card vouchers, and loyalty point redemptions.
- **Streamlined Multi-Step Checkout**: Saved delivery addresses, dynamic shipping method selection, and order summary calculations.
- **Secure Stripe Payments**: Integrated **ngx-stripe** Elements with client secret authorization and real-time validation.

### 📦 Order Tracking & Real-Time Updates
- **Order Confirmation & Timeline**: Visual status tracker (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered`).
- **Live SignalR WebSockets**: Instant updates pushed to customer order pages and admin dashboards when order statuses change.

### 👤 Customer Account Portal
- **Profile & Security**: Update profile details, change passwords, and manage preferences.
- **Order History & Details**: View past orders, detailed line items, tracking IDs, and invoices.
- **Wishlist Management**: Save items for later with one-click migration to cart.

### ⚡ Admin Management Suite
- **Interactive KPI Dashboard**: Real-time analytics, revenue metrics, recent orders, and inventory health via SignalR.
- **Product Management**: Full CRUD capabilities, multi-category assignment, brand association, and image uploads.
- **Order Processing**: Manage order fulfillment workflows, tracking numbers, and cancellation handling.
- **Catalog Management**: Hierarchical category tree management and brand administration.
- **User & Security Management**: User role assignments and system audit logs.

---

## 🛠️ Architecture & Tech Stack

| Technology | Purpose |
|---|---|
| **[Angular](https://angular.dev/)** | Standalone Component Architecture, Reactive Forms, Signals & Resolvers |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first responsive styling and custom UI theming |
| **[RxJS](https://rxjs.dev/)** | Reactive streams, asynchronous data pipelines, state coordination |
| **[@microsoft/signalr](https://github.com/dotnet/aspnetcore/tree/main/src/SignalR)** | Bidirectional WebSocket hub communication |
| **[ngx-stripe](https://richnologies.gitbook.io/ngx-stripe/)** | Stripe Elements payment processing |
| **[@auth0/angular-jwt](https://github.com/auth0/angular2-jwt)** | JWT token decoding and expiration handling |
| **[Playwright](https://playwright.dev/)** | End-to-end multi-persona browser automation |
| **[Karma](https://karma-runner.github.io/) & [Jasmine](https://jasmine.github.io/)** | Component and API service unit testing |
| **[ESLint](https://eslint.org/)** | Static code analysis, style rules, and template linting |

For an in-depth dive into our architectural patterns, interceptors, and state flow, see [**docs/ARCHITECTURE.md**](file:///d:/Projects/akazad13/shopizy-app/docs/ARCHITECTURE.md).

---

## 📁 Project Structure

```text
shopizy-app/
├── e2e/                           # Playwright E2E test suites & auth setup
│   ├── auth.setup.ts              # Customer persona authentication setup
│   ├── admin.setup.ts             # Admin persona authentication setup
│   ├── checkout.spec.ts           # Checkout & payment test flows
│   ├── admin-journey.spec.ts      # Admin dashboard & management tests
│   └── guest-journey.spec.ts      # Guest browsing & catalog test flows
├── docs/                          # In-depth architectural & testing documentation
│   ├── ARCHITECTURE.md            # Technical design, data flow & interceptors
│   └── E2E_TESTING_GUIDE.md       # Playwright configuration & best practices
├── public/                        # Static assets
│   └── icons.svg                  # SVG Sprite Sheet icon definitions
├── src/
│   ├── app/
│   │   ├── api/                   # Typed REST API service layer
│   │   ├── components/            # Standalone UI components (Storefront, Admin, Auth, Shared)
│   │   ├── directives/            # Custom Angular directives (click-outside, etc.)
│   │   ├── guards/                # Route guards (AuthGuard with role verification)
│   │   ├── interceptors/          # HTTP Interceptors (Bearer token, 401 Silent Refresh, Errors)
│   │   ├── interfaces/            # TypeScript interfaces & DTOs
│   │   ├── models/                # Domain models & entities
│   │   ├── pipes/                 # Custom formatting & validation pipes
│   │   ├── resolvers/             # Angular route data resolvers
│   │   ├── services/              # State & business services (Cart, Wishlist, SignalR, Toast)
│   │   └── testing/               # Jasmine/Karma shared test spies and helpers
│   ├── environments/              # Environment configurations
│   └── styles.css                 # Tailwind CSS directives & global styling
├── ICONS_GUIDE.md                 # Complete SVG Sprite Sheet reference & catalog
├── playwright.config.ts           # Playwright multi-project test configuration
├── tailwind.config.js             # Tailwind CSS configuration & plugins
└── package.json                   # Dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`+
- **npm**: `v9.x`+
- **Backend API**: Running REST API instance (default: `http://localhost:18080` / `http://localhost:5054`)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/akazad13/shopizy-app.git
cd shopizy-app
npm install
```

### Environment Configuration

Configure your environment endpoints in [`src/environments/environment.ts`](file:///d:/Projects/akazad13/shopizy-app/src/environments/environment.ts) or [`src/environments/environment.development.ts`](file:///d:/Projects/akazad13/shopizy-app/src/environments/environment.development.ts):

```typescript
export const environment = {
  apiUrl: 'http://localhost:18080',
  production: false
};
```

### Running the Dev Server

Start the local development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when source files change.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Runs the Angular development server on `http://localhost:4200` |
| `npm run build` | Compiles the production-ready build into the `dist/` directory |
| `npm run watch` | Builds and watches files for changes in development mode |
| `npm test` | Runs unit tests with Karma and Jasmine |
| `npm run lint` | Executes ESLint against TypeScript and template files |
| `npm run test:e2e` | Runs headless Playwright E2E tests across all personas |
| `npm run test:e2e:ui` | Launches Playwright's interactive visual UI test runner |

---

## 🧪 Testing & Quality Assurance

### Unit Testing (Karma/Jasmine)
Unit tests focus on component logic, pipes, and API services:

```bash
npm test
```
- Test utilities and spies are centralized in [`src/app/testing/test-helpers.ts`](file:///d:/Projects/akazad13/shopizy-app/src/app/testing/test-helpers.ts).
- Pre-configured with headless Chrome flags in [`karma.conf.js`](file:///d:/Projects/akazad13/shopizy-app/karma.conf.js) for CI stability.

### End-to-End Testing (Playwright)
Shopizy uses Playwright with cached authentication states across three personas:

```bash
# 1. Install browser binaries (first time only)
npx playwright install

# 2. Run all E2E tests
npm run test:e2e

# 3. Run individual persona suites
npx playwright test --project=user-chrome
npx playwright test --project=admin-chrome
npx playwright test --project=guest-chrome
```

> [!NOTE]
> Ensure the backend API is reachable and seeded before executing authentication setup fixtures. See [**docs/E2E_TESTING_GUIDE.md**](file:///d:/Projects/akazad13/shopizy-app/docs/E2E_TESTING_GUIDE.md) for full setup instructions.

### Code Linting (ESLint)
Enforce codebase consistency and Angular template standards:

```bash
npm run lint
```

---

## 📖 Documentation Index

- 📘 [**Architecture & Design Guide**](file:///d:/Projects/akazad13/shopizy-app/docs/ARCHITECTURE.md) — Deep dive into standalone routing, JWT silent refresh interceptors, SignalR hubs, and state architecture.
- 🧪 [**E2E Testing Guide**](file:///d:/Projects/akazad13/shopizy-app/docs/E2E_TESTING_GUIDE.md) — Complete guide to Playwright fixtures, multi-persona authentication, and test runner options.
- 🎨 [**SVG Icon System Guide**](file:///d:/Projects/akazad13/shopizy-app/ICONS_GUIDE.md) — Comprehensive catalog of 45+ built-in SVG icons and `<app-icon>` usage guidelines.

---

## 🌐 Deployment

### Netlify
Shopizy includes a [`netlify.toml`](file:///d:/Projects/akazad13/shopizy-app/netlify.toml) configured for single-page application routing redirects:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

To build for production deployment:
```bash
npm run build
```
The output is generated in `dist/shopizy-app/browser/`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
