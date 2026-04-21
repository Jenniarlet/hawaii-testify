// =============================================================================
// src/utils/billTransform.js — LegiScan Bill Transformer
// =============================================================================
// What it is:
//   Converts the raw JSON shape returned by LegiScan's getBill API call into
//   the canonical bill object shape that all HawaiiTestify components expect.
//   Used exclusively by src/utils/legiscan.js (one call per new/changed bill).
//
//   Note: Legistar (City Council) bills have their own inline transformer
//   inside src/utils/legistar.js, since the Legistar data shape is different.
//
// What it does:
//   - Detects topic category (housing, environment, education, etc.) from the
//     bill title and subject tags → assigns emoji, gradient colors, and topic tags
//   - Humanizes the title (strips "RELATING TO", converts to title case)
//   - Extracts the next upcoming hearing date/time/location from the calendar
//   - Formats the committee name with the correct chamber prefix (House/Senate)
//   - Generates a fallback summary if the bill description is too short
//
// Input:  Raw LegiScan bill object (from getBill response → response.bill)
// Output: Canonical bill shape used throughout the app (see src/data/bills.js
//         for the full shape definition)
// =============================================================================

const TOPIC_STYLES = [
  {
    keywords: ["housing", "rent", "landlord", "tenant", "mortgage", "homeless"],
    emoji: "🏠", gradientFrom: "#075985", gradientTo: "#0c4a6e", tags: ["housing"],
  },
  {
    keywords: ["environment", "climate", "ocean", "reef", "water", "energy", "pollution", "plastic", "carbon"],
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
    keywords: ["business", "tax", "economic", "commerce", "small business", "entrepreneur", "tourism", "visitor"],
    emoji: "🛍️", gradientFrom: "#6d28d9", gradientTo: "#3b0764", tags: ["small business"],
  },
  {
    keywords: ["hawaiian", "native", "aloha", "aina", "ahupuaa", "heiau", "sovereignty", "oha"],
    emoji: "🌺", gradientFrom: "#9f1239", gradientTo: "#4c0519", tags: ["Native Hawaiian rights"],
  },
  {
    keywords: ["transport", "highway", "road", "rail", "bus", "traffic", "pedestrian", "bike"],
    emoji: "🚌", gradientFrom: "#1d4ed8", gradientTo: "#1e3a8a", tags: ["transportation"],
  },
  {
    keywords: ["land", "zoning", "farm", "agriculture", "conservation", "park", "trail"],
    emoji: "🌿", gradientFrom: "#0f766e", gradientTo: "#134e4a", tags: ["environment"],
  },
];

const DEFAULT_STYLE = {
  emoji: "📋", gradientFrom: "#374151", gradientTo: "#111827", tags: ["general"],
};

function detectStyle(title, subjects = []) {
  const text = [title, ...subjects.map((s) => s.subject_name || "")]
    .join(" ")
    .toLowerCase();

  for (const style of TOPIC_STYLES) {
    if (style.keywords.some((kw) => text.includes(kw))) return style;
  }
  return DEFAULT_STYLE;
}

function humanizeTitle(rawTitle) {
  return rawTitle
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

function getHearingInfo(calendar = []) {
  const upcoming = calendar
    .filter((c) => c.date && new Date(c.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!upcoming.length) {
    return {
      hearingDate: "Hearing date TBD",
      hearingTime: "",
      location: "Hawaii State Capitol, Honolulu",
    };
  }

  const next = upcoming[0];
  const dateStr = new Date(next.date).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
  const timeStr = next.time
    ? next.time.slice(0, 5).replace(/^0/, "") + (next.time < "12" ? " AM" : " PM")
    : "";

  return {
    hearingDate: dateStr,
    hearingTime: timeStr,
    location: next.location || "Hawaii State Capitol, Honolulu",
  };
}

export function transformBill(bill) {
  const style = detectStyle(bill.title, bill.subjects);
  const { hearingDate, hearingTime, location } = getHearingInfo(bill.calendar);

  const committeeRaw = bill.committee?.name || bill.referrals?.[0]?.name || "";
  const chamberPrefix = bill.body === "H" ? "House" : "Senate";
  const committee = committeeRaw
    ? `${chamberPrefix} ${committeeRaw} Committee`
    : `${chamberPrefix} Committee`;

  const summary =
    bill.description && bill.description.length > 40
      ? bill.description
      : `This bill ${bill.title.toLowerCase().replace(/^RELATING TO /i, "relates to ")}. See the full text at the Hawaii State Legislature website for complete details.`;

  return {
    id: String(bill.bill_id),
    legiscanId: bill.bill_id,
    type: bill.bill_type === "B" ? (bill.body === "H" ? "HB" : "SB") : bill.bill_type,
    number: bill.bill_number?.replace(/[A-Z]+\s*/i, "") || bill.bill_id,
    title: bill.title,
    plainTitle: humanizeTitle(bill.title),
    summary,
    committee,
    hearingDate,
    hearingTime,
    location,
    stateLink: bill.state_link || "https://www.capitol.hawaii.gov/",
    tags: style.tags,
    emoji: style.emoji,
    gradientFrom: style.gradientFrom,
    gradientTo: style.gradientTo,
  };
}
