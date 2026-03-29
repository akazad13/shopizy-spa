import { test as setup, expect } from '@playwright/test';

const adminAuthFile = 'playwright/.auth/admin.json';

setup('authenticate admin', async ({ page }) => {
  // Ensure fresh state by clearing storage before app loads
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  // Navigate to login page
  await page.goto('/auth/signin');



  // Fill in admin credentials
  await page.locator('input#email').fill('admin-test@shopizy.com');
  await page.locator('input#password').fill('Pass1234');
  
  // Click sign in
  await page.locator('button[type="submit"]').click();

  // Wait for login to complete
  await page.waitForURL((url) => !url.href.includes('/auth/signin'));

  // Verify Admin link appears in header
  const adminLink = page.locator('#admin-link');
  await expect(adminLink).toBeVisible({ timeout: 15000 });


  // Save admin state
  await page.context().storageState({ path: adminAuthFile });
});
