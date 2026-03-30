import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

// Serial: test 2 asserts the order created in test 1 appears in history.
test.describe.serial('Secure Checkout Flow', () => {

  test('should place an order end-to-end', async ({ page, browser }) => {
    // ── 0. Ensure the first product has sufficient stock ──────────────────────
    // Open a throw-away admin context so we can call the admin PUT endpoint.
    // We use page.evaluate (runs inside the browser) so that fetch inherits the
    // origin's TLS trust and the admin JWT from localStorage is available.
    const adminCtx = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
    const adminPage = await adminCtx.newPage();
    await adminPage.goto('/', { waitUntil: 'domcontentloaded' });

    await adminPage.evaluate(async (apiUrl: string) => {
      const raw = localStorage.getItem('user');
      const user = raw ? JSON.parse(raw) : null;
      // TokenService tries user.token → .accessToken → .jwt → user itself
      const token: string | null =
        user?.token ?? user?.accessToken ?? user?.jwt ??
        (typeof user === 'string' ? user : null);
      if (!token) throw new Error('Admin JWT not found in localStorage');

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      // Fetch the first product from the public listing
      const listRes = await fetch(`${apiUrl}/api/v1.0/products?PageNumber=1&PageSize=1`, { headers });
      const listData = await listRes.json();
      const products: any[] =
        listData.$values ?? listData.items?.$values ?? listData.items ?? [];
      if (!products.length) throw new Error('No products found');

      // Fetch full detail (needed for the PUT body)
      const detailRes = await fetch(`${apiUrl}/api/v1.0/products/${products[0].productId}`, { headers });
      const p = await detailRes.json();

      // PUT with stockQuantity bumped to 100.
      // The API requires `sku` and `unitPrice` (not `price`); images expects
      // productImageId values (matching the admin form's onSubmit payload).
      const putRes = await fetch(`${apiUrl}/api/v1.0/admin/products/${p.productId}`, {
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
      if (!putRes.ok) throw new Error(`Stock update failed: ${putRes.status} ${await putRes.text()}`);
    }, 'https://localhost:7171');

    await adminCtx.close();

    // ── 1. Add a product to cart ──────────────────────────────────────────────
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    await expect(firstProduct).toBeVisible({ timeout: 10000 });

    // ── 0. Clear cart leftovers from previous runs ────────────────────────────
    // The cart is server-side and persists; repeated runs accumulate quantity
    // until it exceeds stock and the order API returns 400.
    await page.locator('app-header .cart-button').click();
    const removeBtn = page.locator('app-dropcart .remove');
    while (await removeBtn.count() > 0) {
      await Promise.all([
        page.waitForResponse(
          res => res.url().includes('/cart/items/') && res.request().method() === 'DELETE' && res.ok(),
          { timeout: 5000 }
        ),
        removeBtn.first().click(),
      ]);
    }
    // Close via the cart button (the header's toggle) — using the dropcart's
    // internal "Close panel" button only flips the child @Input locally and
    // leaves the header's isDropCartOpened=true, causing the next cart-button
    // click to close rather than open the dropcart.
    await page.locator('app-header .cart-button').click();

    // .add-to-cart-btn is an icon-only button; no visible text to match against.
    // waitForResponse guards against the race where CartService.getCartData()'s
    // GET /cart response would overwrite the optimistic update after a rollback.
    await Promise.all([
      page.waitForResponse(
        res =>
          res.url().includes('/cart/items') &&
          res.request().method() === 'PATCH' &&
          res.ok(),
        { timeout: 10000 }
      ),
      firstProduct.locator('.add-to-cart-btn').click(),
    ]);

    // ── 2. Navigate to checkout via the dropcart ──────────────────────────────
    // page.goto('/checkout') triggers a full page reload which reinitialises
    // CartService and clears the in-memory cart before submitOrder() can read it.
    // The dropcart's Checkout link calls router.navigate() (client-side) instead.
    await page.locator('app-header .cart-button').click();
    await expect(page.locator('.cart-item').first()).toBeVisible({ timeout: 5000 });
    await page.locator('app-dropcart').getByText('Checkout', { exact: true }).click();
    await expect(page).toHaveURL(/.*checkout/, { timeout: 10000 });

    // ── 3. Fill shipping form ─────────────────────────────────────────────────
    // Wait for firstName to confirm the form is interactive.
    const firstName = page.locator('input[formControlName="firstName"]');
    await expect(firstName).toBeVisible();
    await firstName.fill('Test');
    await page.locator('input[formControlName="lastName"]').fill('User');
    await page.locator('input[formControlName="street"]').fill('123 Test Street');
    await page.locator('input[formControlName="city"]').fill('Test City');
    await page.locator('input[formControlName="state"]').fill('TS');
    await page.locator('input[formControlName="zipCode"]').fill('12345');

    // ── 4. Submit the order ───────────────────────────────────────────────────
    // Capture the checkout API response first so we can surface the server error
    // if navigation to /payment does not happen.
    let orderApiResponse: { status: number; body: string } | null = null;
    page.on('response', async res => {
      if (res.url().includes('/orders/checkout')) {
        orderApiResponse = { status: res.status(), body: await res.text().catch(() => '') };
      }
    });

    await page.locator('a:has-text("Place Order & Proceed to Payment")').click();

    try {
      await page.waitForURL(/.*payment\/.*/, { timeout: 30000 });
    } catch {
      const alertText = await page.locator('[role="alert"]').innerText().catch(() => 'no alert');
      const apiInfo = orderApiResponse
        ? `API ${orderApiResponse.status}: ${orderApiResponse.body.slice(0, 500)}`
        : 'no API response captured';
      throw new Error(`Order creation failed — "${alertText}" | ${apiInfo}`);
    }

    // ── 5. Pay with Cash on Delivery ─────────────────────────────────────────
    // [value="2"] is unreliable with Angular ngModel; name="payment-method" is
    // hardcoded in the template so nth(1) (= COD) is stable.
    const codOption = page.locator('input[name="payment-method"]').nth(1);
    await expect(codOption).toBeVisible();
    await codOption.check();

    // Wait for the total to update before submitting.
    await expect(page.locator('button:has-text("Place Order")')).toBeEnabled();
    await page.locator('button:has-text("Place Order")').click();

    // ── 6. Confirm order ──────────────────────────────────────────────────────
    // dropcart keeps its <h2 "Shopping cart"> in the DOM (scale-0); a broad
    // 'h1, h2, h3' locator would match it too, failing toContainText on all.
    await page.waitForURL(/.*order-confirmation\/.*/, { timeout: 30000 });
    await expect(page.getByText('Thanks for your order!')).toBeVisible();
  });

  test('should show the placed order in account history', async ({ page }) => {
    await page.goto('/account/orders');
    // Default filter is "this week"; widen to "this year" so the just-placed
    // order is always included regardless of week-boundary edge cases.
    await page.locator('select#duration').selectOption('this year');
    // orders.component.html renders each row as <div class="order-item ...">
    await expect(page.locator('.order-item').first()).toBeVisible({ timeout: 15000 });
  });
});
