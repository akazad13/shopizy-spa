import { test, expect } from '@playwright/test';

// Use the authenticated state for checkout
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Secure Checkout Flow', () => {

  test('should go from product to successfully placing an order', async ({ page }) => {
    // 1. Visit shop and add a product to cart
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    const addToCartBtn = firstProduct.locator('button:has-text("Add to Cart"), .add-to-cart-btn');
    
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    } else {
      // If no button, click product and add from details
      await firstProduct.click();
      await page.waitForURL(/.*product\/.*/);
      await page.locator('button:has-text("Add to Cart")').click();
    }

    // Open dropcart and wait for cart-item to be visible — this confirms the
    // API add-to-cart call completed (not just the optimistic update).
    const cartButton = page.locator('app-header .cart-button');
    await cartButton.click();
    await expect(page.locator('.cart-item').first()).toBeVisible({ timeout: 10000 });
    // Close dropcart before navigating
    await cartButton.click();

    // 2. Navigate to checkout page
    await page.goto('/checkout');
    await expect(page).toHaveURL(/.*checkout/);

    // 3. Select delivery method
    const deliveryOption = page.locator('input[type="radio"][name="deliveryMethod"]').first();
    await deliveryOption.check();

    // 4. Fill in shipping information (autofilled if authenticated but let's ensure)
    const firstName = page.locator('input[formControlName="firstName"]');
    await firstName.clear();
    await firstName.fill('Test');
    
    const lastName = page.locator('input[formControlName="lastName"]');
    await lastName.clear();
    await lastName.fill('User');

    await page.locator('input[formControlName="street"]').fill('123 Test Street');
    await page.locator('input[formControlName="city"]').fill('Test City');
    await page.locator('input[formControlName="state"]').fill('TS');
    await page.locator('input[formControlName="zipCode"]').fill('12345');
    
    // Capture API response from order creation for better error messages
    let orderApiResponse: { status: number; body: string } | null = null;
    page.on('response', async response => {
      if (response.url().includes('/orders/checkout')) {
        orderApiResponse = { status: response.status(), body: await response.text().catch(() => '') };
      }
    });

    // 5. Place order and proceed to payment
    const placeOrderBtn = page.locator('a:has-text("Place Order & Proceed to Payment")');
    await placeOrderBtn.click();

    // 6. Navigate to payment page
    try {
      await page.waitForURL(/.*payment\/.*/, { timeout: 30000 });
    } catch {
      const serverError = page.locator('[role="alert"]');
      const errorText = await serverError.innerText().catch(() => 'unknown error');
      const apiDetails = orderApiResponse
        ? `API ${orderApiResponse.status}: ${orderApiResponse.body.slice(0, 500)}`
        : 'no API response captured';
      throw new Error(`Order creation failed — form error: "${errorText}" | ${apiDetails}`);
    }
    await expect(page).toHaveURL(/.*payment\/.*/);

    // 7. Select COD for simplicity in testing
    const codOption = page.locator('input[type="radio"][value="2"]');
    await codOption.waitFor({ state: 'visible' });
    await codOption.check();
    
    // Wait for price update if any
    await page.waitForTimeout(500);
    
    const finishBtn = page.locator('button:has-text("Place Order")');
    await finishBtn.click();
    
    // 8. Should see confirmation page
    await page.waitForURL(/.*order-confirmation\/.*/, { timeout: 30000 });
    await expect(page).toHaveURL(/.*order-confirmation\/.*/);
    await expect(page.locator('h1, h2, h3')).toContainText(/Order|Success|confirmed/i);

  });

  test('should view the placed order in account history', async ({ page }) => {
    await page.goto('/account/orders');
    
    // There should be at least one order now
    const orders = page.locator('.order-card, .order-item, tr.order-row');
    await expect(orders.first()).toBeVisible();
  });
});
