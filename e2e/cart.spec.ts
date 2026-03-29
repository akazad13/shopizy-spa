import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should add a product to cart from shop page', async ({ page }) => {
    // Locate the first product card's "Add to Cart" button
    const productCard = page.locator('app-product-card').first();
    const addToCartButton = productCard.locator('button:has-text("Add to Cart"), .add-to-cart-btn');
    
    // Check current cart count in header
    const cartBadge = page.locator('app-header .cart-badge');
    let initialCount = 0;
    if (await cartBadge.isVisible()) {
      const text = await cartBadge.innerText();
      initialCount = parseInt(text) || 0;
    }

    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      
      // Verify cart count increased
      await expect(cartBadge).toHaveText((initialCount + 1).toString(), { timeout: 10000 });
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
    // This assumes items are in the cart
    await page.goto('/cart'); // Direct navigation to cart if it exists
    const cartItem = page.locator('.cart-item').first();
    
    if (await cartItem.isVisible()) {
      const plusButton = cartItem.locator('button.plus, button:has-text("+")');
      const qtyDisplay = cartItem.locator('.quantity-display, input.quantity');
      
      const prevQty = parseInt(await qtyDisplay.innerText()) || 1;
      await plusButton.click();
      
      await expect(qtyDisplay).toHaveText((prevQty + 1).toString());
    }
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart');
    const cartItem = page.locator('.cart-item').first();
    
    if (await cartItem.isVisible()) {
      const deleteButton = cartItem.locator('button.remove, button:has-text("Remove")');
      await deleteButton.click();
      
      await expect(cartItem).not.toBeVisible();
    }
  });
});
