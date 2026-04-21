// =============================================================================
// api/legistar.js — Vercel Serverless Proxy for the Honolulu Legistar API
// =============================================================================
// What it is:
//   A server-side proxy function that forwards requests to the Honolulu City
//   Council's Legistar API. Unlike LegiScan, this API is completely free and
//   public — no API key is required. The proxy exists to avoid CORS issues and
//   to add edge caching via Vercel's CDN.
//
// Data source:
//   Legistar Web API (by Granicus) — https://webapi.legistar.com/v1/honolulu/
//   Public portal:  https://honolulu.legistar.com/
//   API help docs:  https://webapi.legistar.com/Help
//   Authentication: None required — fully public
//
// How it works:
//   The browser calls /api/legistar?path=matters&$filter=... (our own URL).
//   The `path` param becomes the URL segment (e.g. "matters").
//   All other query params are forwarded as OData filters to Legistar.
//   Example upstream URL built:
//     https://webapi.legistar.com/v1/honolulu/matters?$filter=MatterStatusName eq 'In Committee'
//
// Covers: Honolulu City Council Bills, Resolutions, and Ordinances (Oʻahu only)
// =============================================================================

export default async function handler(req, res) {
  const { path, ...params } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const base = `https://webapi.legistar.com/v1/honolulu/${path}`;
  const qs = new URLSearchParams(params).toString();
  const url = qs ? `${base}?${qs}` : base;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=3600");
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
