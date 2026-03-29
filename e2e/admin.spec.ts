import { test, expect } from '@playwright/test';

// Use the admin authentication state for all tests in this file
test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe('Admin Management Flow', () => {

  test('should access admin dashboard directly', async ({ page }) => {
    // Go directly to the admin dashboard
    await page.goto('/admin/dashboard');

    // Verify admin dashboard components
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    
    // Check for metrics or dashboard title
    const dashboardTitle = page.locator('h1, h2:has-text("Dashboard")');
    await expect(dashboardTitle).toBeVisible();
    
    // Recent orders should be visible
    const ordersTable = page.locator('table, .orders-list');
    await expect(ordersTable).toBeVisible();
  });

  test('should manage products', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/.*admin\/products/);

    // List of products should load
    const productRows = page.locator('tr, .product-item');
    await expect(productRows.first()).toBeVisible();

    // Click "Add Product"
    const addProductBtn = page.locator('a:has-text("New"), button:has-text("Add Product")');
    if (await addProductBtn.isVisible()) {
      await addProductBtn.click();
      await expect(page).toHaveURL(/.*admin\/products\/new/);
      
      // Fill in product form
      await page.locator('input[formControlName="name"]').fill('Test Product');
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    }
  });

  test('should view user accounts', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/.*admin\/users/);
    
    // Users table should appear
    const userRows = page.locator('tr, .user-row');
    await expect(userRows.first()).toBeVisible();
  });

  test('should view categories', async ({ page }) => {
    await page.goto('/admin/categories');
    await expect(page).toHaveURL(/.*admin\/categories/);
    
    // Categories should load
    const categoryItems = page.locator('.category-item, .category-row');
    await expect(categoryItems.first()).toBeVisible();
  });
});
