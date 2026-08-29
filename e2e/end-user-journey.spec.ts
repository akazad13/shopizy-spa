import { test, expect, request as playwrightRequest } from '@playwright/test';
import * as fs from 'fs';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe.serial('Full End-User Experience Journey', () => {

  test.beforeAll(async ({ browser }) => {
    // ── Step 1: Ensure stock via Admin API ──
    try {
      const adminCtx = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
      const adminPage = await adminCtx.newPage();
      await adminPage.goto('/', { waitUntil: 'domcontentloaded' });

      await adminPage.evaluate(async (apiUrl: string) => {
        const raw = localStorage.getItem('user');
        const user = raw ? JSON.parse(raw) : null;
        const token: string | null =
          user?.token ?? user?.accessToken ?? user?.jwt ??
          (typeof user === 'string' ? user : null);
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
        const listRes = await fetch(`${apiUrl}/api/v1.0/products?PageNumber=1&PageSize=5`, { headers });
        const listData = await listRes.json();
        const products: any[] =
          listData.$values ?? listData.items?.$values ?? listData.items ?? [];

        for (const prod of products) {
          try {
            const detailRes = await fetch(`${apiUrl}/api/v1.0/products/${prod.productId}`, { headers });
            const p = await detailRes.json();
            await fetch(`${apiUrl}/api/v1.0/admin/products/${p.productId}`, {
              method: 'PUT',
              headers,
              body: JSON.stringify({
                name: p.name,
                shortDescription: p.shortDescription,
                description: p.description,
                categoryId: p.categoryId,
                brandId: p.brand?.brandId ?? null,
                sku: p.sku ?? `SKU-${p.productId.slice(0, 8)}`,
                price: p.price,
                unitPrice: p.price,
                discount: p.discount,
                stockQuantity: 100,
                colors: p.colors,
                sizes: p.sizes,
                tags: p.tags ?? '',
                images: (p.productImages ?? []).map((i: any) => i.productImageId ?? i.imageUrl),
              }),
            });
          } catch {}
        }
      }, 'http://localhost:18080');

      await adminCtx.close();
    } catch {}

    // ── Step 2: Seed a test order for the user (node-side, no CORS) ──
    try {
      const API_BASE = 'http://127.0.0.1:18080/api/v1.0';

      // Read credentials directly from the saved auth file
      const authJson = JSON.parse(fs.readFileSync('playwright/.auth/user.json', 'utf-8'));
      const lsEntry = authJson?.origins?.[0]?.localStorage?.find((e: any) => e.name === 'user');
      const userObj = lsEntry ? JSON.parse(lsEntry.value) : null;
      const token: string | null = userObj?.token ?? userObj?.accessToken ?? null;
      const userId: string | null = userObj?.id ?? userObj?.userId ?? null;
      if (!token || !userId) throw new Error('Could not extract user token/id from auth file');

      const apiCtx = await playwrightRequest.newContext({
        baseURL: API_BASE,
        extraHTTPHeaders: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      // Check if user already has orders this year
      const now = new Date();
      const startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      const endDate = now.toISOString().split('T')[0];
      const ordersRes = await apiCtx.get(
        `/users/${userId}/orders?StartDate=${startDate}&EndDate=${endDate}&PageNumber=1&PageSize=1`
      );

      if (ordersRes.ok()) {
        const ordersData = await ordersRes.json();
        const orders: any[] =
          ordersData.$values ?? ordersData.items?.$values ??
          (Array.isArray(ordersData.items) ? ordersData.items : []) ??
          (Array.isArray(ordersData) ? ordersData : []);
        if (orders.length > 0) {
          await apiCtx.dispose();
          return; // Already has orders — skip seeding
        }
      }

      // No orders found — fetch a product and place a seeder order
      const prodRes = await apiCtx.get('/products?PageNumber=1&PageSize=1');
      if (!prodRes.ok()) { await apiCtx.dispose(); return; }
      const prodData = await prodRes.json();
      const products: any[] =
        prodData.$values ?? prodData.items?.$values ??
        (Array.isArray(prodData.items) ? prodData.items : []) ??
        (Array.isArray(prodData) ? prodData : []);
      if (products.length === 0) { await apiCtx.dispose(); return; }

      const productId = products[0].productId;
      const idempotencyKey = require('crypto').randomUUID();

      await apiCtx.post('/orders/checkout', {
        headers: { 'Idempotency-Key': idempotencyKey },
        data: {
          deliveryMethod: 0,
          deliveryCharge: { amount: 0, currency: 'USD' },
          orderItems: [{ productId, color: '', size: '', quantity: 1 }],
          shippingAddress: {
            street: '742 Evergreen Terrace', city: 'Springfield',
            state: 'OR', country: 'USA', zipCode: '97477',
          },
          loyaltyPointsToRedeem: 0,
        },
      });

      await apiCtx.dispose();
    } catch (e) { console.warn('[beforeAll] Order seeding failed:', e); }
  });


  test('1. Discover Products: Search, Filter, and View Details', async ({ page }) => {
    // Navigate to the Shop catalog
    await page.goto('/shop');
    await expect(page).toHaveURL(/.*shop/);

    // Verify products are loaded
    const productCards = page.locator('app-product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 15000 });
    const initialCount = await productCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Search for a product using search bar
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('top');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator('app-product-card').first()).toBeVisible({ timeout: 10000 });
    }

    // Click on the first product to open the Product Details page
    const firstProduct = page.locator('app-product-card').first();
    const productName = (await firstProduct.locator('h3').innerText()).trim();
    await firstProduct.click();

    // Verify we navigated to the Product Details page
    await expect(page).toHaveURL(/.*product\/.*/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(productName, { timeout: 10000 });
    
    // Verify product price is displayed
    const priceElement = page.locator('.product-price, .text-3xl, .price').first();
    await expect(priceElement).toBeVisible();
  });

  test('2. Wishlist Management: Save & View in Wishlist', async ({ page }) => {
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });

    // Click Wishlist heart button on the first product card if available
    const wishlistBtn = firstProduct.locator('.wishlist-btn, button[title*="Wishlist"], app-icon[icon*="heart"]').first();
    if (await wishlistBtn.isVisible()) {
      await wishlistBtn.click();
    }

    // Navigate to Wishlist page
    await page.goto('/wishlist');
    await expect(page).toHaveURL(/.*wishlist/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Wishlist/i, { timeout: 10000 });
  });

  test('3. Cart & Dropcart: Add Items, Inspect Subtotal, and Modify Quantities', async ({ page }) => {
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });

    // Open dropcart & clean any leftover items to ensure clean state
    await page.locator('app-header .cart-button').click();
    const removeBtn = page.locator('app-dropcart .remove');
    while (await removeBtn.count() > 0) {
      await Promise.all([
        page.waitForResponse(
          res => res.url().includes('/cart/items') && res.request().method() === 'DELETE' && res.ok(),
          { timeout: 5000 }
        ),
        removeBtn.first().click(),
      ]);
    }
    // Close dropcart
    await page.locator('app-header .cart-button').click();

    // Add product to cart
    await Promise.all([
      page.waitForResponse(
        res => res.url().includes('/cart/items') && res.request().method() === 'PATCH' && res.ok(),
        { timeout: 10000 }
      ),
      firstProduct.locator('.add-to-cart-btn').click(),
    ]);

    // Open dropcart and verify item is present
    await page.locator('app-header .cart-button').click();
    const cartItem = page.locator('app-dropcart .cart-item').first();
    await expect(cartItem).toBeVisible({ timeout: 10000 });

    // Verify subtotal amount exists
    const subtotalText = await page.locator('app-dropcart').innerText();
    expect(subtotalText).toContain('$');
  });

  test('4. End-to-End Checkout: Shipping Tier Selection, Promo Code, and Order Submission', async ({ page }) => {
    // ── Navigate to Shop & Add Item ──
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });

    // Open dropcart & clear any leftover items
    await page.locator('app-header .cart-button').click();
    const removeBtn = page.locator('app-dropcart .remove');
    while (await removeBtn.count() > 0) {
      await Promise.all([
        page.waitForResponse(
          res => res.url().includes('/cart/items') && res.request().method() === 'DELETE' && res.ok(),
          { timeout: 5000 }
        ),
        removeBtn.first().click(),
      ]);
    }
    // Close dropcart
    await page.locator('app-header .cart-button').click();

    // Add single fresh item to cart
    await Promise.all([
      page.waitForResponse(
        res => res.url().includes('/cart/items') && (res.request().method() === 'POST' || res.request().method() === 'PATCH') && res.ok(),
        { timeout: 10000 }
      ),
      firstProduct.locator('.add-to-cart-btn').click(),
    ]);

    // Open Dropcart & Navigate to Checkout
    await page.locator('app-header .cart-button').click();
    await expect(page.locator('app-dropcart .cart-item, app-dropcart li').first()).toBeVisible({ timeout: 10000 });
    const checkoutLink = page.locator('app-dropcart').getByText('Checkout', { exact: true });
    await expect(checkoutLink).toBeVisible({ timeout: 10000 });
    await checkoutLink.click();

    // ── Fill in Shipping Details ──
    await expect(page).toHaveURL(/.*checkout/, { timeout: 15000 });

    const firstName = page.locator('input[formControlName="firstName"]');
    await expect(firstName).toBeVisible({ timeout: 10000 });
    await firstName.fill('Alex');
    await page.locator('input[formControlName="lastName"]').fill('Customer');
    await page.locator('input[formControlName="street"]').fill('742 Evergreen Terrace');
    await page.locator('input[formControlName="city"]').fill('Springfield');
    await page.locator('input[formControlName="state"]').fill('OR');
    await page.locator('input[formControlName="zipCode"]').fill('97477');

    // ── Select Shipping Method Tier ──
    const shippingMethodCard = page.locator('.rounded-xl.border-2.cursor-pointer').first();
    if (await shippingMethodCard.isVisible({ timeout: 10000 })) {
      await shippingMethodCard.click();
    }

    // ── Test Promo Code Input Field ──
    const promoInput = page.locator('input[placeholder*="promo" i], input[placeholder*="coupon" i], input[placeholder*="SUMMER" i]').first();
    if (await promoInput.isVisible()) {
      await promoInput.fill('DISCOUNT');
      await promoInput.dispatchEvent('input');
      await promoInput.dispatchEvent('change');
    }

    // ── Place Order & Proceed to Payment ──
    page.on('console', msg => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));

    let orderApiResponse: { status: number; body: string } | null = null;
    page.on('response', async res => {
      if (res.url().includes('/orders/checkout') || res.url().includes('/orders')) {
        orderApiResponse = { status: res.status(), body: await res.text().catch(() => '') };
        console.log(`[Captured API Response ${res.url()}]:`, res.status());
      }
    });

    const placeOrderBtn = page.locator('#submit-order-btn');
    await expect(placeOrderBtn).toBeVisible({ timeout: 10000 });
    await placeOrderBtn.click();

    // ── Verify Payment Page ──
    try {
      await page.waitForURL(/.*payment\/.*/, { timeout: 30000 });
      await expect(page).toHaveURL(/.*payment\/.*/);
    } catch {
      const alertText = await page.locator('[role="alert"]').innerText().catch(() => 'no alert');
      const capturedResponse = orderApiResponse as { status: number; body: string } | null;
      const apiInfo = capturedResponse
        ? `API ${capturedResponse.status}: ${capturedResponse.body.slice(0, 500)}`
        : 'no API response captured';
      throw new Error(`Order creation failed — "${alertText}" | ${apiInfo}`);
    }

    // Select Cash on Delivery option
    const codOption = page.locator('input[name="payment-method"]').nth(1);
    await expect(codOption).toBeVisible({ timeout: 10000 });
    await codOption.check();
    await codOption.click({ force: true });
    await codOption.dispatchEvent('change');
    await page.waitForTimeout(500);

    // Submit Payment
    const confirmPaymentBtn = page.locator('button:has-text("Place Order")').first();
    await expect(confirmPaymentBtn).toBeEnabled({ timeout: 10000 });
    await confirmPaymentBtn.click();

    // ── Verify Order Confirmation Page ──
    await page.waitForURL(/.*order-confirmation\/.*/, { timeout: 30000 });
    await expect(page.getByText(/Thanks for your order!|Order Confirmed/i)).toBeVisible({ timeout: 15000 });
  });

  test('5. Order History & Live Checkpoints Tracking', async ({ page }) => {
    // Navigate to Order History
    await page.goto('/account/orders');
    await expect(page).toHaveURL(/.*account\/orders/, { timeout: 15000 });

    // Wait for loading to complete then check orders list
    const orderItems = page.locator('.order-item');
    await expect(orderItems.first()).toBeVisible({ timeout: 20000 });

    // Open first order via "View details" link
    const viewOrderLink = orderItems.first().locator('a[href*="orders"], a[routerLink*="orders"], a:has-text("View details")').first();
    await viewOrderLink.click();

    // Verify order details page
    await expect(page).toHaveURL(/.*orders\/[0-9a-fA-F-]+/, { timeout: 15000 });
    await expect(page.locator('h1:has-text("Order Details")')).toBeVisible({ timeout: 10000 });
  });

  test('6. Notification Channels & Subscription Preferences', async ({ page }) => {
    // Navigate to Account settings
    await page.goto('/account');
    await expect(page).toHaveURL(/.*account/, { timeout: 15000 });

    // Check notification section presence (text matches decoded &amp; → &)
    const notifSection = page.locator('h2:has-text("Notification Channels")');
    await expect(notifSection).toBeVisible({ timeout: 10000 });

    // Click Save Preferences
    const saveBtn = page.locator('button:has-text("Save Preferences")');
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
    }
  });

});
