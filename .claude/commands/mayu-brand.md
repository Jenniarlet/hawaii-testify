# /mayu-brand — Aloha Collective Brand System (Mayu Systems)

Apply the Mayu Systems / Aloha Collective design language to this project.
Created by Jenn Moura for social activism, mutual aid, and community coordination apps.

---

## When to use this skill

Run `/mayu-brand` in any React + Tailwind CSS project when you want to apply
the Aloha Collective visual identity. The skill will:

1. Add the color tokens and typography to the CSS/Tailwind config
2. Swap Inter for DM Sans + Fraunces
3. Update component classes from dark/generic themes to the Aloha Collective palette
4. Apply pill-shaped CTAs, warm card styles, and the kicker/eyebrow label pattern

---

## Brand Identity

**Project lineage:** CocoNene Hawaii · Zohran Mamdani 2025 NYC campaign · AOC Tandem NYC 2018
**Built by:** Jenn Moura, Mayu Systems
**For:** Social activism, mutual aid, community coordination

**Design principles:**
- Design IS the message — signal whose side you are on before anyone reads a word
- Helper-first: answer "I want to help. What do I do right now?"
- Agency language, not outrage — "we act now" framing, belonging over anger
- Foot-in-the-door: lightest ask first, deepest last
- Trauma-informed: show progress and hope, not perpetual crisis

---

## Color Palette

Add these tokens to `@theme` in `src/index.css` (Tailwind v4) or to `tailwind.config.js` (v3):

```css
@theme {
  --color-coral:        #EE6C4D;   /* Primary CTA buttons, urgent actions     */
  --color-coral-deep:   #D9563A;   /* Hover / pressed states                  */
  --color-ocean:        #1F6F78;   /* Brand teal — links, badges, verified    */
  --color-seafoam:      #9CC9C3;   /* Secondary accents, tag backgrounds      */
  --color-plumeria:     #F4C95D;   /* Progress fills, highlights, gov markers */
  --color-sand:         #F6EDE3;   /* Card backgrounds, section backgrounds   */
  --color-sand-deep:    #f2e4d8;   /* Progress track, dividers                */
  --color-cream:        #FFF9F2;   /* Page / app background                   */
  --color-leaf:         #4D7A5A;   /* Affirmative actions, agriculture        */
  --color-leaf-deep:    #3a5c44;   /* Leaf hover state                        */
  --color-charcoal:     #1F2933;   /* Body text, headings                     */
  --color-muted:        #5A6772;   /* Secondary text, metadata                */
  --color-border:       #E6D9CB;   /* Card borders, dividers                  */

  /* Island badge colors */
  --color-island-oahu:    #1F6F78;
  --color-island-maui:    #EE6C4D;
  --color-island-hawaii:  #4D7A5A;
  --color-island-kauai:   #7C3AED;
  --color-island-molokai: #B45309;
  --color-island-gov:     #5B4E8C;

  /* Typography */
  --font-sans:   'DM Sans', system-ui, -apple-system, sans-serif;
  --font-serif:  'Fraunces', Georgia, serif;
}
```

For Tailwind v3, add to `theme.extend.colors` in `tailwind.config.js`:
```js
coral: { DEFAULT: '#EE6C4D', deep: '#D9563A' },
ocean: '#1F6F78',
seafoam: '#9CC9C3',
plumeria: '#F4C95D',
sand: { DEFAULT: '#F6EDE3', deep: '#f2e4d8' },
cream: '#FFF9F2',
leaf: { DEFAULT: '#4D7A5A', deep: '#3a5c44' },
charcoal: '#1F2933',
muted: '#5A6772',
border: '#E6D9CB',
```

---

## Typography

Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Fraunces:wght@600;700&display=swap" rel="stylesheet" />
```

**Usage rules:**
- `font-serif` (Fraunces 600–700) → all screen titles, card headlines, "you did it" moments
- `font-sans` (DM Sans) → everything else: body, labels, buttons, metadata
- Kicker/eyebrow labels → `font-sans font-extrabold uppercase tracking-widest text-xs text-muted`

---

## Component Patterns

### App background and page chrome
```
bg-cream          → page / app background (#FFF9F2)
bg-sand           → card / section backgrounds (#F6EDE3)
bg-white          → elevated cards, inputs, testimony box
border-border     → all dividers and card borders (#E6D9CB)
text-charcoal     → primary text (#1F2933)
text-muted        → secondary / metadata text (#5A6772)
```

### Buttons (always pill-shaped: rounded-full)
```
Primary CTA:    bg-coral text-white shadow-lg shadow-charcoal/20 active:scale-95
Secondary:      bg-white text-charcoal border-2 border-border
Affirmative:    bg-leaf text-white   (support, confirm, testify)
Destructive:    bg-coral text-white  (also primary — coral is the brand CTA color)
Disabled:       bg-sand text-muted cursor-not-allowed
```

### Cards
```
bg-white rounded-2xl border border-border
Box shadow: style={{ boxShadow: "0 12px 34px rgba(31,41,51,0.10)" }}
Card title: font-serif font-bold text-charcoal
Card meta:  font-sans text-muted text-xs
```

### Tags / pills
```
bg-seafoam/30 text-ocean text-xs font-semibold px-3 py-1 rounded-full
```

### Kicker / section label (eyebrow text)
```
text-muted text-xs font-extrabold uppercase tracking-widest
```

### Progress bars
```
Track:  bg-sand-deep rounded-full h-2.5
Fill:   style={{ background: "linear-gradient(90deg, #EE6C4D, #F4C95D)" }}
Always show: goal amount, amount raised, percentage
Label urgent campaigns in coral
```

### Dividers
```
<div className="h-px bg-border mx-6" />
```

### Island badges (for Hawaii projects)
```
Oʻahu:    bg-island-oahu    text-white  → #1F6F78
Maui:     bg-island-maui    text-white  → #EE6C4D
Hawaiʻi:  bg-island-hawaii  text-white  → #4D7A5A
Kauaʻi:   bg-island-kauai   text-white  → #7C3AED
Molokaʻi: bg-island-molokai text-white  → #B45309
Gov/State: bg-island-gov    text-white  → #5B4E8C
```

---

## Voice and Tone (apply to all copy)

| Context | Pattern | Example |
|---------|---------|---------|
| Hero / screen title | Warm, direct, serif | "Your Voice, Your Legislature" |
| Section labels | Kicker style, ALL CAPS, muted | "STATE + CITY COUNCIL" |
| CTA buttons | Active verb-first | "Generate My Testimony" / "Review More Bills" |
| Empty states | Hopeful, collective | "Mahalo for staying engaged." |
| Progress | Hope-anchored | "68% of the Hāna family's goal reached" |

**Avoid:** outrage headlines, victim-first language, perpetual crisis loops, generic nonprofit copy.

---

## FITD Action Order (Foot-in-the-Door)

When designing CTA hubs, always order actions lightest → heaviest:
1. Share this page
2. Verify a resource
3. Suggest a correction
4. Donate in-kind
5. Donate money
6. Volunteer a day
7. Organize something

Never lead with the money ask.

---

## CSS Design Tokens (copy into any project's CSS)

```css
--coco-shadow: 0 12px 34px rgba(31,41,51,0.10);
--coco-border: #E6D9CB;
--max: 1280px;
```

---

## Checklist for New Projects

- [ ] Add Google Fonts import (DM Sans + Fraunces)
- [ ] Add color tokens to @theme / tailwind.config
- [ ] Set body background to `#FFF9F2` (cream)
- [ ] Replace all dark/generic backgrounds with cream/sand/white
- [ ] Replace Inter with DM Sans (font-sans)
- [ ] Add font-serif to all screen titles and card headlines
- [ ] Make all CTA buttons pill-shaped (rounded-full)
- [ ] Primary CTA = coral (#EE6C4D)
- [ ] Affirmative/support action = leaf (#4D7A5A)
- [ ] Use kicker pattern for all section labels (uppercase, tracking-widest, font-extrabold, text-muted)
- [ ] Update meta theme-color to #FFF9F2
- [ ] Apply FITD action ordering to any CTA hub
- [ ] Rewrite hero copy in agency/belonging framing (not outrage/victim)

---

*Aloha Collective Brand Guide · Mayu Systems · Jenn Moura · April 2026*
