import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display total shop content', async ({ page }) => {
    // Navigate to the root URL
    await page.goto('/');

    // Check if the page title contains "Shopizy"
    await expect(page).toHaveTitle(/Shopizy/);

    // Verify header components are present
    const header = page.locator('app-header');
    await expect(header).toBeVisible();

    // Check for "Shop" or other primary links
    await expect(page.getByRole('link', { name: 'Shop', exact: true }).first()).toBeVisible();
  });

  test('should allow navigating to products', async ({ page }) => {
    await page.goto('/');
    
    // Click on a product category or "Shop" link
    const shopLink = page.getByRole('link', { name: 'Shop', exact: true }).first();
    await shopLink.click();

    // URL should update
    await expect(page).toHaveURL(/.*shop/);
  });
});
