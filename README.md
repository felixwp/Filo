# Filo — Design System

**Tagline:** *A good shift.*
**Design movement:** Obsidian Service — confident darkness pierced by moments of deliberate colour.

Filo is an all-in-one hospitality management platform built to replace the patchwork of POS, rostering, and messaging tools most venues stitch together. It is built for staff on the floor, owners in the back, and the kind of venues where the details matter. Premium but hardworking — it should feel like it belongs in a good restaurant, not a tech startup.

This repository is the canonical design system: brand assets, colour and type foundations, content guidelines, visual foundations, and high-fidelity UI kits that recreate the product surfaces.

---

## Product context

Filo has **three product pillars**, all sharing one visual language:

1. **Venue iPad / POS** *(primary, prototyped)* — the till and service layer. Floor plan & table management, course-by-course ordering, course-away reminders, food/wine pairing suggestions, customer preferences & birthdays, kitchen docket printing, bar tabs, QR ordering, split payments, happy-hour pricing, live sales dashboard, in-app staff guide. **Designed at 1194×834pt (iPad, landscape).**
2. **Staff personal devices** *(spec'd, next)* — rostering, payslips & timesheets, direct messaging, section group chats, whole-venue chat. **iPhone, portrait.**
3. **Owner / manager backroom** *(spec'd, next)* — AI-suggested supplier orders, low-stock alerts, automatic tip calculation, trend forecasting, live sales dashboard. **iPad or desktop, can take more density.**

Only the **POS** has been built to date (Base44 prototype). The staff app and owner backroom are documented in spec but not yet prototyped.

### Sources provided
These were the inputs for this system. Re-attach them if you need to extend the work.
- `uploads/filo-project.md` — master project reference (palette, type rules, full component spec, roadmap).
- `uploads/filo-design-philosophy.md` — the "Obsidian Service" design philosophy essay.
- `uploads/filo-brand-identity.png` — brand identity sheet (mark, wordmark, palette, type, mark-at-scale).
- **Base44 POS prototype:** `https://app.base44.com/apps/6a1ec85e6f6e5bbb6a4950ef/editor/preview` *(login-gated — not directly accessible to this system; rebuilt from the written component spec).*
- **Notion workspace:** `https://www.notion.so/373d50c9c84b8165858ae146befccfea` *(login-gated).*

> Note: the working prototype and Notion are behind logins, so the UI kits here were reconstructed from the **detailed written component spec** in `filo-project.md` rather than from source code. They are faithful to that spec; cross-check against the live prototype when one becomes accessible.

---

## Content fundamentals

How Filo writes. The voice mirrors the design philosophy: precise, calm, confident, never shouting.

- **Sentence case, always.** Never all-caps shouting in prose. (The wordmark "FILO" and small pill badges are the only uppercase exceptions.)
- **Spare and declarative.** Short phrases over sentences. A label, a name, a number. "Nothing explains. Nothing describes." Don't pad UI with helper text.
- **Voice:** addresses the user as **you** when guidance is needed; otherwise stays out of the way. Plain, grounded, hospitality-literate. Uses the language of the floor — *covers, turn time, course away, the pass, on the section, a good shift* — not SaaS jargon.
- **Tone:** quietly assured. The product behaves like an experienced colleague: it tells you what you need, when you need it, and then disappears. Calm under pressure.
- **No exclamation marks** in the interface. Confidence doesn't shout.
- **Numbers carry weight.** Prices, covers, times, earnings are stated plainly and given visual prominence (often in gold) rather than described.
- **British English** spelling and conventions (*colour, customise, optimise*). Currency is shown in Australian dollars ($); times in 24h or local format.
- **Emoji:** never. Not in UI, not in marketing. The brand expresses warmth through colour and craft, not emoji.

**Examples (in-voice):**
- Tagline: *"A good shift."*
- Empty floor: *"No open tables. Quiet before service."*
- Course sent confirmation: *(no banner — the button pulses green for one second)*
- Birthday flag: *"Birthday — table 12"*
- Dashboard figure label: *"Covers tonight"* · *"Average spend"* · *"Tips pooled"*
- Button verbs: *Send course · Print docket · Settle · Open tab · Add to order*

**Out of voice (avoid):** *"Oops! Something went wrong 😬"*, *"Awesome! Your order is on its way!!"*, *"Supercharge your venue with powerful tools."*

---

## Visual foundations

The complete answer to "what does Filo look and feel like."

### Colour
A **system, not a palette.** A deep near-black ground anchors everything; racing green is the primary, confident signal; gold appears rarely and deliberately for moments that carry weight; warm cream is the voice of all text.
- `#0A0A0A` **Base** — page/app background **only**. Never a card or panel fill.
- `#1C1C1C` **Surface** — every card, panel, table tile, modal. The main surface.
- `#0D4A28` **Racing green** — primary CTAs, active/selected states, the brand signature. Used confidently, never decoratively.
- `#C9921E` **Gold** — revenue, tips, earnings, birthday flags, premium moments. Sparing; it carries weight when it appears.
- `#F5EFE4` **Warm cream** — all primary text, headings, key numbers. **Never pure white.** Always warm, "as if held for a moment in a hand."
- **Never** pure black `#000000`, never pure white, never generic SaaS blue/grey accents.

### Typography
**One typeface, two weights.** Instrument Sans, Regular (400) and Bold (700) does the work of many. Type is treated as a visual element first — letterforms as architecture, placed with care.
- **Wordmark:** Instrument Sans Bold, uppercase, tracked +0.10em, with a short green underline beneath "FIL". Used for the logotype only — never body.
- **Headings:** 20–24px Bold, full cream.
- **Body / labels:** 14–16px Regular; secondary info at ~80% cream opacity.
- **Numbers:** 18–22px, prominent, full cream (gold when they're money).
- **Pill badges:** 11–12px Bold uppercase, tracked.
- Never below 12px in UI.

### Backgrounds
Flat, deep, and quiet. **No gradients as decoration, no photography behind UI, no patterns or textures, no illustration washes.** The near-black ground is the canvas; negative space is "load-bearing." The only "gradient" permitted is the subtle blur/translucency of glass overlays. Marketing surfaces may use a single full-bleed flat colour field (black, green, or cream) with the mark — never busy imagery.

### Spacing & layout
- Base unit **8px**. Padding 16 / 20 / 24px. Section gaps 24–32px. Grid card gaps 12px.
- **Minimum tap target 48×48px** — built for busy hands in dim light.
- Compositions breathe like a well-planned floor: nothing cramped, nothing wasted. Distance implies hierarchy; proximity implies relationship.
- Persistent **back/home control top-left** on every non-home screen. Icon nav bar for primary surfaces.
- One **primary action per screen** (green), one or two secondary (outlined/muted).

### Corner radii
Slightly rounded, never pill-soft for containers: buttons **10px**, cards/panels **12–14px**, table tiles **16px**. Only badges and toggles go fully round (`999px`). Rounding is what keeps the dark palette warm rather than sterile.

### Cards & surfaces
- Fill `#1C1C1C`. Border a single hairline: `0.5px rgba(245,239,228,0.12)` (cream) or `rgba(13,74,40,0.3)` (green-tinted for accent).
- Soft, deep shadows (`0 4px 16px rgba(0,0,0,0.45)`) — never harsh or coloured drop shadows. Elevation reads through subtle shadow + the lighter surface tone, not heavy outlines.

### Borders
Hairlines do the structural work. Default `0.5–1px` cream at 12%. Secondary buttons use cream at 30%. Accent/modal edges use green at 40%. Status on table tiles is a **coloured border glow, not a fill.**

### Transparency & blur
Reserved for **modals and overlays** (glassmorphism): semi-transparent dark fill (`rgba(16,16,16,0.72)`) + `~18px` backdrop blur + green-tinted 1px border. Never full black — always translucent so the service context stays visible beneath. Don't use blur decoratively elsewhere.

### Status colour language
- **Occupied** — green glow border.
- **Ordering / in progress** — amber.
- **Awaiting payment** — gold.
- **Available** — faint cream border only, no fill.

### Imagery vibe
Filo is largely image-free in-product. Where imagery appears (marketing), it is warm, low-light, candlelit — the world of a good venue before service: cast iron, lacquered bar tops, the pass at midnight. Never bright stock photography, never cool/clinical tones, never people-in-headsets SaaS imagery.

### Motion
Purposeful, brief, **never looping or distracting.**
- Screen transitions: slide or fade, **200–250ms**, `ease-out`.
- Button press: **scale 0.97, 100ms** ease-out (a physical "give").
- Course sent: the button itself **pulses green for ~1 second**, then returns — no banner.
- Print: printer icon flashes briefly (~1s).
- Birthday reveal: gold dot pulses once on floor-plan load.
- KDS item ready: subtle green flash on the table tile.
- Toasts (when unavoidable): auto-dismiss ≤2s, no manual close. Prefer button-level animation over floating banners.

### Hover / press states
- **Hover:** lift one surface step (`#1C1C1C → #262626`) or brighten green (`#0D4A28 → #14633A`); never opacity-fade the whole element.
- **Press:** `scale(0.97)` + deepen colour (green → `#0A3A1F`).
- **Active/selected:** green fill or green-glow border.
- **Disabled:** cream foreground drops to ~38%.

---

## Iconography

See the **ICONOGRAPHY** section below.

---

## Iconography (detail)

- **System:** Filo uses **Lucide** (lucide.dev) — clean, geometric, ~1.75–2px stroke, rounded line caps. This matches the brand's "geometric but not cold" letterforms exactly: precise lines, rounded terminals, no fills. *No bespoke icon font ships with the prototype, so Lucide is the documented standard and is loaded from CDN in the UI kits.* If the live prototype later reveals a custom set, replace this.
- **Weight & size:** stroke `1.75–2px`; nav and action icons `22–24px`; inline/label icons `18–20px`. Never below 16px in UI.
- **Colour:** icons inherit cream (`--fg-1/2`); active nav icons fill or stroke **racing green**; never multi-colour icons.
- **Domain glyphs** in use: floor plan / grid, kitchen display (monitor/flame), guide (book-open), dashboard (bar-chart / line-chart), settings (sliders/cog), back/home (chevron-left / home), course/plate (utensils), wine (wine), reminder (bell/clock), birthday (gift / cake), printer, split (split), card (credit-card), QR (qr-code), message (message-circle), roster (calendar), payslip (receipt / banknote).
- **Emoji:** never used as icons.
- **Unicode chars** are used only as the dietary tags baked into menu data — **V, VG, GF, DF** rendered as tracked text pills, not icons.
- The **Filo mark** (geometric "F" in a circle) is the only brand glyph; it doubles as the 32px app icon. Mark SVGs live in `assets/`.

---

## Index — what's in this system

### Root
| File | What it is |
|---|---|
| `README.md` | This document. |
| `colors_and_type.css` | All colour + type tokens as CSS variables (raw palette, ramp, semantic fg, borders, spacing, radii, shadows, glass, motion). Import this first. |
| `SKILL.md` | Agent-Skill manifest so this system can be used inside Claude Code. |

### `assets/`
Brand marks (SVG): `filo-mark-green.svg` (primary), `filo-mark-cream.svg` (dark-on-light), `filo-mark-mono-cream.svg` (cream-on-dark), plus `filo-symbol-green.svg` (a *symbol exploration* — layered arcs, to be workshopped; the "F" mark remains official). The full lockup with wordmark + tagline is composed in HTML using Instrument Sans (see UI kits / preview cards).

### `fonts/`
Type loading notes. Instrument Sans is served from Google Fonts (no static binaries committed) — see `fonts/README.md`.

### `preview/`
Small HTML cards powering the **Design System tab** — colour swatches, type specimens, spacing/radii/elevation tokens, component states, logo lockups.

### `ui_kits/`
High-fidelity, interactive recreations of the product surfaces. Each kit has its own `README.md`, an `index.html` demo, and modular JSX components.
- `ui_kits/pos/` — **Venue iPad / POS** (primary): floor plan, table order, KDS, dashboard, payment.

> Staff-app and owner-backroom kits are not built yet (those products are spec-only). The visual language and components in the POS kit transfer directly when they are.

---

*Filo is Felix Plowman's project. Confidential — do not share, publish, or distribute without explicit permission.*
