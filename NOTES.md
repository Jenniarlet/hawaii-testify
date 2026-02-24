# HawaiiTestify — Build Notes

## Live App
- **Production URL:** https://hawaii-testify.vercel.app
- **GitHub Repo:** https://github.com/Jenniarlet/hawaii-testify

---

## What This App Does
A mobile-first civic tech web app (PWA) that helps Hawaii residents discover active state legislation and generate personalized testimony to submit to the Hawaii State Legislature.

Flow: Onboarding → Swipe bills → Add your perspective → Generate testimony → Submit to capitol.hawaii.gov

---

## Tech Stack
| Tool | Purpose | Link |
|------|---------|------|
| React + Vite | Frontend framework | https://vitejs.dev |
| Tailwind CSS v4 | Styling | https://tailwindcss.com |
| react-spring | Card swipe animations | https://www.react-spring.dev |
| @use-gesture/react | Touch/drag detection | https://use-gesture.netlify.app |
| Vercel | Hosting + serverless functions | https://vercel.com |
| LegiScan API | Live Hawaii State Legislature bills | https://legiscan.com/legiscan |

---

## Services & Accounts

### GitHub
- Account: Jenniarlet
- Repo: https://github.com/Jenniarlet/hawaii-testify

### Vercel
- Dashboard: https://vercel.com/jenniarlets-projects/hawaii-testify
- Auto-deploys on every push to GitHub main branch

### LegiScan
- Account portal: https://legiscan.com/legiscan
- API docs: https://legiscan.com/gaits/documentation/legiscan
- API Key: 7bc10d0c1d1b9d4719f4d97bdcb77b40
- Plan: Free public API — 30,000 queries/month, resets 1st of each month
- Our estimated usage: ~9–11 queries per user refresh (well within limits)

---

## API Key Security
- The LegiScan API key is stored in **Vercel's environment variables** (server-side only)
- It is NOT in the frontend code or GitHub — it lives in Vercel as `LEGISCAN_KEY`
- The browser calls `/api/legiscan` (our own Vercel serverless function) which then calls LegiScan
- To update the key on Vercel: https://vercel.com/jenniarlets-projects/hawaii-testify/settings/environment-variables

---

## Caching Strategy (LegiScan docs compliance)
Per LegiScan's guidelines ("Use the hashes. No. Really. Use them."):
- Bills are cached in browser `localStorage` for 6 hours
- Each bill has a `change_hash` — we only re-fetch bills whose hash has changed
- This means ~9 queries on first load, then 1 query per 6-hour refresh cycle
- Fallback: if LegiScan is unreachable, 8 mock Hawaii State Legislature bills are shown

---

## Key Files
```
hawaii-testify/
├── api/
│   └── legiscan.js          # Vercel serverless proxy (keeps API key secret)
├── src/
│   ├── App.jsx              # Main router and state manager
│   ├── components/
│   │   ├── Onboarding.jsx   # 3-step onboarding (island → role → interests)
│   │   ├── SwipeFeed.jsx    # Tinder-style bill swipe UI
│   │   ├── Prompts.jsx      # For/Against + reason + story inputs
│   │   ├── TestimonyView.jsx# Generated testimony display + copy
│   │   └── SubmitScreen.jsx # Step-by-step submission instructions
│   ├── data/
│   │   ├── bills.js         # Mock bill fallback data
│   │   └── options.js       # Islands, roles, interest tags
│   └── utils/
│       ├── legiscan.js      # API client with hash-based caching
│       ├── billTransform.js # Converts LegiScan format → app format
│       ├── testimony.js     # Template-based testimony generator
│       └── storage.js       # localStorage helpers
```

---

## Data Sources
- **Live bills:** Hawaii State Legislature via LegiScan API — fetches real HB/SB bills from the current session
- **Submit links:** https://www.capitol.hawaii.gov/ (official Hawaii Legislature site)
- **Testimony email:** testimony@capitol.hawaii.gov

---

## How to Update Bills (Manual Override)
Edit `src/data/bills.js` — these are the fallback mock bills shown when the API is unavailable. To find real bill numbers: https://www.capitol.hawaii.gov/

---

## How to Run Locally
```bash
cd /Users/mayusystems/hawaii-testify
npm run dev
# Opens at http://localhost:5173
# Note: LegiScan API won't work locally (no serverless function).
# App will fall back to mock bills automatically.
```

## How to Deploy Updates
```bash
git add .
git commit -m "your message"
git push
# Vercel auto-deploys within ~60 seconds
```

---

## Future Ideas
- Add a "Saved Bills" tab to review past testimonies
- Connect to Supabase for user accounts and testimony history
- Add AI-generated plain-English summaries using Claude API
- Support Honolulu City Council bills (separate data source needed — not on LegiScan)
- Add push notifications for upcoming hearing dates
- Multi-language support (Hawaiian, Ilocano, Tagalog, Japanese)

---

*Built with Claude Code + Vercel · February 2026*
