// Vercel serverless function — proxies LegiScan requests
// API key lives here on the server, never exposed to the browser

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
