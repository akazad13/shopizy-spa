# SVG Icon Management & Reference Guide

Shopizy uses an **SVG Sprite Sheet** approach for managing icons across the application. This method allows the browser to download and cache all icons in a single lightweight asset ([`public/icons.svg`](file:///d:/Projects/akazad13/shopizy-app/public/icons.svg)), eliminating individual HTTP requests and maintaining clean HTML templates.

---

## 📁 Key File Locations

- **Sprite Sheet File**: [`public/icons.svg`](file:///d:/Projects/akazad13/shopizy-app/public/icons.svg)
- **Reusable Component**: [`src/app/components/shared/icon/icon.component.ts`](file:///d:/Projects/akazad13/shopizy-app/src/app/components/shared/icon/icon.component.ts)
- **Component Template**: [`src/app/components/shared/icon/icon.component.html`](file:///d:/Projects/akazad13/shopizy-app/src/app/components/shared/icon/icon.component.html)

---

## 🚀 Component Usage

Use the standalone `<app-icon>` component anywhere in your Angular templates:

```html
<!-- Basic usage -->
<app-icon icon="cart" classNames="h-6 w-6 text-gray-700"></app-icon>

<!-- With hover and responsive styling -->
<app-icon icon="heart-solid" classNames="h-5 w-5 text-red-500 hover:text-red-600 transition-colors"></app-icon>

<!-- Action button with icon -->
<button class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
  <app-icon icon="shopping-bag" classNames="h-5 w-5"></app-icon>
  <span>Add to Bag</span>
</button>
```

### Component Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `icon` | `string` | `''` | **Required**. The unique ID of the icon defined in `icons.svg`. |
| `classNames` | `string` | `''` | Optional Tailwind CSS classes (sizing, colors, animations). |

---

## 📚 Icon Catalog & Reference

All icons currently available in [`public/icons.svg`](file:///d:/Projects/akazad13/shopizy-app/public/icons.svg):

### 🛍️ E-Commerce & Actions
| Icon ID | Purpose / Description |
|---|---|
| `cart` | Shopping cart / bag toggle |
| `shopping-bag` | Shopping bag outline |
| `empty-bag` | Empty cart / zero items indicator |
| `heart-solid` | Added to wishlist (filled) |
| `heart-outline` | Add to wishlist (outline) |
| `heart-outline-2` | Alternate heart outline variant |
| `review-like` | Thumbs-up / helpful review action |
| `share` | Social / product sharing |
| `truck` | Delivery / shipping indicator |
| `free-shipping` | Free shipping promotion badge |
| `authentic` | Product authenticity seal |
| `rocket` | Fast / expedited delivery badge |
| `shield-check` | Security, warranty & payment protection |

### 🧭 Navigation, Chevrons & Arrows
| Icon ID | Purpose / Description |
|---|---|
| `home` | Home navigation (outline) |
| `home-solid` | Home navigation (solid) |
| `bar-3` | Hamburger menu toggle (mobile nav) |
| `x-mark` | Close modal / dismiss drawer |
| `chevron-down` | Dropdown toggle / accordion expand |
| `chevron-right` | Breadcrumb & list forward navigation |
| `chevron-left` | Backwards pagination / drawer back |
| `arrow-right` | Direct action link arrow |
| `arrow-right-solid` | Forward step solid arrow |
| `arrow-left-solid` | Back step solid arrow |
| `back-arrow` | Back navigation |
| `forward-arrow` | Forward navigation |
| `backward-return` | Order return / reverse action |
| `greaterThan` | Breadcrumb divider |
| `backslash` | Breadcrumb separator |

### 🔍 Search, Filter & Catalog
| Icon ID | Purpose / Description |
|---|---|
| `magnifying-glass` | Search bar input icon |
| `grid` | Grid layout toggle / category display |
| `funnel` | Filter drawer / faceted search (outline) |
| `funnel-solid` | Active filters indicator (solid) |
| `sort` | Sort dropdown selector |

### ⭐ Ratings & Reviews
| Icon ID | Purpose / Description |
|---|---|
| `full-star` / `star-solid` | 5-star rating filled star |
| `half-star` | Partial / fractional rating star |
| `empty-star` / `star-outline` | Unrated / empty rating star |

### 👤 User, Security & Account
| Icon ID | Purpose / Description |
|---|---|
| `user` | User profile avatar |
| `user-circle` | User account menu avatar |
| `lock-closed` | Password input / security shield |
| `eye` | Reveal password visibility |
| `eye-slash` | Hide password visibility |
| `pencil-square` | Edit profile / address action |
| `google` | Google OAuth authentication badge |

### 📞 Contact & Communication
| Icon ID | Purpose / Description |
|---|---|
| `phone` / `phone-solid` | Customer support telephone |
| `envelope` / `envelope-solid` | Email newsletter & contact form |
| `chat-bubble-oval-left-ellipsis` | Product questions & customer live chat |
| `map-pin` | Store address / shipping destination |
| `device-phone-mobile` | Mobile app / SMS notifications |

### 🛠️ Controls & Status
| Icon ID | Purpose / Description |
|---|---|
| `plus` / `plus-circle` | Increase quantity / expand accordion |
| `minus` / `minus-circle` | Decrease quantity / collapse accordion |
| `check-solid` | Verification checkmark |
| `check-circle-solid` | Success alert & order confirmation indicator |
| `info` | Informational tooltip & alert banner |
| `calendar` | Date selector / order delivery schedule |
| `facebook` | Facebook social link |
| `github` | GitHub repository link |

---

## ➕ Adding New Icons

Follow these 3 steps to add new icons from [Heroicons](https://heroicons.com/) or another SVG repository:

### Step 1: Extract SVG Paths
Copy only the inner `<path>` element(s) and note the `viewBox` (typically `0 0 24 24` or `0 0 20 20`).

### Step 2: Append Symbol to `public/icons.svg`
Add a `<symbol>` block inside the root `<svg>` in [`public/icons.svg`](file:///d:/Projects/akazad13/shopizy-app/public/icons.svg):

```html
<symbol id="bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
</symbol>
```

### Step 3: Use in Component Template
```html
<app-icon icon="bell" classNames="h-6 w-6 text-gray-600 hover:text-indigo-600"></app-icon>
```

---

## 🎨 Best Practices

1. **Use `currentColor`**: Keep `fill="currentColor"` or `stroke="currentColor"` so icons inherit colors from Tailwind utility classes.
2. **Standardize Sizing**: Remove hardcoded `width` and `height` inside `<symbol>`. Sizing should be controlled exclusively via `classNames` on `<app-icon>` (e.g. `h-5 w-5`).
3. **Kebab-Case Naming**: Always use kebab-case identifiers for consistency (e.g., `credit-card`, `bell-alert`).
4. **Outline vs Solid Variants**: Append `-solid` or `-outline` when providing both variants for a given icon.

---

## 🔧 Troubleshooting

- **Icon appears empty/invisible?** Verify that the `id` string passed to `icon=""` matches the `<symbol id="...">` in `icons.svg` exactly (case-sensitive).
- **Icon does not change color?** Check whether the `<path>` in `icons.svg` contains hardcoded `stroke="#..."` or `fill="#..."` and change it to `currentColor`.
- **Icon distorted or clipped?** Ensure the `viewBox` attribute on the `<symbol>` matches the original icon's viewBox dimension.
