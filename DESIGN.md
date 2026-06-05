---
name: zrate.io
description: Premium currency exchange tool for everyday people across Southeast Asia
colors:
  white-canvas: oklch(0.985 0 0)
  cool-mist: oklch(0.965 0.001 260)
  pure-white: oklch(1 0 0)
  deep-ink: oklch(0.15 0.005 260)
  muted-slate: oklch(0.38 0.01 260)
  faded-graphite: oklch(0.52 0.01 260)
  warm-copper: oklch(0.6 0.18 70)
  warm-copper-hover: oklch(0.53 0.19 70)
  copper-subtle: oklch(0.94 0.025 70)
  copper-text: oklch(0.5 0.16 70)
  soft-line: oklch(0.88 0.005 260)
  line-hover: oklch(0.75 0.01 260)
  line-accent: oklch(0.82 0.06 70)
  verdant-green: oklch(0.55 0.18 145)
  green-subtle: oklch(0.93 0.03 145)
  deep-crimson: oklch(0.5 0.18 25)
  crimson-subtle: oklch(0.93 0.02 25)
  golden-amber: oklch(0.65 0.16 85)
  amber-subtle: oklch(0.94 0.04 85)
  dark-charcoal: oklch(0.13 0.005 260)
  dark-surface: oklch(0.17 0.005 260)
  dark-elevated: oklch(0.21 0.005 260)
  dark-ink: oklch(0.93 0 0)
  dark-copper: oklch(0.68 0.16 70)
  dark-copper-hover: oklch(0.74 0.15 70)
  dark-copper-subtle: oklch(0.22 0.04 70)
  dark-line: oklch(0.26 0.005 260)
typography:
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
  heading:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  label:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: normal
  mono:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontVariantNumeric: tabular-nums
rounded:
  sm: 6px
  md: 10px
  lg: 14px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
components:
  button-primary:
    backgroundColor: "{colors.warm-copper}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.warm-copper-hover}"
  button-icon:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.muted-slate}"
    rounded: "{rounded.sm}"
    size: 36px
  currency-card:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.md}"
    padding: 16px
  currency-card-hover:
    backgroundColor: "{colors.pure-white}"
  converter-panel:
    backgroundColor: "{colors.pure-white}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  search-input:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.sm}"
    padding: "11px 40px 11px 42px"
---

# Design System: zrate.io

## 1. Overview

**Creative North Star: "The Currency Desk"**

zrate.io feels like stepping up to a premium exchange counter — dark wood grain, warm copper details, soft ambient light, everything arranged with quiet precision. The interface treats currency data with the same reverence a seasoned teller brings to counting notes: calm, accurate, unhurried. Numbers anchor every surface; decoration exists only to make numbers easier to read.

This is a product surface — design serves the task. The user opens the page, scans the rate they need, and leaves. Every visual choice either accelerates that flow or gets cut. The system uses one color accent (Warm Copper) at ≤10% of any given screen, a single sans-serif family (Inter), and elevation only as a response to interaction.

The system explicitly rejects: neon cyber aesthetics, institutional bank blues, crypto-exchange dark-mode-only, glassmorphism, gradient text, side-stripe borders, and decorative motion that doesn't convey state.

**Key Characteristics:**
- Restrained color with one committed accent — Warm Copper carries primary actions, selection, and the star favorite indicator
- Flat-by-default elevation — shadows appear only on hover, lift, or focus
- Single type family with weight contrast for hierarchy — Inter at 400/500/600/700
- Clean bordered cards with 10px radius — no glow, no glass, no side-stripes
- True off-white light mode (chroma 0), deep charcoal dark mode — both equally considered, neither the default
- Five-language interface with tabular-nums for all rate values

## 2. Colors

The palette is built for financial data: neutral surfaces let numbers dominate, Warm Copper provides the only deliberate color signal, and semantic greens/reds carry rate-change meaning.

### Primary
- **Warm Copper** (oklch(0.6 0.18 70)): The sole accent. Used for primary action buttons, the active base-currency card border, favorite star fill, focus rings, and text links. Applied at ≤10% of any screen — its scarcity is what makes it signal. In dark mode shifts to oklch(0.68 0.16 70) to maintain equivalent perceived brightness.
- **Copper Subtle** (oklch(0.94 0.025 70)): Tinted background for accent-associated surfaces — active base-currency card, hover states on set-base buttons, focus ring glow. Dark mode: oklch(0.22 0.04 70).

### Secondary
Not used. A single accent is sufficient for a tool where color's only job is to say "this is the active thing."

### Tertiary
Not used.

### Neutral
- **White Canvas** (oklch(0.985 0 0)): Page background in light mode. True off-white at chroma 0 — deliberately not warm-tinted to avoid the saturated cream/sand AI default.
- **Cool Mist** (oklch(0.965 0.001 260)): Secondary surface — status bar background, pair ticker, SEO cards, footer background. Slightly cooler than Canvas to create tonal depth without shadow.
- **Pure White** (oklch(1 0 0)): Elevated surface — cards, converter panel, search input, dropdown options. The brightest layer.
- **Deep Ink** (oklch(0.15 0.005 260)): Primary text. Meets ≥4.5:1 against all light backgrounds. Near-black with a trace of cool tint.
- **Muted Slate** (oklch(0.38 0.01 260)): Secondary text — descriptions, currency names, helper labels.
- **Faded Graphite** (oklch(0.52 0.01 260)): Tertiary text — unit rates, timestamps, placeholders, footer.
- **Soft Line** (oklch(0.88 0.005 260)): Default borders. Present but unobtrusive.
- **Line Accent** (oklch(0.82 0.06 70)): Borders carrying accent meaning — favorite card border, USDT card border.

### Named Rules
**The One-Accent Rule.** Warm Copper is the only saturated color on the page besides semantic indicators. No secondary accent, no decorative color splashes. If a color isn't Warm Copper, green, red, or amber, it shouldn't exist on the screen.

**The Dark Mode Equivalent-Brightness Rule.** Every accent color has a dark-mode counterpart with perceptually equivalent brightness, not the same OKLCH values. Warm Copper at oklch(0.6 0.18 70) becomes oklch(0.68 0.16 70) in dark mode — lighter and slightly desaturated to read with equal intensity against dark backgrounds.

**The No-Gray-Text Rule.** Secondary and tertiary text use the same cool hue as Deep Ink at higher lightness — not neutral gray. Gray text on a colored background looks washed out; tinted text stays alive.

## 3. Typography

**Font:** Inter, system-ui, -apple-system, sans-serif

**Character:** Inter was chosen as the single type family per the product register: one well-tuned sans carries headings, labels, body, and data. Its tall x-height and open apertures keep currency codes legible at small sizes. The system uses weight contrast (400 → 500 → 600 → 700) rather than size alone to build hierarchy. Tabular-nums are enabled on all rate values, timestamps, and currency codes — numbers align in vertical scans.

### Hierarchy
- **Display** (700, clamp(1.75rem, 3.5vw, 2.75rem), 1.12): Hero page titles and pair-page h1. Letter-spacing -0.02em for tight but not touching headlines.
- **Heading** (600, 1.375rem, 1.2): Section headings (SEO, footer). Letter-spacing -0.01em.
- **Title** (600, 1.25rem, 1.2): Card rate values, converter labels, summary values. Tabular-nums.
- **Body** (400, 1rem, 1.5): Prose in SEO sections, descriptions. Max width 72ch.
- **Body Small** (400, 0.875rem, 1.55): Card body text, secondary descriptions.
- **Label** (500, 0.8125rem, normal): Input labels, status text, pair ticker labels, unit rates.
- **Caption** (400, 0.75rem, normal): Timestamps, footer. Tabular-nums.

### Named Rules
**The Single-Family Rule.** Inter is the only font. No display/body pairing, no monospace for code (tabular-nums on Inter handles number alignment). One family with weight contrast beats two competing typefaces.

**The No-Uppercase-Body Rule.** Uppercase is reserved for the single panel label eyebrow ("BASE CURRENCY") — ≤4 words, 0.04em tracking. No sentence-case copy, no uppercase section markers.

**The Balance Rule.** All h1–h3 headings use `text-wrap: balance` for even line lengths. Body prose uses `text-wrap: pretty` to reduce orphans. No heading overflows its container at any breakpoint.

## 4. Elevation

This system is flat by default. Surfaces are distinguished by tonal layering (Canvas → Cool Mist → Pure White) rather than shadows at rest. Shadows appear only as a response to state: card hover lift, button press, focus elevation.

The tonal progression in light mode: oklch(0.985 0 0) → oklch(0.965 0.001 260) → oklch(1 0 0). Each step is subtle enough that the transition reads as depth without feeling layered or heavy.

### Shadow Vocabulary
- **Ambient-sm** (`0 1px 2px oklch(0 0 0 / 0.04)`): Default card rest state — nearly imperceptible, just enough to separate from the Canvas background.
- **Hover-md** (`0 4px 12px oklch(0 0 0 / 0.06)`): Card hover. Lift is 2px via transform; shadow spreads to reinforce the raised position.
- **Elevated-lg** (`0 8px 24px oklch(0 0 0 / 0.08)`): Reserved for modals, dropdowns, or any element that must sit above the page. Not currently used in the main interface.

Dark mode shadows use the same offsets with darker alpha: 0.12, 0.18, 0.24 respectively.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, lift). If every card casts a shadow by default, the page feels heavy; reserve shadow for moments that earn it.

**The Tonal-First Rule.** Depth is conveyed primarily through background-lightness progression (3 tonal steps), not through shadow. Shadow is the reinforcement, not the primary signal.

## 5. Components

### Buttons
- **Shape:** 6px radius for icon buttons, 10px for primary action buttons.
- **Primary (icon button):** 36×36px, border 1px Soft Line, background Pure White. On hover: border shifts to Line Hover, background to Cool Mist. Transition 150ms ease-out.
- **Theme toggle:** Same dimensions as icon button. On hover, the SVG icon rotates 15deg over 300ms ease-out. Swaps between sun and moon SVG paths.
- **Set-base button:** Full-width within card, border Soft Line, text Muted Slate. On hover: border Warm Copper, background Copper Subtle, text Copper Text. Disabled state: border Warm Copper, background Copper Subtle, cursor default.
- **Favorite star:** Borderless, text Faded Graphite. Active: Warm Copper. Hover scales to 1.15× over 150ms.

### Cards (Currency Card)
- **Shape:** 10px radius, 1px Soft Line border, 16px internal padding.
- **Background:** Pure White at rest. On hover: lifts 2px via transform, shadow shifts to Hover-md. Border shifts to Line Hover.
- **Variants:** Favorite card gets Line Accent border. USDT card gets a teal-tinted border (oklch(0.55 0.12 180 / 0.25)). Base currency card gets Warm Copper border + Copper Subtle background.
- **Content layout:** Flag + code + favorite star (top row) → currency name → converted amount (large) → unit rate (small) → set-base button (bottom).
- **Animation:** Staggered fadeUp entrance (0.35s ease-out, 30ms delay per row). Static at rest.

### Converter Panel
- **Shape:** 10px radius, 1px Soft Line border, 20px 24px padding. Shadow Ambient-sm.
- **Background:** Pure White.
- **Layout:** "BASE CURRENCY" eyebrow (uppercase, 0.04em tracking, Faded Graphite, 0.8125rem) → amount input + currency select in a flex row (wraps at 480px).
- **Input:** Background Canvas, border Soft Line, 1.5rem Inter 600 for the amount. Focus: border Warm Copper, box-shadow 0 0 0 3px Copper Subtle.
- **Select:** Custom chevron via background-image SVG. Same focus treatment as input.

### Search Input
- **Shape:** 6px radius, 11px vertical padding, 42px left padding (for search icon), 40px right padding (for clear button).
- **Background:** Pure White, border Soft Line. Focus: border Warm Copper, 3px Copper Subtle ring.
- **Icon:** Magnifying glass SVG at left 14px, color Faded Graphite.
- **Clear button:** "×" at right 10px, Faded Graphite, hover Deep Ink + Cool Mist background.

### Pair Ticker Chips
- **Shape:** Fully rounded (9999px), 5px 12px padding.
- **Style:** Border Soft Line, text Muted Slate, 0.8125rem Inter 500.
- **Hover:** Border Warm Copper, background Copper Subtle, text Copper Text.
- **Container:** Infinite horizontal scroll at 38s duration. Pauses on hover. Gradient mask on edges for fade-in/out.

### Status Indicator
- **Shape:** 7px circle inside a fully rounded pill (6px 14px padding, Cool Mist background, Soft Line border).
- **Live state:** Verdant Green dot, pulse animation (1.5s ease-in-out, 100% → 35% opacity).
- **Loading state:** Golden Amber dot, same pulse animation.
- **Text:** 0.8125rem Inter 500, Muted Slate. Timestamp in 0.75rem Faded Graphite, tabular-nums.

### Language Select
- **Shape:** 36px height, 6px radius, max-width 124px. Soft Line border, Pure White background.
- **Typography:** 0.875rem Inter 500.
- **Chevron:** Custom SVG via background-image (light/dark variants). 10px width at right 8px.
- **Focus:** Border Line Hover, box-shadow Copper Subtle ring.
- **Options:** Pure White/Dark Elevated background, Deep Ink/Dark Ink text.

### Ad Slots
- Minimal styling — centered flex container with margin. Banner and native slots inherit the page background. No visible borders or decorative treatment.

## 6. Do's and Don'ts

### Do:
- **Do** use Warm Copper exclusively for primary actions, active selection, focus rings, and the favorite star — nowhere else.
- **Do** use tabular-nums (`font-variant-numeric: tabular-nums`) on every rendered rate value, timestamp, and currency code.
- **Do** use the tonal background progression (Canvas → Cool Mist → Pure White) to express depth without shadow.
- **Do** respect `prefers-reduced-motion` — all animations must have a `@media (prefers-reduced-motion: reduce)` fallback that sets `animation: none` and `transition: none`.
- **Do** test every heading against its container at 320px viewport width. If it overflows, reduce the clamp max or rewrite the copy.
- **Do** use the 3px Copper Subtle ring on focus-visible for all interactive elements — it's the consistent affordance across inputs, selects, and buttons.

### Don't:
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on any card, list item, or container. Use full borders, background tints, or the Warm Copper badge instead.
- **Don't** use `background-clip: text` with a gradient. All text is solid color — emphasis comes from weight and size.
- **Don't** use glassmorphism, backdrop-filter blur, or translucent cards as decoration. The one exception is the pair ticker's gradient mask for edge fade — functional, not decorative.
- **Don't** introduce a second display font or monospace family. Inter at weight 700 handles display; Inter with tabular-nums handles data.
- **Don't** use neon glow, box-shadow with saturated colors, or `text-shadow` for decorative effect. Shadow is structural (elevation), not atmospheric.
- **Don't** use dark mode as the only theme. Light mode is equally designed; the theme toggle is always visible in the header.
- **Don't** use institutional blues (hex ~#003366 family) or crypto greens (hex ~#00ff00 family) — those are the banking and crypto clichés this system was built to escape.
- **Don't** use cream, sand, beige, parchment, or any warm-tinted near-white (OKLCH L 0.84–0.97, C < 0.06, hue 40–100) as the body background. The Canvas is chroma 0, deliberately neutral.
