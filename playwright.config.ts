import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: 1,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10000,
  },


  projects: [
    // Setup projects
    {
      name: 'setup-user',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'setup-admin',
      testMatch: /admin\.setup\.ts/,
    },
    
    // Authenticated User project
    {
      name: 'user-chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup-user'],
      testIgnore: /admin\.spec\.ts/, // Users shouldn't run admin tests
    },

    // Authenticated Admin project
    {
      name: 'admin-chrome',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
      dependencies: ['setup-admin'],
      testMatch: /admin\.spec\.ts/, // Run only admin spec here
    },

    // Guest project (common Browsers)
    {
      name: 'guest-chrome',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/account\.spec\.ts/, /checkout\.spec\.ts/, /admin\.spec\.ts/],
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
