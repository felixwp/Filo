# Filo — Project Document
*Last updated: June 2026*

---

## The concept

Filo is an all-in-one hospitality management platform built to replace the patchwork of software most venues currently stitch together. The name is short, clean, and has a quiet nod to hospitality. The tagline is **"A good shift."**

The product has three pillars:

**1. Venue iPads / POS** — The till and service layer. Table management, order taking by course, course-away reminders, wine and food pairing suggestions, customer preferences and birthdays from previous bookings, kitchen docket printing, bar tabs, QR ordering, and in-app tutorials for staff.

**2. Staff personal devices** — Rostering, payslips and timesheets, direct messaging between individuals, section group chats, and whole-venue group chat.

**3. Owner / manager backroom** — Supplier ordering with AI-suggested weekly orders, low stock notifications, automatic tip calculations by hours worked, trend forecasting and weekly insights, live sales dashboard, personal calendar integration.

---

## Prototype

**Base44 working prototype (POS):**
[Open in Base44 Editor](https://app.base44.com/apps/6a1ec85e6f6e5bbb6a4950ef/editor/preview)

**Notion workspace:**
[Open Filo in Notion](https://www.notion.so/373d50c9c84b8165858ae146befccfea)

The current prototype covers the venue POS / till. Staff app and owner backroom are next.

---

## What's been built (POS prototype)

- Staff login with profile and role selection
- Visual floor plan with draggable table tiles, status indicators, table turn time, and birthday flags
- Table order view with multi-course ordering (Course 1, 2, 3... sent independently)
- Menu browsing by category with dietary tags (V, VG, GF, DF)
- Bidirectional food and drink pairing suggestions (select a wine → food suggestions; select a dish → wine/cocktail suggestions)
- Course-away reminders in a dedicated sidebar column (food and drink timing tracked separately)
- Kitchen Display System (KDS) view — orders by table with ready-marking and wait time indicators
- Auto-print kitchen docket when each course is sent
- Print receipt and docket buttons throughout
- Bar tabs with card pre-authorisation
- Split payment (cash + card with custom amounts), tip selection
- Bill view with itemised breakdown and even/item split
- Happy hour pricing (time-based, configured by owner — auto-applies to eligible items)
- Section-based staff view (own tables shown first, others accessible)
- Customer notes per table (dietary requirements, preferences, birthdays)
- Live sales dashboard (revenue, covers, average spend, top items)
- QR code ordering (prototype — generates QR per table, orders tagged on POS)
- In-app guide: cocktail recipes, service flow, processing tabs
- Float reference on login screen (denomination breakdown, configurable by owner)
- Full settings page: venue details, menu management, staff management, colour customisation, happy hour times, tip settings, float amount
- Glassmorphism overlays, status pill badges, micro-interactions throughout
- Satisfying 1-second animation on send/print actions (no persistent pop-ups)
- Back/home button on every screen

---

## Brand identity

### Palette

| Role | Name | Hex |
|---|---|---|
| Base | Near-black | `#0A0A0A` |
| Surface | Dark surface | `#1C1C1C` |
| Primary accent | Racing green | `#0D4A28` |
| Secondary accent | Gold | `#C9921E` |
| Light surface | Warm cream | `#F5EFE4` |

### Typography

| Role | Typeface | Weight |
|---|---|---|
| Wordmark & display | Instrument Sans | Bold |
| All UI — labels, body, buttons, headings | Instrument Sans | Regular / Bold |

### Design philosophy

The Filo design movement is called **Obsidian Service**. Full philosophy saved in `filo-design-philosophy.md`.

The short version: confident darkness pierced by moments of deliberate colour. Premium but hardworking. Feels like it belongs in a good venue — not a tech startup. Every element earns its place.

### Logomark

A racing green circle containing a geometric white/cream "F" (stem + full top bar + shorter mid bar). Scales cleanly from large marketing use down to 32px app icon. Gold dot accent beside the mark in primary lockup.

Brand identity sheet saved in `filo-brand-identity.png`.

---

## Competitors researched

| Product | Strength | Gap Filo fills |
|---|---|---|
| Square for Restaurants | Clean UI, free entry tier, bar tabs | No wine/food pairing, no course-level sending |
| Lightspeed Restaurant | 40+ integrations, offline mode, fast | Complex, expensive, generic feel |
| Abacus (AU) | Hospitality-focused, clean, local | Limited staff-facing features, no pairing |
| SevenRooms | Premium bookings and CRM | Not a POS — no service-layer tools |
| Deputy | Strong rostering | No POS, no table management |

---

## Design system — instructions for Claude

> Use this section whenever designing any part of the Filo app, website, marketing, or documents. These are standing instructions.

### Core principles

1. **Functional and pretty.** Every design decision must earn its place by being both useful and visually considered. Nothing decorative for decoration's sake, nothing functional that ignores how it looks.
2. **Premium, not cold.** The dark palette could easily feel sterile. Counter it with warm cream text, green accents, generous spacing, and slightly rounded corners. It should feel like a high-end restaurant, not a server room.
3. **Hospitality-first.** The people using this are in the middle of a service — stressed, fast-moving, working in dim light. Design for clarity under pressure. Large tap targets, strong contrast, zero ambiguity.
4. **Consistent hierarchy.** Every screen has one primary action (green button), one or two secondary actions (outlined or muted), and information arranged by importance top-to-bottom.

### Colours — usage rules

- `#0A0A0A` — Page/app background only. Never use as a card or panel fill.
- `#1C1C1C` — Cards, panels, table tiles, modals. The main surface colour.
- `#0D4A28` (Racing green) — Primary CTA buttons, active/selected states, the brand's signature. Used confidently, not sparingly, but never decoratively.
- `#C9921E` (Gold) — Revenue figures, tip amounts, earnings, birthday flags, premium moments. Use sparingly — it carries weight when it appears.
- `#F5EFE4` (Warm cream) — Primary text, headings, key numbers. Never use pure white — always this warm cream.
- Status colours: occupied = green glow, ordering = amber, awaiting payment = gold, available = faint border only.

### Typography rules

- **Wordmark only:** Instrument Sans Bold, tracked (letter-spacing +2 to +4). Used for the "Filo" logotype only — never body copy.
- **Everything else:** Instrument Sans. Regular for body and labels, Bold for headings and primary actions.
- Heading size: 20–24px, Bold, cream `#F5EFE4`
- Body/label size: 14–16px, Regular, cream at 80% opacity for secondary info
- Numbers (prices, times, covers): 18–22px, Bold or Regular, full cream
- Status labels: 11–12px, Bold, uppercase, in pill badges
- Never use pure white. Never use font sizes below 12px in UI.

### Component patterns

**Table tiles (floor plan)**
- Background: `#1C1C1C`
- Border radius: 16px
- Status indicated by a coloured border glow (not fill)
- Table number: 20px Bold cream, centred top
- Cover count: 14px Regular, muted cream
- Turn time: 12px, muted, bottom-right
- Status pill: 11px uppercase, coloured badge bottom-left
- Birthday flag: small gold dot, top-right corner

**Buttons**
- Primary: Racing green fill `#0D4A28`, cream text, 10px radius, min 48px height
- Secondary: 1px cream border at 30% opacity, transparent fill, cream text
- Destructive: muted red border, no fill
- All buttons: scale-down micro-animation on press (transform: scale 0.97), 100ms

**Cards and panels**
- Background: `#1C1C1C`
- Border: 0.5px, `rgba(245,239,228,0.12)` (subtle cream) or `rgba(13,74,40,0.3)` (subtle green)
- Border radius: 12–16px
- Padding: 16–20px

**Modals and overlays**
- Glassmorphism: semi-transparent dark background with subtle blur
- Border: 1px `rgba(13,74,40,0.4)` (green-tinted)
- Never full black — always semi-transparent so context is visible beneath

**Navigation**
- Persistent back/home button top-left on every non-home screen
- Icon-based nav bar (floor plan, KDS, guide, dashboard, settings)
- Active nav item: green fill icon
- Inactive: cream at 40% opacity

**Reminders sidebar**
- Narrow column, right side of floor plan
- Small cards, 12px text, muted
- Clickable — always navigates to that table's order
- Food and drink reminders tracked separately, different icons

**Print / send actions**
- 1-second green pulse animation on the button itself
- No pop-up banners required
- Kitchen docket auto-fires when course is sent

**Pop-ups and toasts**
- Auto-dismiss after 2 seconds maximum
- No manual dismissal required
- Prefer button-level animations over floating banners where possible

### Spacing system

- Base unit: 8px
- Component padding: 16px (small), 20px (medium), 24px (large)
- Section gaps: 24–32px
- Card gaps in grids: 12px
- Minimum tap target: 48×48px (iPad, finger use in service)

### Interaction and animation

- Screen transitions: smooth slide or fade, 200–250ms
- Button press: scale 0.97, 100ms ease-out
- Course sent: green pulse on button, 1 second, then return to normal
- Print triggered: printer icon flashes briefly, 1 second
- Birthday reveal: gold dot pulses once on floor plan load
- KDS item ready: subtle green flash on the table tile in floor plan
- All animations: purposeful, brief, never looping or distracting

### Device targets

| Surface | Device | Orientation | Notes |
|---|---|---|---|
| POS / venue iPad | iPad 10.9" or 12.9" | Landscape | Primary design surface. Large tap targets essential. |
| Staff personal app | iPhone (any modern size) | Portrait | Rostering, messaging, payslips. Thumb-zone aware. |
| Owner backroom | iPad or desktop browser | Both | Less time-pressure. Can accommodate more density. |
| KDS (kitchen display) | iPad or Android tablet | Landscape | Visibility from distance. Larger text, high contrast. |

Always design POS screens at 1194×834pt (iPad Air, landscape) as the base canvas. Scale up for 12.9" iPad Pro (1366×1024pt) where needed.

### What to avoid

- Pure black `#000000` — use `#0A0A0A` or `#1C1C1C` instead
- Pure white — always warm cream `#F5EFE4`
- Generic SaaS blues or greys as accent colours
- Persistent notification banners that need dismissing
- Tight spacing — this is an iPad app for busy hands
- Decorative elements that don't carry information
- More than one primary action per screen
- Text below 12px

---

## Roadmap

### Done
- [x] Brand direction locked (palette, typography, design philosophy)
- [x] Logomark and wordmark designed
- [x] Notion workspace created
- [x] POS prototype built in Base44 (see link above)

### Next
- [ ] Refine logomark (Felix to revisit)
- [ ] POS prototype — further iteration based on testing
- [ ] Staff personal devices prototype (rostering, payslips, messaging)
- [ ] Owner / manager backroom prototype
- [ ] Domain and socials — name trademark
- [ ] Competitor research deep-dive (Deputy, SevenRooms, UKG Pro)
- [ ] Mockups and UX documentation
- [ ] Patent research and legal advice
- [ ] App developer research
- [ ] Investor pitch preparation

---

## Files in this folder

| File | Description |
|---|---|
| `filo-project.md` | This document — master project reference |
| `filo-brand-identity.png` | Full brand identity sheet (palette, mark, wordmark, type) |
| `filo-design-philosophy.md` | Obsidian Service — the design philosophy behind the brand |

> When handing off to Claude Design, share all three files together. The PNG is referenced in this doc but must be attached separately for any design session to use it visually.

---

*Filo is Felix Plowman's project. Do not share, publish, or distribute without explicit permission.*
