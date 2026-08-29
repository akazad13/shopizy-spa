import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/admin.json' });

test.describe.serial('Full Admin Experience Journey', () => {

  test('1. Admin Dashboard: Metrics & Store Overview', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });

    // Hero banner with "Store Overview" heading
    const dashboardHeading = page.locator('h1:has-text("Store Overview")');
    await expect(dashboardHeading).toBeVisible({ timeout: 10000 });

    // Metrics grid cards should be present
    const metricCards = page.locator('.grid .rounded-3xl, .grid .group');
    await expect(metricCards.first()).toBeVisible({ timeout: 10000 });

    // Admin sidebar navigation should be visible
    const sidebar = page.locator('app-admin-sidebar, aside, nav');
    await expect(sidebar.first()).toBeVisible({ timeout: 5000 });
  });

  test('2. Products Catalog: List, Search, and Navigate to New Product Form', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page).toHaveURL(/.*admin\/products/, { timeout: 15000 });

    // Page heading
    const heading = page.locator('h1:has-text("Products Catalog")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Products table should load
    const productRows = page.locator('tbody tr, .product-item');
    await expect(productRows.first()).toBeVisible({ timeout: 15000 });
    const count = await productRows.count();
    expect(count).toBeGreaterThan(0);

    // Search input
    const searchInput = page.locator('input[placeholder*="Search by product name"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('top');
    await page.locator('button:has-text("Filter")').click();
    await page.waitForTimeout(1000);
    await page.locator('button:has-text("Reset")').click();
    await page.waitForTimeout(500);

    // Navigate to new product form
    const addProductLink = page.locator('a[routerLink="/admin/products/new"], a:has-text("Add New Product")').first();
    await expect(addProductLink).toBeVisible();
    await addProductLink.click();
    await expect(page).toHaveURL(/.*admin\/products\/new/, { timeout: 10000 });

    // Product form
    const formHeading = page.locator('h1:has-text("New product")');
    await expect(formHeading).toBeVisible({ timeout: 10000 });

    const nameInput = page.locator('input[formControlName="name"], input[placeholder*="Product title"]').first();
    await expect(nameInput).toBeVisible();
    await nameInput.fill('E2E Test Product');

    const submitBtn = page.locator('button[type="submit"], button:has-text("Create")').first();
    await expect(submitBtn).toBeVisible();
  });

  test('3. Orders Management: List and View Order Details', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page).toHaveURL(/.*admin\/orders/, { timeout: 15000 });

    const heading = page.locator('h1:has-text("Orders Overview")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const orderRows = page.locator('tbody tr');
    await expect(orderRows.first()).toBeVisible({ timeout: 15000 });

    const metricsGrid = page.locator('.grid .rounded-2xl').first();
    await expect(metricsGrid).toBeVisible();

    // Click "Details" on first order row
    const detailsLink = page.locator('a:has-text("Details")').first();
    await expect(detailsLink).toBeVisible({ timeout: 10000 });
    await detailsLink.click();
    await expect(page).toHaveURL(/.*admin\/orders\/[0-9a-fA-F-]+/, { timeout: 15000 });

    // Order details heading shows the order ID (e.g. "#uuid")
    const orderHeading = page.locator('h1');
    await expect(orderHeading).toBeVisible({ timeout: 10000 });

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/.*admin\/orders$/, { timeout: 10000 });
  });

  test('4. User Management: List All Registered Users', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/.*admin\/users/, { timeout: 15000 });

    const heading = page.locator('h1:has-text("User Management")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const userRows = page.locator('tbody tr');
    await expect(userRows.first()).toBeVisible({ timeout: 15000 });
    const count = await userRows.count();
    expect(count).toBeGreaterThan(0);

    const statsCards = page.locator('.grid .rounded-2xl').first();
    await expect(statsCards).toBeVisible();
  });

  test('5. Categories Management: View Hierarchy & Add Category Form', async ({ page }) => {
    await page.goto('/admin/categories');
    await expect(page).toHaveURL(/.*admin\/categories/, { timeout: 15000 });

    const heading = page.locator('h1:has-text("Categories Hierarchy")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Stats metric visible
    const totalCount = page.locator('.text-2xl.font-extrabold').first();
    await expect(totalCount).toBeVisible({ timeout: 10000 });

    // Open Add Category form
    const addCategoryBtn = page.locator('button:has-text("Add Category")');
    await expect(addCategoryBtn).toBeVisible();
    await addCategoryBtn.click();

    const categoryNameInput = page.locator('input[name="name"]').first();
    await expect(categoryNameInput).toBeVisible({ timeout: 5000 });
  });

  test('6. Brands Management: View Brands & Add Brand Form', async ({ page }) => {
    await page.goto('/admin/brands');
    await expect(page).toHaveURL(/.*admin\/brands/, { timeout: 15000 });

    const heading = page.locator('h1:has-text("Brand Management")');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const addBrandBtn = page.locator('button:has-text("Add Brand")');
    await expect(addBrandBtn).toBeVisible();
    await addBrandBtn.click();

    const brandNameInput = page.locator('input[name="name"]').first();
    await expect(brandNameInput).toBeVisible({ timeout: 5000 });
    await brandNameInput.fill('E2E Test Brand');

    const submitBtn = page.locator('button[type="submit"]').first();
    await expect(submitBtn).toBeVisible();
  });

});
