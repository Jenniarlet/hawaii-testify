import { MOCK_COUNTY_BILLS } from "../data/bills";

const CACHE_KEY = "ht_legistar_cache";
const CACHE_HOURS = 6;
const MAX_BILLS = 5;

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || null;
  } catch {
    return null;
  }
}

function setCache(bills) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ bills, cachedAt: Date.now() })
  );
}

function cacheIsFresh(cache) {
  if (!cache?.cachedAt) return false;
  const age = (Date.now() - cache.cachedAt) / 1000 / 60 / 60;
  return age < CACHE_HOURS;
}

async function apiCall(path, params = {}) {
  const qs = new URLSearchParams({ path, ...params }).toString();
  const res = await fetch(`/api/legistar?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const TOPIC_STYLES = [
  {
    keywords: ["housing", "rent", "landlord", "tenant", "mortgage", "homeless", "affordable", "rental", "vacation rental"],
    emoji: "🏠", gradientFrom: "#075985", gradientTo: "#0c4a6e", tags: ["housing"],
  },
  {
    keywords: ["environment", "climate", "ocean", "reef", "water", "energy", "pollution", "plastic", "carbon", "tree", "canopy", "stormwater"],
    emoji: "🌊", gradientFrom: "#166534", gradientTo: "#052e16", tags: ["environment"],
  },
  {
    keywords: ["education", "school", "teacher", "student", "university", "college", "keiki"],
    emoji: "📚", gradientFrom: "#92400e", gradientTo: "#451a03", tags: ["education"],
  },
  {
    keywords: ["health", "medical", "medicaid", "medicare", "hospital", "mental", "dental", "vision"],
    emoji: "❤️‍🩹", gradientFrom: "#9f1239", gradientTo: "#4c0519", tags: ["healthcare"],
  },
  {
    keywords: ["business", "tax", "economic", "commerce", "small business", "entrepreneur", "tourism", "visitor", "fee"],
    emoji: "🛍️", gradientFrom: "#6d28d9", gradientTo: "#3b0764", tags: ["small business"],
  },
  {
    keywords: ["transport", "highway", "road", "rail", "bus", "traffic", "pedestrian", "bike", "skyline", "transit"],
    emoji: "🚌", gradientFrom: "#1d4ed8", gradientTo: "#1e3a8a", tags: ["transportation"],
  },
  {
    keywords: ["land", "zoning", "farm", "agriculture", "conservation", "park", "trail", "open space"],
    emoji: "🌿", gradientFrom: "#0f766e", gradientTo: "#134e4a", tags: ["environment"],
  },
  {
    keywords: ["police", "fire", "safety", "crime", "emergency", "911"],
    emoji: "🛡️", gradientFrom: "#1e3a5f", gradientTo: "#0f1f3d", tags: ["public safety"],
  },
];

const DEFAULT_STYLE = {
  emoji: "🏛️", gradientFrom: "#374151", gradientTo: "#111827", tags: ["general"],
};

function detectStyle(text) {
  const lower = text.toLowerCase();
  for (const style of TOPIC_STYLES) {
    if (style.keywords.some((kw) => lower.includes(kw))) return style;
  }
  return DEFAULT_STYLE;
}

function parseMatterType(matterTypeName) {
  const type = (matterTypeName || "").toLowerCase();
  if (type.includes("resolution")) return "Res";
  if (type.includes("ordinance")) return "Ord";
  return "Bill";
}

function parseMatterNumber(matterFile) {
  const match = matterFile?.match(/(\d[\d-]*)/);
  return match ? match[1] : matterFile || "?";
}

function humanizeTitle(raw) {
  if (!raw) return "";
  return raw
    .replace(/^RELATING TO /i, "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bOf\b/g, "of")
    .replace(/\bTo\b/g, "to")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bThe\b/g, "the")
    .replace(/\bIn\b/g, "in")
    .replace(/\bFor\b/g, "for");
}

function formatHearingDate(dateStr) {
  if (!dateStr) return "Hearing date TBD";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  } catch {
    return "Hearing date TBD";
  }
}

function transformMatter(matter) {
  const titleText = matter.MatterTitle || matter.MatterName || "";
  const style = detectStyle(titleText);
  const type = parseMatterType(matter.MatterTypeName);
  const number = parseMatterNumber(matter.MatterFile);

  const summary =
    titleText.length > 40
      ? titleText
      : `${matter.MatterTypeName || "Bill"} ${matter.MatterFile} before the Honolulu City Council.`;

  return {
    id: `legistar-${matter.MatterId}`,
    type,
    number,
    title: titleText.toUpperCase(),
    plainTitle: humanizeTitle(matter.MatterName || matter.MatterTitle),
    summary,
    committee: matter.MatterBodyName || "Honolulu City Council",
    hearingDate: formatHearingDate(matter.MatterAgendaDate),
    hearingTime: "",
    location: "Honolulu Hale, 530 S King St",
    stateLink: `https://honolulu.legistar.com/LegislationDetail.aspx?ID=${matter.MatterId}`,
    tags: style.tags,
    emoji: style.emoji,
    gradientFrom: style.gradientFrom,
    gradientTo: style.gradientTo,
    source: "county",
  };
}

export async function fetchHonoluluBills() {
  const cache = getCache();
  if (cacheIsFresh(cache)) {
    console.log("[Legistar] Serving from cache");
    return cache.bills;
  }

  try {
    const matters = await apiCall("matters", {
      "$filter": "MatterStatusName eq 'In Committee'",
      "$top": "20",
      "$orderby": "MatterLastModifiedUtc desc",
    });

    if (!Array.isArray(matters) || !matters.length) {
      throw new Error("No matters returned");
    }

    const bills = matters.map(transformMatter).slice(0, MAX_BILLS);
    setCache(bills);
    console.log(`[Legistar] Fetched ${bills.length} Honolulu City Council bills`);
    return bills;
  } catch (err) {
    console.warn("[Legistar] API unavailable, using mock county bills:", err.message);
    return MOCK_COUNTY_BILLS;
  }
}
