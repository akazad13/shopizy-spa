# SVG Icon Management Guide

This project uses an SVG sprite sheet approach for managing icons. This method is highly efficient as it allows the browser to cache all icons in a single file (`icons.svg`), reducing HTTP requests and keeping the HTML clean.

## 📁 File Locations

- **Sprite Sheet**: `public/icons.svg`
- **Icon Component**: `src/app/components/shared/icon/icon.component.ts`

---

## ➕ How to Add a New Icon

To add a new icon, follow these steps:

### 1. Obtain the SVG Code
Find the SVG you want to add (e.g., from [Heroicons](https://heroicons.com/)). You only need the inner elements (usually `<path>`) and the `viewBox` attribute.

### 2. Add to `icons.svg`
Open `public/icons.svg` and add a new `<symbol>` element inside the root `<svg>` tag.

**Structure:**
```html
<symbol id="your-icon-name" viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <!-- Paste the path(s) here -->
  <path d="..." stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
</symbol>
```

**Key Attributes:**
- `id`: The unique name you will use to reference this icon.
- `viewBox`: Must match the original SVG's viewBox (usually `0 0 24 24` or `0 0 20 20`).
- `fill`/`stroke`: Set to `currentColor` to allow styling via Tailwind CSS classes (e.g., `text-indigo-600`).

### 3. Usage in Components
Once added to the sprite sheet, you can use the icon anywhere in your templates using the `<app-icon>` component.

**Example:**
```html
<app-icon icon="your-icon-name" classNames="h-6 w-6 text-gray-500 hover:text-indigo-600"></app-icon>
```

---

## 🎨 Best Practices

1. **Use `currentColor`**: Always ensure your symbols use `fill="currentColor"` or `stroke="currentColor"`. This makes the icons dynamic and themeable.
2. **Consistent Names**: Use kebab-case for IDs (e.g., `shopping-cart`, `user-circle-solid`).
3. **Solid vs Outline**: If you have both versions, suffix them accordingly: `heart-outline` and `heart-solid`.
4. **Clean SVGs**: Remove any hardcoded `width`, `height`, or `class` attributes from the paths inside the `<symbol>`. The size should be controlled by the `classNames` input on the component.

---

## 🛠️ Troubleshooting

- **Icon not showing?** Check if the `id` in `icons.svg` exactly matches the `icon` input in your component.
- **Wrong size?** Ensure the `viewBox` on the `<symbol>` matches the original SVG's proportions.
- **Color not changing?** Make sure the paths inside the symbol don't have hardcoded `fill` or `stroke` colors. Replace them with `currentColor`.
