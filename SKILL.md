---
name: filo-design
description: Use this skill to generate well-branded interfaces and assets for Filo, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

Filo is a hospitality management platform — "A good shift." The design movement is **Obsidian Service**: confident darkness pierced by moments of deliberate colour. Premium but hardworking; it should feel like a good restaurant, not a tech startup.

- **Foundations:** `colors_and_type.css` — import first; all colour/type/spacing/radius/shadow/motion tokens.
- **Palette:** base `#0A0A0A` · surface `#1C1C1C` · racing green `#0D4A28` · gold `#C9921E` (money/premium, sparing) · warm cream `#F5EFE4` (all text — never pure white).
- **Type:** Instrument Sans only (Google Fonts), Regular + Bold. Wordmark = Bold, uppercase, tracked +0.10em, green underline.
- **Icons:** Lucide (CDN), 2px stroke, cream / green-when-active. Never emoji.
- **Assets:** `assets/` — the F-in-circle mark (green / cream / reversed) + a symbol exploration.
- **Components & screens:** `ui_kits/pos/` — full interactive iPad POS recreation; reuse its JSX primitives.
- **Voice:** spare, calm, sentence case, British English, no exclamation marks, hospitality vocabulary (covers, course away, the pass).

See README.md for the full content + visual foundations and iconography rules.
