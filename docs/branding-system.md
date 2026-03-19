# Salasilah Branding System

## Brand direction

Salasilah should feel like a modern Malaysian heritage platform: rooted, trustworthy, warm, and quietly elegant.

- Core idea: lineage as living connection
- Emotional tone: familial, calm, dignified, contemporary
- Visual character: soft green SaaS surfaces, gold legacy accents, refined typography, light-touch cultural resonance
- Malay influence: expressed through rhythm, balance, warmth, and craft-like geometry rather than overt traditional ornament

## Logo concepts

### Concept 01: Warisan Canopy

Status: recommended primary mark

- Meaning: a family tree abstracted into a branching canopy with rooted descendants
- Shape language: circular nodes and gently arcing connectors to suggest lineage, kinship, and continuity
- Why it fits: it matches the app's current rounded SaaS visual language while feeling more ownable than a stock tree icon
- Malaysian cue: the balanced branch rhythm echoes woven and carved Malay visual cadence without becoming ornamental
- Asset: [public/brand/salasilah-concept-warisan-canopy.svg](/C:/Users/User/Documents/salasilah/public/brand/salasilah-concept-warisan-canopy.svg)

### Concept 02: Lineage Loop

- Meaning: a circular ancestry seal showing lineage as an unbroken family continuum
- Shape language: ring structure, four directional family nodes, central ancestral core
- Best use: commemorative seals, family certificates, print stamps, loading marks
- Asset: [public/brand/salasilah-concept-lineage-loop.svg](/C:/Users/User/Documents/salasilah/public/brand/salasilah-concept-lineage-loop.svg)

### Concept 03: Serumpun Grid

- Meaning: an interconnected kinship lattice, closer to a family graph than a literal tree
- Shape language: geometric node structure with subtle songket-like order
- Best use: enterprise areas, diagrams, product sub-brands, background motifs
- Asset: [public/brand/salasilah-concept-serumpun-grid.svg](/C:/Users/User/Documents/salasilah/public/brand/salasilah-concept-serumpun-grid.svg)

## Selected logo system

Implemented component: [src/components/brand/SalasilahLogo.tsx](/C:/Users/User/Documents/salasilah/src/components/brand/SalasilahLogo.tsx)

Available variants:

- `horizontal`: default app navbar and marketing use
- `vertical`: splash, onboarding, empty states, centered cards
- `icon`: favicon, app icon base, compact sidebar contexts
- `tone="default"`: light backgrounds
- `tone="inverse"`: dark green surfaces

Usage guidance:

- Minimum size for full logo: 120 px wide
- Minimum size for icon: 20 px
- Clear space: at least the width of one outer node around the mark
- Preferred background: warm white, soft green tint, or deep green
- Avoid outlines, drop shadows, or rotating the mark
- Do not replace the gold nodes with arbitrary colors

## Color system

The app already uses an aligned palette. These are the canonical brand roles.

### Primary greens

- `heritage-900`: `#07150F`
- `heritage-800`: `#0C2118`
- `heritage-700`: `#112C20`
- `heritage-600`: `#163829`
- `heritage-500`: `#1B4332`
- `heritage-400`: `#2D8C5A`
- `heritage-300`: `#55B682`
- `heritage-200`: `#8ECFAB`
- `heritage-100`: `#C6E8D4`
- `heritage-50`: `#E8F5EE`

Usage:

- `heritage-500`: primary actions, navigation, logo wordmark, key charts
- `heritage-600` to `heritage-900`: dark surfaces, footer, modal emphasis
- `heritage-50` to `heritage-100`: soft fills, hover states, badges, row highlights

### Legacy golds

- `legacy-900`: `#443407`
- `legacy-800`: `#684F0B`
- `legacy-700`: `#8C6A0F`
- `legacy-600`: `#B08513`
- `legacy-500`: `#D4A017`
- `legacy-400`: `#E8B520`
- `legacy-300`: `#F0C948`
- `legacy-200`: `#F5DC85`
- `legacy-100`: `#FAEFC2`
- `legacy-50`: `#FDF8E8`

Usage:

- `legacy-500`: premium highlights, ancestry milestones, callouts, selected logo nodes
- `legacy-50` to `legacy-100`: celebratory chips, status fills, onboarding illustrations
- Keep gold as an accent under 15 percent of any screen

### Warm neutrals

- `linen-0`: `#FFFEFC`
- `linen-50`: `#F8F7F4`
- `linen-100`: `#F0EDE8`
- `stone-200`: `#E5E0D8`
- `stone-300`: `#D5CEC4`
- `stone-500`: `#8B867C`
- `stone-700`: `#4A4741`
- `stone-900`: `#1F1D1A`

Usage:

- use `linen-0` and `linen-50` for canvas backgrounds
- use `stone-200` and `stone-300` for borders and dividers
- use `stone-500` for helper text
- use `stone-700` and `stone-900` for body copy and headings on light surfaces

## Typography

The current pairing is already correct for the product and should remain the official system.

- Primary UI font: Inter
- Secondary brand and heading font: Playfair Display

Roles:

- Display headlines: Playfair Display 600 to 700, tight leading, used sparingly
- Section titles: Playfair Display 600
- UI labels, body, forms, tables: Inter 400 to 600
- Data-heavy content: Inter only

Type scale:

- `display-xl`: 56/60, Playfair 700
- `display-lg`: 44/52, Playfair 700
- `heading-xl`: 36/44, Playfair 600
- `heading-lg`: 30/38, Playfair 600
- `heading-md`: 24/32, Playfair 600
- `body-lg`: 18/30, Inter 400
- `body-md`: 16/26, Inter 400
- `body-sm`: 14/22, Inter 400
- `label-md`: 14/20, Inter 600
- `label-sm`: 12/16, Inter 600

Accessibility notes:

- default body size should stay at 16 px minimum
- avoid Playfair in dense forms or tables
- preserve current focus rings and generous tap targets for older family members

## Foundation tokens

Recommended semantic tokens:

- `--brand-primary`: `#1B4332`
- `--brand-primary-soft`: `#E8F5EE`
- `--brand-accent`: `#D4A017`
- `--brand-canvas`: `#FFFEFC`
- `--brand-surface`: `#F8F7F4`
- `--brand-border`: `#E5E0D8`
- `--brand-text`: `#1F1D1A`
- `--brand-text-muted`: `#8B867C`
- `--radius-sm`: `0.75rem`
- `--radius-md`: `1rem`
- `--radius-lg`: `1.5rem`
- `--shadow-soft`: `0 12px 30px rgba(17, 44, 32, 0.08)`
- `--shadow-lift`: `0 18px 48px rgba(17, 44, 32, 0.12)`

Spacing rhythm:

- base unit: 4 px
- component spacing preference: 12, 16, 20, 24, 32
- card padding: 24 on desktop, 20 on mobile
- section spacing: 64 to 96 depending on screen context

## UI brand elements

### Cards

- Surface: white or `linen-0`
- Radius: 24 px for hero and dashboard cards, 20 px for standard content cards
- Border: 1 px `stone-200`
- Shadow: soft green-tinted elevation, never pure black-heavy shadow
- Accent treatment: optional top border, soft inset tint, or gold micro-icon instead of strong colored backgrounds

Suggested class direction:

- `rounded-2xl border border-stone-200 bg-white shadow-[0_12px_30px_rgba(17,44,32,0.08)]`

### Buttons

- Primary: heritage green fill, white text, slight lift on hover
- Secondary: white fill, green border, green text
- Tertiary: text-only with soft green hover wash
- Accent: gold fill reserved for milestone or celebratory actions

Interaction:

- hover translate: `-1px`
- active translate: `0`
- disabled opacity: `0.45`
- loading: retain width and show subtle spinner or pulse dot

### Inputs

- Height: 44 to 48 px
- Background: white
- Border: `stone-200`
- Focus: 2 px heritage ring with soft offset
- Error: keep border subtle and pair with text feedback, not just red

### Tags and badges

- Family branch badges: soft green fill with dark green text
- Legacy badges: pale gold fill with gold-brown text
- Neutral badges: warm stone fill
- Shape: full pill

### Avatar placeholders

- Base: pale green or pale gold gradient
- Content: initials in deep green
- Optional motif: tiny branch node watermark at 8 to 12 percent opacity

## Illustrations and visual style

Style direction:

- flat-to-soft illustration with minimal depth
- rounded forms, thin branch lines, calm facial detail
- use 2 to 4 colors plus neutral background
- avoid cartoon exaggeration or childlike proportions

Recommended illustration themes:

- multigenerational family grouping with connected branch lines
- onboarding panels showing add member, link relation, explore timeline
- empty state with a small lineage sprout becoming a tree
- map illustration with dotted routes between hometown and current city

Composition rules:

- prefer asymmetrical layouts with generous white space
- use branch-node motifs as connective framing elements
- keep Malay cues indirect through attire silhouettes, architecture hints, or weaving-inspired line rhythm

## Icon style

Recommended icon language:

- primary style: rounded line icons
- stroke width: 1.75 to 2 px
- corner style: rounded
- fills: optional duotone only for featured marketing blocks, not dense UI

Consistency rules:

- use the same optical size per context
- pair person icons with circular or rounded-shoulder silhouettes
- keep tree and relationship icons geometric, not botanical
- use location icons with softened angles to match the logo geometry

Examples:

- family member: bust silhouette with one branch-node detail
- relationship: two nodes connected by a curved link
- tree: abstract branching structure with 3 to 5 nodes
- map/location: pin with centered node instead of a generic hole

## Motion system

Keep motion quiet and supportive.

- Hover: 120 to 160 ms ease-out, tiny lift or tint shift only
- Card entrance: 220 to 280 ms, fade plus 8 px upward travel
- Modal: 180 ms opacity plus 200 ms scale from 0.98 to 1
- Drawer: 240 ms translate with opacity-synced backdrop
- Loading: pulse or shimmer under 1.2 s, low contrast

Reduced motion:

- remove translate and scale
- keep only opacity transitions

## Tone of voice

- Warm, respectful, and reassuring
- Modern and clear rather than ceremonial
- Proud of heritage without sounding formal or museum-like

Writing cues:

- use language around preserving, connecting, remembering, and sharing
- avoid cold enterprise phrasing like records, assets, or ownership unless context requires it

## Integration into the current UI

The current app already uses the right base ingredients, so the brand should integrate through refinement rather than redesign.

### Immediate integration points

- replace generic `TreePine` brand marks with `SalasilahLogo`
- keep current green sidebar and gold accent because they already support the brand story
- use the icon-only logo in compact spaces and the horizontal version in landing and auth flows
- retain the existing Playfair hero typography for emotional resonance

### Component-level fit

- landing page hero: horizontal logo, tagline optional, keep current gradient but shift supporting visuals toward branch-node motifs
- dashboard/sidebar: inverse horizontal logo on green surfaces
- topbar mobile: compact horizontal logo
- empty states: vertical logo plus lineage sprout illustration
- family tree nodes: use gold only for anchors such as founders, milestones, or selected lineage

### Tailwind-friendly usage snippet

```tsx
import { SalasilahLogo } from '@/components/brand/SalasilahLogo'

<SalasilahLogo variant="horizontal" />
<SalasilahLogo variant="horizontal" tone="inverse" showTagline />
<SalasilahLogo variant="icon" className="h-8 w-8" />
<SalasilahLogo variant="vertical" showTagline />
```

## Deliverables recap

- three logo concepts as SVG assets
- one production-ready reusable logo component
- a complete palette aligned to existing Tailwind colors
- typography guidance based on existing Inter plus Playfair pairing
- reusable UI element, icon, illustration, and motion direction
- current-UI integration guidance for immediate rollout
