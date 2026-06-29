# Services Section Redesign — Editorial Asymmetric

**Date:** 2026-06-29
**Status:** Approved

## Context

Current services section: flat crème background, identical 2-column cards, no depth, no visual hierarchy, price not prominent. Does not match the premium, authentic barbershop identity of the rest of the site.

## Design Direction: Editorial Asymmetric (Option C)

### Layout

- Section background: `#1A1410` (houtskool) with SVG grain noise at 25% opacity + layered radial copper gradients
- **Featured card** (first service): full width. Name + description left, price (80px) right. Thin copper decorative line above. Grain texture overlay on card itself.
- **Remaining services**: 3-col grid desktop → 2-col tablet → 1-col mobile. Row 1: first 3, Row 2: last 2 centered.
- Consistent spacing tokens: section py-24, card gap-5, card p-7 (featured p-10)

### Colors

| Element | Value |
|---|---|
| Section bg | `#1A1410` |
| Featured card bg | `#231A12` |
| Small card bg | `#1E160F` |
| Card border | `rgba(196,154,108,0.25)` |
| Price (featured) | `#C49A6C` |
| Price (small) | `#D4B48C` |
| Text primary | `#F5F0E8` |
| Text muted | `rgba(245,240,232,0.6)` |
| Accent copper | `#C49A6C` |

### Typography

| Element | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Section label | Oswald caps | 11px | 600 | 2px |
| Section heading | Playfair Display SC | 48–60px | 700 | -0.02em |
| Featured name | Playfair Display SC | 32–40px | 700 | -0.02em |
| Featured price | Playfair Display | 80px | 700 | -0.03em |
| Small card name | Playfair Display | 20px | 700 | -0.01em |
| Small card price | Playfair Display | 32px | 700 | -0.02em |
| Duration | Oswald caps | 11px | 600 | 2px |
| Body | Lora | 15px | 400 | normal |

### Interactions

- **Featured card**: `translateY(-2px)` + copper border opacity → 0.5 on hover. Spring easing.
- **Small cards**: `translateY(-4px)` + box-shadow copper glow intensifies on hover.
- **Buttons**: copper bg → `#A07848` on hover, `scale(0.97)` on active.
- All transitions: only `transform` and `opacity`. Never `transition-all`. `cubic-bezier(0.22, 1, 0.36, 1)`.
- `focus-visible` ring on all interactive elements (copper, 2px offset).

### Decorative Elements

- Section header: Oswald caps label "DIENSTEN & PRIJZEN" with copper `·` ornament
- Thin 1px copper line (`rgba(196,154,108,0.3)`) above featured card
- Grain texture: SVG fractalNoise overlay on section and featured card
- Radial gradients: copper glow top-left + espresso glow bottom-right of section

### Accessibility

- All text on dark backgrounds meets WCAG 2.1 AA contrast (min 4.5:1)
- `focus-visible` outlines on all interactive elements
- Semantic `<section>`, `<h2>`, `<h3>` structure preserved
- Animated elements respect `prefers-reduced-motion`

### Data

- Services fetched dynamically via `useServices(true)`
- `services[0]` = featured card
- `services.slice(1)` = grid cards
- No hardcoded service names or prices
