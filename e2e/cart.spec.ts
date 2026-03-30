import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should add a product to cart from shop page', async ({ page }) => {
    // Clear any pre-existing cart items so initialCount is always 0.
    // Without this, adding an already-present product only updates its quantity
    // while totalItems (unique line count) stays the same, breaking the +1 assertion.
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
    await page.locator('app-header .cart-button').click(); // close dropcart via toggle

    // Locate the first product card's "Add to Cart" button
    const productCard = page.locator('app-product-card').first();
    const addToCartButton = productCard.locator('button:has-text("Add to Cart"), .add-to-cart-btn');

    const cartBadge = page.locator('app-header .cart-badge');

    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      // Cart was empty; badge must now show 1.
      // Guest: cart is localStorage-only (no PATCH), badge still updates.
      // Authenticated: PATCH fires, then CartService updates the badge.
      await expect(cartBadge).toHaveText('1', { timeout: 10000 });
    }
  });

  test('should open side cart or navigate to cart page', async ({ page }) => {
    // Open the cart (assuming it's a side drawer or link in header)
    const cartButton = page.locator('app-header .cart-button, app-header a[routerLink="/cart"]');
    await cartButton.click();
    
    // Check if side cart is visible or we are on the cart page
    const cartTitle = page.locator('.cart-drawer-title, .cart-page-title, h1:has-text("Your Cart")');
    await expect(cartTitle).toBeVisible();
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Open the cart
    const cartButton = page.locator('app-header .cart-button, app-header a[routerLink="/cart"]');
    await cartButton.click();
    
    const cartItem = page.locator('.cart-item').first();
    if (await cartItem.isVisible()) {
      const plusButton = cartItem.locator('button.plus, button:has-text("+")');
      const qtyDisplay = cartItem.locator('.quantity-display, input.quantity');
      
      const prevQtyValue = await qtyDisplay.innerText();
      const prevQty = parseInt(prevQtyValue) || 1;
      await plusButton.click();
      
      await expect(qtyDisplay).toHaveText((prevQty + 1).toString(), { timeout: 10000 });
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Open the cart if not open
    const cartButton = page.locator('app-header .cart-button, app-header a[routerLink="/cart"]');
    await cartButton.click();
    
    const cartItem = page.locator('.cart-item').first();
    if (await cartItem.isVisible()) {
      const deleteButton = cartItem.locator('button.remove, button:has-text("Remove")');
      await deleteButton.click();
      
      await expect(cartItem).not.toBeVisible();
    }
  });

});
