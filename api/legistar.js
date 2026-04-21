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
