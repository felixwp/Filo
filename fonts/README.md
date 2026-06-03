# Fonts

Filo uses a **single typeface: Instrument Sans**, at two weights — Regular (400) and Bold (700). (The CSS also loads 500/600 for fine UI control.)

## Loading

Instrument Sans is available on **Google Fonts**, so no static font binaries are committed here. It is loaded via the `@import` at the top of `../colors_and_type.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');
```

Or add to your `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Note on substitution

No `.woff2`/`.ttf` files were provided in the brand package, and font binaries can't be fetched into this project automatically. **Instrument Sans is the genuine brand face** (not a substitute) — it just loads from Google Fonts rather than from committed files. If you need offline/self-hosted copies, download the family from Google Fonts and drop the `.woff2` files in this folder, then swap the `@import` for a local `@font-face`.

## Usage rules

- **Wordmark "FILO":** Bold, uppercase, letter-spacing `0.10em`, short green underline under "FIL". Logotype only.
- **Headings:** Bold (700).
- **Body / labels:** Regular (400); secondary info at ~80% cream opacity.
- Never below 12px in UI.
