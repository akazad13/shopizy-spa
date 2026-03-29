import { test, expect } from '@playwright/test';

// These tests will automatically use the authenticated state from auth.setup.ts
test.describe('Authenticated Account Flow', () => {

  test('should access account page without logging in again', async ({ page }) => {
    // Go directly to the protected account page
    await page.goto('/account');

    // Verify we are on the account page and not redirected to signin
    await expect(page).toHaveURL(/.*account/);
    await expect(page.locator('h1, h2')).toContainText(/Account|Profile/i);
    
    // Header should show the account link
    const header = page.locator('app-header');
    await expect(header).toContainText('Account');
  });

  test('should view wishlist', async ({ page }) => {
    await page.goto('/wishlist');
    await expect(page).toHaveURL(/.*wishlist/);
    
    // Check for wishlist title
    await expect(page.locator('h1, h2')).toContainText(/Wishlist/i);
  });

  test('should view order history', async ({ page }) => {
    await page.goto('/account/orders');
    await expect(page).toHaveURL(/.*orders/);
    
    // Check for "Orders" heading
    await expect(page.locator('h1, h2')).toContainText(/Orders/i);
  });
});
