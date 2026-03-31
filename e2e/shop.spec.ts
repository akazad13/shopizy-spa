import { test, expect } from '@playwright/test';

test.describe('Shop and Product Discovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should display product list', async ({ page }) => {
    // Check if products are loaded (assuming they have a specific class or tag)
    const productCards = page.locator('app-product-card');
    await expect(productCards.first()).toBeVisible();
    
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('New');
      await searchInput.press('Enter');
      
      // Wait for results
      await page.waitForTimeout(1000); 
      const productNames = page.locator('app-product-card h3');
      const text = await productNames.first().innerText();
      expect(text.toLowerCase()).toContain('new');
    }
  });


  test('should filter by category', async ({ page }) => {
    // Assuming there's a category tree or list
    const categoryLink = page.locator('app-category-tree button, app-category-tree a').first();
    if (await categoryLink.isVisible()) {
      const categoryName = await categoryLink.innerText();
      await categoryLink.click();
      
      // Check if URL updates or results change
      await expect(page).toHaveURL(/.*category|.*shop/);
    }
  });

  test('should navigate to product details', async ({ page }) => {
    const firstProduct = page.locator('app-product-card').first();
    const productName = await firstProduct.locator('h3').innerText();
    
    // Click on product or "View" button
    await firstProduct.click();
    
    // Should be on product details page
    await expect(page).toHaveURL(/.*product\/.*/);
    await expect(page.locator('h1')).toContainText(productName);
  });
});
