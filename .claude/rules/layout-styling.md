# Layout & styling intent

This project is a POC. Layout and visual styling **must stay easy to change**. Follow these rules whenever you add or modify UI.

## Visual language

The app follows a clean light admin-dashboard aesthetic inspired by "Able Pro":

- **Light theme.** Soft cool-tinted off-white body (`bg-bg`); pure white card surfaces (`bg-surface`); thin 1px borders (`border-border`); **no heavy shadows** — rely on the border alone.
- **Brand colour** is a vibrant indigo blue (`primary`). Use the soft tint (`primary-soft`) for subtle highlights such as the active sidebar pill.
- **Sidebar is light** (white background, dark text). The active item is a `primary-soft` pill with `primary` text and a small leading dot. Section labels above nav groups are tiny uppercase muted text.
- **Cards are rounded-xl** with a 1px border and no shadow. Stat cards have a small pastel-bg `rounded-md` icon tile in the top-left, a muted label, a large bold value, an optional %-delta with arrow, and an optional sparkline mini-chart.
- **Header** is white with a 1px bottom border, contains a search field and round-square icon buttons (notifications, language, profile, etc.) with hover surface tint.
- **Typography**: `font-sans` with `text-fg` for primary copy and `text-muted` for labels/captions; small uppercase `text-sidebar-section` for sidebar group headings.
- **Spacing**: generous (`p-6` page padding, `gap-4`/`gap-6` between cards). Don't crowd.

## Rules

### 1. Single source of design tokens

All colours, spacing, radii, font sizes, and layout dimensions (sidebar width, header height, etc.) live in **one place**:

```
app/src/styles/tokens.css
```

Tokens are declared in `@theme` and exposed to Tailwind so utilities like `bg-surface`, `text-muted`, `w-sidebar`, `h-header`, `bg-tile-blue` resolve to them. To rebrand or restyle, **edit only this file** — never hard-code colours or sizes in components.

If a value is used more than once, promote it to a token. Never reach for an arbitrary value (`bg-[#1f2937]`, `w-[260px]`) — add a token instead.

### 2. Layout primitives are isolated

The admin chrome lives in three small, replaceable components:

```
app/src/components/layout/
├── AdminLayout.tsx   composition: <Sidebar /> + <Header /> + <Outlet />
├── Sidebar.tsx       left navigation (light, with section labels and active pill)
└── Header.tsx        top bar with search, icon buttons, language selector
```

Each component is self-contained: no layout-specific styles leak into pages. A page (e.g. `dashboard.tsx`) renders content only — never sets margins, paddings, or widths that assume a particular chrome.

To swap the chrome (e.g. move nav to the top, add a right rail), you should be able to rewrite `AdminLayout.tsx` without touching any page.

### 3. Card pattern

Use `rounded-xl border bg-surface p-4` (or `p-5` / `p-6` for large cards). Do not add shadows.

For stat cards, follow this anatomy:

```
[icon-tile]   [label]
              [big number]   [delta arrow + %]
              [optional sparkline]
```

The icon tile is a `h-10 w-10 rounded-md flex items-center justify-center bg-tile-{colour} text-tile-{colour}-fg`. Pick a tile colour per stat from the palette in `tokens.css`.

### 4. Use Tailwind utilities + tokens, not custom CSS

- Prefer Tailwind utility classes resolved through tokens.
- Use `clsx` / `tailwind-merge` for conditional classes — do not concatenate strings manually.
- Custom CSS goes in `tokens.css` / `app.css` only when no utility expresses it. Keep it minimal.

### 5. No inline magic numbers

Spacing, sizing, and colour values come from the token scale.

- ✅ `class="w-sidebar h-screen bg-surface"`
- ❌ `style={{ width: 260 }}` or `class="w-[260px] bg-[#0f172a]"`

### 6. Translate every user-facing string

If a page or component renders text the user reads, that string must come through Tolgee (`useTranslate()` or `<T keyName="...">`). Add the key to both `en.json` and `de.json`. Never inline raw English copy in JSX.

### 7. Icons

Use [`lucide-react`](https://lucide.dev) for all iconography. Keep icon sizes consistent (16/18/20). Do not mix icon libraries.

### 8. When uncertain

If you need to introduce a new layout concept (modal shell, drawer, secondary nav), first add the relevant tokens, then a new component under `components/layout/`. Update this rule file with the new primitive.
