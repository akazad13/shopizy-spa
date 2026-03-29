import { test, expect } from '@playwright/test';

// These tests will automatically use the authenticated state from auth.setup.ts
test.describe('Authenticated Account Flow', () => {

  test('should access account page without logging in again', async ({ page }) => {
    // Go directly to the protected account page
    await page.goto('/account');

    // Verify we are on the account page and not redirected to signin
    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('h1')).toContainText(/My Account/i);
    
    // Header should show the account button (use button element to avoid matching nested img)
    const header = page.locator('app-header');
    await expect(header.locator('button.account-dropdown-btn')).toBeVisible();

  });

  test('should view wishlist', async ({ page }) => {
    await page.goto('/wishlist');
    await page.waitForURL(/.*wishlist/, { timeout: 15000 });
    
    // Check for wishlist title explicitly
    await expect(page.locator('h1')).toContainText(/Wishlist/i, { timeout: 15000 });
  });

  test('should view order history', async ({ page }) => {
    await page.goto('/account/orders');
    await page.waitForURL(/.*orders/, { timeout: 15000 });
    
    // Check for "My orders" heading explicitly (filter to avoid matching cart drawer h2)
    await expect(page.locator('h2').filter({ hasText: /orders/i })).toContainText(/orders/i, { timeout: 15000 });
  });



});
