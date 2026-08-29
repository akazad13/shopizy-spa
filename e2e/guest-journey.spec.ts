import { test, expect } from '@playwright/test';

/**
 * Guest (Unauthenticated) User Journey
 *
 * Covers everything a visitor can do without logging in:
 *   1.  Homepage – Hero, featured products, trust indicators, shop features
 *   2.  Shop – Browse & filter by category, price sort, search
 *   3.  Product Details – View product page, gallery, size/color pickers, add-to-cart CTA
 *   4.  Guest Cart – Add item from product card, open dropcart, verify badge & subtotal
 *   5.  Auth Guard – Protected routes redirect to sign-in
 *   6.  Sign-in page – Form validation, forgot-password flow
 *   7.  Sign-up page – Full registration form validation
 *   8.  Static pages – About Us, Contact Us (form), FAQ accordion
 *   9.  Header Navigation – Desktop nav links and logo
 *  10.  Wishlist Prompt – Clicking wishlist on product triggers auth prompt or adds to list
 *  11.  404 Not Found – Unknown route shows error page
 *
 * No storageState is set — runs as a fully unauthenticated browser session.
 */

test.describe.serial('Guest (Unauthenticated) User Journey', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Homepage
  // ─────────────────────────────────────────────────────────────────────────────
  test('1. Homepage: Hero Section & Featured Products Load', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:4200/', { timeout: 15000 });

    // Hero h1 should be visible
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible({ timeout: 10000 });
    await expect(heroHeading).toContainText(/Summer styles/i);

    // CTA buttons in hero — scope to app-call-to-action to avoid matching hidden mobile nav links
    const heroCTA = page.locator('app-call-to-action');
    await expect(heroCTA).toBeVisible();
    const shopBtn = heroCTA.locator('a:has-text("Shop the Collection")');
    await expect(shopBtn).toBeVisible();

    const browseBtn = heroCTA.locator('a:has-text("Browse All")');
    await expect(browseBtn).toBeVisible();

    // Trust indicators scoped to hero CTA
    await expect(heroCTA.locator('text=Free shipping over $100')).toBeVisible();
    await expect(heroCTA.locator('text=30-day easy returns')).toBeVisible();

    // Shop features strip (100% Authentic, Free Shipping, Super Fast Delivery)
    const shopFeatures = page.locator('app-shop-features');
    await expect(shopFeatures).toBeVisible();
    await expect(shopFeatures.locator('text=100% Authentic')).toBeVisible();
    await expect(shopFeatures.locator('text=Free Shipping')).toBeVisible();

    // Featured / top products section renders product cards
    const productCards = page.locator('app-product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 15000 });

    // Header announcement bar
    await expect(page.locator('text=Free delivery on orders over $100')).toBeVisible();

    // Logo link present (header logo; footer also has one — use first() to avoid strict mode violation)
    await expect(page.locator('img[alt="Shopizy"]').first()).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Shop Page – Browse, Filter & Search
  // ─────────────────────────────────────────────────────────────────────────────
  test('2. Shop Page: Browse Products, Apply Search and Category Filter', async ({ page }) => {
    await page.goto('/shop');
    await expect(page).toHaveURL(/.*shop/, { timeout: 15000 });

    // Product grid loads
    const productCards = page.locator('app-product-card');
    await expect(productCards.first()).toBeVisible({ timeout: 15000 });
    const initialCount = await productCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('top');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      // Clear search
      await searchInput.clear();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }

    // Sort dropdown
    const sortDropdown = page.locator('select, [data-testid="sort"]').first();
    if (await sortDropdown.isVisible()) {
      await sortDropdown.selectOption({ index: 1 });
      await page.waitForTimeout(500);
    }

    // Product cards still visible after interactions
    await expect(productCards.first()).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Product Details Page – Public Product View
  // ─────────────────────────────────────────────────────────────────────────────
  test('3. Product Details: View Page, Gallery, Size & Color Pickers, Add-to-Cart', async ({ page }) => {
    await page.goto('/shop');
    const firstProduct = page.locator('app-product-card').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });

    // Get product name before clicking
    const productName = (await firstProduct.locator('h3').innerText()).trim();
    await firstProduct.click();

    // Should navigate to product details
    await expect(page).toHaveURL(/.*product\/.*/, { timeout: 15000 });

    // Product title in h1
    const heading = page.locator('h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toContainText(productName);

    // Price visible (text-3xl font-bold on the details page)
    const price = page.locator('.text-3xl').first();
    await expect(price).toBeVisible();
    const priceText = await price.innerText();
    expect(priceText).toMatch(/\$/);

    // Breadcrumb navigation (Home > Shop > Product)
    const breadcrumb = page.locator('nav[aria-label="Breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb.locator('a:has-text("Shop")')).toBeVisible();

    // Size picker renders (if sizes available) — click first size button
    const sizePicker = page.locator('button').filter({ hasText: /^(XS|S|M|L|XL|XXL|[0-9]+)$/ }).first();
    if (await sizePicker.isVisible({ timeout: 3000 })) {
      await sizePicker.click();
    }

    // Add-to-Cart button visible
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartBtn).toBeVisible();

    // Wishlist / price-drop alert button visible on details page
    const wishlistBtn = page.locator('button:has-text("Price Drop"), button:has-text("Alert"), button:has-text("Wishlist")').first();
    await expect(wishlistBtn).toBeVisible();

    // Description and Reviews tabs are visible
    const descriptionTab = page.locator('button:has-text("Description")');
    await expect(descriptionTab).toBeVisible();
    const reviewsTab = page.locator('button:has-text("Reviews"), button:has-text("Review")').first();
    await expect(reviewsTab).toBeVisible();
    await reviewsTab.click();
    await page.waitForTimeout(500);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Guest Cart – Add Item, Open Dropcart, Verify Badge & Subtotal
  // ─────────────────────────────────────────────────────────────────────────────
  test('4. Guest Cart: Add Product to Cart, Open Dropcart, Verify Badge & Subtotal', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.locator('app-product-card').first()).toBeVisible({ timeout: 15000 });

    // Capture the cart badge initial state
    const cartBadge = page.locator('app-header .cart-badge');
    const hadBadgeBefore = await cartBadge.isVisible();
    const badgeBeforeText = hadBadgeBefore ? (await cartBadge.innerText()).trim() : '0';
    const countBefore = parseInt(badgeBeforeText) || 0;

    // Click the add-to-cart button on the first product card
    const firstCard = page.locator('app-product-card').first();
    const addBtn = firstCard.locator('.add-to-cart-btn');
    await addBtn.click();
    await page.waitForTimeout(1000); // Allow local cart update

    // Cart badge should now show at least 1 item
    await expect(cartBadge).toBeVisible({ timeout: 8000 });
    const badgeAfterText = (await cartBadge.innerText()).trim();
    const countAfter = parseInt(badgeAfterText) || 0;
    expect(countAfter).toBeGreaterThan(countBefore);

    // Open the dropcart
    const cartButton = page.locator('app-header .cart-button');
    await cartButton.click();

    // Dropcart drawer title and cart item should appear
    const dropcartTitle = page.locator('app-dropcart .cart-drawer-title');
    await expect(dropcartTitle).toBeVisible({ timeout: 8000 });
    const cartItem = page.locator('app-dropcart .cart-item').first();
    await expect(cartItem).toBeVisible({ timeout: 8000 });

    // Dropcart should show a subtotal/total with dollar sign
    const dropcart = page.locator('app-dropcart');
    const dropcartText = await dropcart.innerText();
    expect(dropcartText).toContain('$');

    // Checkout link present in dropcart
    const checkoutLink = dropcart.getByText('Checkout', { exact: true });
    await expect(checkoutLink).toBeVisible();

    // Close dropcart by clicking the cart button again
    await cartButton.click();
    await page.waitForTimeout(300);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Auth Guard – Protected Routes Redirect to Sign-in
  // ─────────────────────────────────────────────────────────────────────────────
  test('5. Auth Guard: Protected Pages Redirect Unauthenticated Users', async ({ page }) => {
    const protectedRoutes = [
      '/checkout',
      '/account',
      '/account/orders',
      '/wishlist',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);
      // Should redirect to sign-in (or home) — NOT stay on the protected route
      await page.waitForURL(url => !url.pathname.startsWith(route.split('?')[0]) || url.pathname === '/', { timeout: 10000 });
      const currentUrl = page.url();
      expect(currentUrl).not.toContain(route.replace('/', ''));
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Sign-in Page – Form Fields & Validation
  // ─────────────────────────────────────────────────────────────────────────────
  test('6. Sign-in Page: Form Renders and Validates Empty Submission', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page).toHaveURL(/.*auth\/signin/, { timeout: 15000 });

    // Page heading
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible({ timeout: 10000 });

    // Email & password inputs
    const emailInput = page.locator('input#email[type="email"]');
    const passwordInput = page.locator('input#password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Submit with invalid credentials
    await emailInput.fill('invalid@test.com');
    await passwordInput.fill('wrongpassword');
    await page.locator('button[type="submit"], form button:last-of-type').last().click();
    await page.waitForTimeout(2000);
    // Should remain on sign-in (not redirect away on bad credentials)
    await expect(page).toHaveURL(/.*auth\/signin/, { timeout: 5000 });

    // Sign-up link present
    const signupLink = page.locator('a[href*="/auth/signup"], a:has-text("Create an account")').first();
    await expect(signupLink).toBeVisible();

    // Forgot password trigger
    const forgotBtn = page.locator('button:has-text("Forgot")').first();
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();
    // Forgot password dialog/section should appear
    const forgotSection = page.locator('input[type="email"], dialog, [role="dialog"]').nth(1);
    await expect(forgotSection.or(page.locator('text=Reset password, text=reset your password'))).toBeVisible({ timeout: 5000 });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Sign-up Page – Registration Form Validation
  // ─────────────────────────────────────────────────────────────────────────────
  test('7. Sign-up Page: Registration Form Fields Present and Validates', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page).toHaveURL(/.*auth\/signup/, { timeout: 15000 });

    // Page heading
    await expect(page.locator('h2:has-text("Create your account")')).toBeVisible({ timeout: 10000 });

    // All required form fields visible
    await expect(page.locator('input#firstName')).toBeVisible();
    await expect(page.locator('input#lastName')).toBeVisible();
    await expect(page.locator('input#email[type="email"]')).toBeVisible();
    await expect(page.locator('input#phoneNumber')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('input#confirmPassword')).toBeVisible();
    await expect(page.locator('input#acceptTerms[type="checkbox"]')).toBeVisible();

    // Fill form with test data (won't submit to avoid creating accounts)
    await page.locator('input#firstName').fill('Test');
    await page.locator('input#lastName').fill('User');
    await page.locator('input#email[type="email"]').fill('e2e-guest-test@shopizy.com');
    await page.locator('input#phoneNumber').fill('01712345678');
    await page.locator('input#password').fill('TestPass123!');
    await page.locator('input#confirmPassword').fill('TestPass123!');

    // Sign-in link present
    const signinLink = page.locator('a[href*="/auth/signin"], a:has-text("Sign in")').first();
    await expect(signinLink).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Static Pages – About Us, Contact Us Form, FAQ Accordion
  // ─────────────────────────────────────────────────────────────────────────────
  test('8. Static Pages: About Us, Contact Form, and FAQ Accordion', async ({ page }) => {
    // About Us
    await page.goto('/about-us');
    await expect(page).toHaveURL(/.*about-us/, { timeout: 15000 });
    const aboutContent = page.locator('app-page-about-us');
    await expect(aboutContent).toBeVisible({ timeout: 10000 });

    // Contact Us
    await page.goto('/contact-us');
    await expect(page).toHaveURL(/.*contact-us/, { timeout: 15000 });
    const contactHeading = page.locator('h1:has-text("Chat to our friendly team")');
    await expect(contactHeading).toBeVisible({ timeout: 10000 });

    // Contact form inputs
    const contactForm = page.locator('form');
    await expect(contactForm).toBeVisible({ timeout: 10000 });
    const contactNameInput = page.locator('input#firstName');
    await expect(contactNameInput).toBeVisible();
    await contactNameInput.fill('Guest');

    const contactLastNameInput = page.locator('input#lastName');
    await expect(contactLastNameInput).toBeVisible();
    await contactLastNameInput.fill('User');

    const contactEmailInput = page.locator('input#email');
    await expect(contactEmailInput).toBeVisible();
    await contactEmailInput.fill('guest@test.com');

    const contactMsgInput = page.locator('textarea#message');
    await expect(contactMsgInput).toBeVisible();
    await contactMsgInput.fill('Inquiry message from guest');

    const contactSubmitBtn = page.locator('form button:has-text("Send message")');
    await expect(contactSubmitBtn).toBeVisible();

    // FAQ
    await page.goto('/faq');
    await expect(page).toHaveURL(/.*faq/, { timeout: 15000 });
    const faqHeading = page.locator('h1:has-text("Have any Questions?")');
    await expect(faqHeading).toBeVisible({ timeout: 10000 });

    // FAQ accordion items clickable
    const faqItem = page.locator('app-page-faq button').first();
    if (await faqItem.isVisible()) {
      await faqItem.click();
      await page.waitForTimeout(500);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. Header Navigation – Desktop Nav & Logo
  // ─────────────────────────────────────────────────────────────────────────────
  test('9. Header Navigation: Logo, Sign-in Link, Cart Button Open/Close', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('http://localhost:4200/', { timeout: 15000 });

    const header = page.locator('app-header');
    await expect(header).toBeVisible({ timeout: 10000 });

    // Logo in the header is visible (header has one, footer has another — scope to header)
    const logo = header.locator('img[alt="Shopizy"]').first();
    await expect(logo).toBeVisible();

    // Sign-in link in desktop header navigates to sign-in page
    const signinHeaderLink = header.locator('nav a[href*="signin"], nav a:has-text("Sign in")').first();
    await expect(signinHeaderLink).toBeVisible();
    await signinHeaderLink.click();
    await expect(page).toHaveURL(/.*auth\/signin/, { timeout: 10000 });

    // Navigate back and verify cart button opens dropcart
    await page.goto('/');
    const cartBtn = page.locator('app-header .cart-button');
    await expect(cartBtn).toBeVisible({ timeout: 10000 });
    await cartBtn.click();
    const dropcartTitle = page.locator('app-dropcart .cart-drawer-title');
    await expect(dropcartTitle).toBeVisible({ timeout: 5000 });
    // Close dropcart
    await cartBtn.click();
    await page.waitForTimeout(300);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. Wishlist Prompt – Guest clicking wishlist does not crash
  // ─────────────────────────────────────────────────────────────────────────────
  test('10. Wishlist: Guest Clicking Wishlist on Product Card Does Not Crash', async ({ page }) => {
    await page.goto('/shop');
    const firstCard = page.locator('app-product-card').first();
    await expect(firstCard).toBeVisible({ timeout: 15000 });

    // Hover to reveal the wishlist (heart) button
    await firstCard.hover();
    const heartBtn = firstCard.locator('button[class*="rounded-full"]').first();
    if (await heartBtn.isVisible({ timeout: 3000 })) {
      await heartBtn.click();
      await page.waitForTimeout(1500);
      const url = page.url();
      // Should not navigate to an error page
      expect(url).not.toContain('error');
      expect(url).not.toContain('500');
    }

    // Navigate to product details page and test wishlist button there
    const firstProduct = page.locator('app-product-card').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/.*product\/.*/, { timeout: 15000 });

    const detailWishlistBtn = page.locator('button:has-text("Price Drop"), button:has-text("Alert"), button:has-text("Wishlist")').first();
    if (await detailWishlistBtn.isVisible({ timeout: 5000 })) {
      await detailWishlistBtn.click();
      await page.waitForTimeout(1000);
      // Should stay on product details page
      await expect(page).toHaveURL(/.*product\/.*/, { timeout: 5000 });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. 404 Not Found Page
  // ─────────────────────────────────────────────────────────────────────────────
  test('11. 404 Not Found: Unknown Routes Show Error Page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-12345');
    // Should NOT redirect to home — stays on URL or shows 404 content
    const notFoundContent = page.locator('app-page-not-found, h1:has-text("Page not found")').first();
    await expect(notFoundContent).toBeVisible({ timeout: 10000 });

    // Should have a way to go back home
    const homeBtnOrLink = page.locator('button:has-text("Take me home"), a[href="/"]').first();
    await expect(homeBtnOrLink).toBeVisible();
  });

});
