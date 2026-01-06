# Shopizy App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 19.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Testing & Linting 🔧

- A shared test helper was added at `src/app/testing/test-helpers.ts` to centralize common test imports and factory spies (e.g., `COMMON_TEST_IMPORTS`, `createProductApiSpy`, `provideSpy`). Use these helpers in specs to avoid live HTTP calls and reduce duplication.
- Prefer `HttpClientTestingModule` and Jasmine spies instead of real API providers in unit tests.
- A `karma.conf.js` was added to stabilize CI runs (headless Chrome with safer flags and increased timeouts). Use it when running tests in CI.
- ESLint config (`.eslintrc.json`) and a `lint` script were added to `package.json`. To run lint locally:
  - Install dev dependencies: `npm install` (or `npm i`)
  - Run `npm run lint`
  - If you encounter dependency issues installing ESLint packages, run `npm install --legacy-peer-deps`.

If you'd like, I can open a PR that adds ESLint to CI and fixes the remaining stylistic issues.

