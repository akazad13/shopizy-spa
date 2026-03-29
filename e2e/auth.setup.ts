import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Ensure fresh state by clearing storage before app loads
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  // Navigate to login page
  await page.goto('/auth/signin');

  // Fill in login credentials
  // Replace these with actual test credentials if needed
  await page.locator('input#email').fill('john.doe@shopizy.com');
  await page.locator('input#password').fill('Pass1234');

  // Click sign in
  await page.locator('button[type="submit"]').click();

  // Wait for login to complete and redirect
  await page.waitForURL((url) => !url.href.includes('/auth/signin'), { timeout: 20000 });
  
  // Verify logged in state
  const accountBtn = page.locator('app-header .account-dropdown-btn').first();
  await expect(accountBtn).toBeVisible({ timeout: 15000 });


  // Save auth state
  await page.context().storageState({ path: authFile });

});
