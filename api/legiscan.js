// =============================================================================
// api/legiscan.js — Vercel Serverless Proxy for LegiScan
// =============================================================================
// What it is:
//   A server-side proxy function that sits between the browser and the
//   LegiScan REST API. Because this runs on Vercel's servers (not in the
//   browser), the secret API key is never exposed to end users.
//
// Data source:
//   LegiScan REST API — https://api.legiscan.com/
//   Account portal:   https://legiscan.com/legiscan
//   API docs:         https://legiscan.com/gaits/documentation/legiscan
//   Plan: Free public tier — 30,000 queries/month, resets the 1st of each month
//
// How it works:
//   The browser calls /api/legiscan?op=getSearch&... (our own URL).
//   This function receives that request, adds the secret API key from the
//   Vercel environment variable LEGISCAN_KEY, forwards everything to
//   https://api.legiscan.com/, and returns the raw JSON response.
//
// Covers: Hawaii State Legislature bills (HB = House Bills, SB = Senate Bills)
// =============================================================================

export default async function handler(req, res) {
  const { op, ...params } = req.query;

  if (!op) {
    return res.status(400).json({ status: "ERROR", message: "Missing op parameter" });
  }

  const url = new URL("https://api.legiscan.com/");
  url.searchParams.set("apikey", process.env.LEGISCAN_KEY);
  url.searchParams.set("op", op);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=3600");
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ status: "ERROR", message: err.message });
  }
}
