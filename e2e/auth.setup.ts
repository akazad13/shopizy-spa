import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto('/auth/signin');

  // Fill in login credentials
  // Replace these with actual test credentials if needed
  await page.locator('input#email').fill('test@example.com');
  await page.locator('input#password').fill('password123');
  
  // Click sign in
  await page.locator('button[type="submit"]').click();

  // Wait for navigation or successful login indication
  // We expect to redirect away from signin
  await page.waitForURL((url) => !url.href.includes('/auth/signin'));

  // Ensure login was successful (e.g., check for account link in header)
  await expect(page.locator('app-header')).toContainText('Account');

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
