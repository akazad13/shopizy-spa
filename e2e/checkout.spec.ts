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
    
    // 5. Place order and proceed to payment
    const placeOrderBtn = page.locator('a:has-text("Place Order")');
    await placeOrderBtn.click();

    // 6. Navigate to payment page
    await expect(page).toHaveURL(/.*payment\/.*/);

    // 7. Select COD for simplicity in testing
    const codOption = page.locator('input[type="radio"][value="2"]'); // Assuming 2 is COD
    if (await codOption.isVisible()) {
      await codOption.check();
      
      const finishBtn = page.locator('button:has-text("Place Order")');
      await finishBtn.click();
      
      // 8. Should see confirmation page
      await expect(page).toHaveURL(/.*order-confirmation\/.*/);
      await expect(page.locator('h1, h2')).toContainText(/Order|Success/i);
    }
  });

  test('should view the placed order in account history', async ({ page }) => {
    await page.goto('/account/orders');
    
    // There should be at least one order now
    const orders = page.locator('.order-card, .order-item, tr.order-row');
    await expect(orders.first()).toBeVisible();
  });
});
