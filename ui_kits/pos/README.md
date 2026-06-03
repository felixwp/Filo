# Filo POS — UI Kit

High-fidelity, interactive recreation of the **Venue iPad / POS** — Filo's primary product surface and the only pillar prototyped to date. Built to the written component spec in `/uploads/filo-project.md` (the live Base44 prototype is login-gated). Designed at **1194×834** (iPad, landscape); `index.html` scales the frame to fit any viewport and letterboxes on near-black.

## Run it

Open `index.html`. It's a click-through prototype with fake data — no backend.

**Flow:** pick a staff member → *Start shift* → floor plan. Tap any table to take an order; browse menu by category, tap dishes to add to a course, accept **pairing suggestions**, *Send course* (button pulses green, docket "prints"), then *Bill* → settle with split + tip. The left **nav rail** switches between Floor, Kitchen (KDS), Guide, Sales (dashboard), and Settings.

## Files

| File | What it is |
|---|---|
| `index.html` | Scaling iPad stage + script loader + React mount. |
| `data.js` | Fake venue data — staff, floor-plan tables, menu (with dietary tags + pairings), dashboard figures. `window.FILO_DATA`. |
| `primitives.jsx` | Shared building blocks: `Icon` (Lucide wrapper), `Button`, `Pill`, `Tag`, `Panel`, `Money`, `TopBar`, `NavRail`. |
| `Login.jsx` | Staff select + till-float reference (brand panel left). |
| `FloorPlan.jsx` | Table tiles (status = border glow, birthday gold dot) + course-away reminders sidebar. |
| `TableOrder.jsx` | Menu browse, multi-course ordering, send-course pulse, bidirectional food↔drink pairing. |
| `KDS.jsx` | Kitchen Display — tickets by table, wait times, late-glow, mark-ready. |
| `Dashboard.jsx` | Live sales — revenue/covers/avg-spend/tips, covers-by-hour chart, top items. |
| `Guide.jsx` | Cocktail recipes + service flow; venue Settings list. |
| `Payment.jsx` | Glass modal — split (even/item/one bill), tip, method, settle pulse. |
| `App.jsx` | Orchestrator — routing + session state + toast. |

## Components covered

Nav rail · top bar with back/home · primary/secondary/ghost/destructive buttons · status pills · dietary tags · table tiles (4 statuses + birthday) · reminder cards · menu item cards · category rail · order panel with per-course grouping · pairing suggestion panel · KDS tickets · stat cards · bar chart · top-item list · glass payment modal · segmented controls · tip/method selectors · settings rows · glass toast.

## Fidelity notes

- **Icons:** Lucide via CDN (the documented system). Stroke 2px, cream, green when active.
- **Real interactions, faked data:** ordering, pairing, course-send, KDS ready-marking, and payment all update local React state. Nothing persists or prints for real.
- **Not production code** — cosmetic recreations of the components, deliberately simplified. Reuse the JSX as a starting point; cross-check against the live prototype when accessible.
- Built-out screens are POS only. The **staff app** (iPhone) and **owner backroom** share this visual language and these primitives when those kits are built.
