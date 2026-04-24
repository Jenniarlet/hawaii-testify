# 🌺 HawaiiTestify

A mobile-first civic engagement app that makes it easy for Hawaii residents to find, understand, and submit written testimony on state and city legislation — in minutes.

Built with the **Aloha Collective** design system by Mayu Systems.

---

## What it does

1. **Onboarding** — User picks their island, community role, and up to 5 topic interests
2. **Swipe Feed** — Tinder-style cards of upcoming bills from both the Hawaii State Legislature and Honolulu City Council
3. **Prompts** — User fills in their stance, reason, and optional personal story
4. **Testimony** — App generates a full ready-to-submit letter based on inputs
5. **Submit** — Step-by-step instructions to submit online, by email, or in person

---

## Data Sources

| Level | Body | API | Submission |
|-------|------|-----|------------|
| State | Hawaii State Legislature | LegiScan REST API | capitol.hawaii.gov |
| County | Honolulu City Council | Legistar (Granicus) — free, no key | honolulucitycouncil.org |

Both sources fall back to mock data if the API is unavailable.

---

## Tech Stack

- **React 19 + Vite 7** (PWA)
- **Tailwind CSS v4** — `@theme` token block (Aloha Collective palette)
- **react-spring + @use-gesture/react** — swipe animations
- **Vercel** — hosting + serverless API proxy functions
- **localStorage** — profile, swipe history, 6-hour API cache

---

## Design System

Aloha Collective brand by Mayu Systems — social activism / mutual aid flavor.

- **Fonts:** Fraunces (serif headlines) + DM Sans (body)
- **Colors:** Coral `#EE6C4D` · Ocean `#1F6F78` · Seafoam `#A8D5D1` · Leaf `#4D7A5A` · Sand `#F6EDE3` · Cream `#FFF9F2` · Charcoal `#1F2933`
- **Reusable skill:** `/aloha-collective` (`.claude/commands/aloha-collective.md`)

---

## Project Structure

```
hawaii-testify/
├── api/
│   ├── legiscan.js       # Vercel proxy → LegiScan (state bills)
│   └── legistar.js       # Vercel proxy → Legistar (Honolulu City Council)
├── src/
│   ├── App.jsx            # Root — routing, state, parallel data fetch
│   ├── components/
│   │   ├── Onboarding.jsx    # 3-step first-time setup
│   │   ├── SwipeFeed.jsx     # Swipeable bill cards (STATE / CITY badges)
│   │   ├── Prompts.jsx       # Stance + reason + story form
│   │   ├── TestimonyView.jsx # Generated letter + copy button
│   │   └── SubmitScreen.jsx  # Step-by-step submission guide
│   ├── data/
│   │   └── bills.js          # Mock bills (state + county fallback)
│   └── utils/
│       ├── legiscan.js       # LegiScan client + cache
│       ├── legistar.js       # Legistar client + cache
│       ├── billTransform.js  # Normalizes LegiScan → bill shape
│       ├── testimony.js      # Generates testimony letter text
│       └── storage.js        # localStorage helpers
├── ARCHITECTURE.md        # Full system diagram (Mermaid)
└── NOTES.md               # Session notes and decisions
```

---

## Local Dev

```bash
npm install
vercel dev        # runs Vite + serverless functions together
```

> `npm run dev` (Vite only) works but API calls will fall back to mock data since Vercel functions don't run.

---

## Environment Variables

| Variable | Required | Used by |
|----------|----------|---------|
| `LEGISCAN_KEY` | Yes (state bills) | `api/legiscan.js` |

Set in Vercel dashboard → Project → Settings → Environment Variables.

---

## Session Log

| Date | Work done |
|------|-----------|
| 2026-04-21 | Initial project setup — LegiScan state bills, swipe UI, testimony generation, onboarding |
| 2026-04-21 | Added Honolulu City Council bills via Legistar API (PR #1 merged to main) |
| 2026-04-21 | Full Aloha Collective brand redesign (light theme, coral/ocean palette, Fraunces + DM Sans) |
| 2026-04-21 | Added header comments to all 14 source files; created ARCHITECTURE.md |
| 2026-04-24 | Renamed `/mayu-brand` Claude skill to `/aloha-collective` |

---

## Roadmap

- [ ] Maui, Big Island, Kauai county councils
- [ ] Vercel Preview Deployments enabled (feature branch previews)
- [ ] Onboarding "cheat sheet" — State vs City vs 311 explanation
- [ ] Profile editing screen (change island / interests)
- [ ] Push notifications for upcoming hearing deadlines
