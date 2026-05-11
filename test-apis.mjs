// Test suite for HawaiiTestify API transform logic
// Run with: node test-apis.mjs
// No network needed — tests data transformation with fixture data

import { transformBill } from "./src/utils/billTransform.js";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ✗  ${name}`);
    console.log(`     → ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "assertion failed");
}

function assertEqual(a, b) {
  if (a !== b) throw new Error(`expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── Fixture: a realistic LegiScan getBill response ──────────────────────────

const RAW_HOUSING_BILL = {
  bill_id: 1234567,
  bill_number: "HB 1234",
  bill_type: "B",
  body: "H",
  title: "RELATING TO SHORT-TERM RENTALS",
  description: "Caps short-term vacation rentals in residential neighborhoods statewide.",
  subjects: [{ subject_id: 1, subject_name: "Housing" }],
  committee: { name: "Housing" },
  referrals: [],
  calendar: [
    { date: "2027-03-15", time: "09:00:00", location: "Hawaii State Capitol, Room 325" },
    { date: "2026-01-01", time: "10:00:00", location: "Old Event" }, // past, should be ignored
  ],
  state_link: "https://www.capitol.hawaii.gov/session/measure_indiv.aspx?billtype=HB&billnumber=1234&year=2026",
};

const RAW_ENV_SENATE_BILL = {
  bill_id: 9999999,
  bill_number: "SB 2361",
  bill_type: "B",
  body: "S",
  title: "RELATING TO SINGLE-USE PLASTICS",
  description: "Prohibits sale and distribution of single-use plastic service ware.",
  subjects: [{ subject_id: 2, subject_name: "Environment" }],
  committee: { name: "Health and Human Services" },
  referrals: [],
  calendar: [],
  state_link: "https://www.capitol.hawaii.gov/",
};

const RAW_UNKNOWN_BILL = {
  bill_id: 111,
  bill_number: "HB 999",
  bill_type: "B",
  body: "H",
  title: "RELATING TO ADMINISTRATIVE PROCEDURES",
  description: "",
  subjects: [],
  committee: null,
  referrals: [],
  calendar: [],
  state_link: null,
};

// ─── Tests: transformBill ─────────────────────────────────────────────────────

console.log("\nLegiScan transformBill");

test("returns correct id and legiscanId", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assertEqual(b.id, "1234567");
  assertEqual(b.legiscanId, 1234567);
});

test("parses HB type and number correctly", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assertEqual(b.type, "HB");
  assertEqual(b.number, "1234");
});

test("parses SB type correctly", () => {
  const b = transformBill(RAW_ENV_SENATE_BILL);
  assertEqual(b.type, "SB");
});

test("humanizes title (strips RELATING TO, title-cases)", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assertEqual(b.plainTitle, "Short-Term Rentals");
});

test("detects housing topic → correct emoji and gradient", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assertEqual(b.emoji, "🏠");
  assertEqual(b.gradientFrom, "#075985");
  assert(b.tags.includes("housing"), "tags should include housing");
});

test("detects environment topic for plastics bill", () => {
  const b = transformBill(RAW_ENV_SENATE_BILL);
  assertEqual(b.emoji, "🌊");
  assert(b.tags.includes("environment"), "tags should include environment");
});

test("falls back to default style for unknown topic", () => {
  const b = transformBill(RAW_UNKNOWN_BILL);
  assertEqual(b.emoji, "📋");
  assert(b.tags.includes("general"), "should fall back to general tag");
});

test("uses description when long enough", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assert(b.summary === RAW_HOUSING_BILL.description, "should use real description");
});

test("generates fallback summary when description is empty", () => {
  const b = transformBill(RAW_UNKNOWN_BILL);
  assert(b.summary.length > 20, "should generate a fallback summary");
});

test("committee uses chamber prefix + name", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assertEqual(b.committee, "House Housing Committee");
});

test("Senate committee prefix is Senate", () => {
  const b = transformBill(RAW_ENV_SENATE_BILL);
  assertEqual(b.committee, "Senate Health and Human Services Committee");
});

test("committee falls back gracefully when null", () => {
  const b = transformBill(RAW_UNKNOWN_BILL);
  assertEqual(b.committee, "House Committee");
});

test("stateLink falls back to capitol.hawaii.gov", () => {
  const b = transformBill(RAW_UNKNOWN_BILL);
  assertEqual(b.stateLink, "https://www.capitol.hawaii.gov/");
});

test("picks only the NEXT upcoming hearing (ignores past dates)", () => {
  const b = transformBill(RAW_HOUSING_BILL);
  assert(b.hearingDate.includes("2027"), `expected 2027 hearing, got: ${b.hearingDate}`);
  assertEqual(b.location, "Hawaii State Capitol, Room 325");
});

test("hearing TBD when calendar is empty", () => {
  const b = transformBill(RAW_ENV_SENATE_BILL);
  assertEqual(b.hearingDate, "Hearing date TBD");
});

// ─── Tests: Legistar transform (inline, no module import needed) ──────────────

console.log("\nLegistar transformMatter (inline)");

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
    .replace(/\bOf\b/g, "of").replace(/\bTo\b/g, "to")
    .replace(/\bAnd\b/g, "and").replace(/\bThe\b/g, "the")
    .replace(/\bIn\b/g, "in").replace(/\bFor\b/g, "for");
}

const RAW_MATTER = {
  MatterId: 55555,
  MatterFile: "Bill 50 (2025)",
  MatterTitle: "RELATING TO SHORT-TERM RENTALS IN RESIDENTIAL ZONES",
  MatterName: "Short-Term Rentals in Residential Zones",
  MatterTypeName: "Bill",
  MatterBodyName: "Zoning and Planning Committee",
  MatterStatusName: "In Committee",
  MatterAgendaDate: "2026-06-10T00:00:00",
};

const RAW_RESOLUTION = {
  MatterId: 77777,
  MatterFile: "Resolution 25-180",
  MatterTitle: "SUPPORTING RAIL TRANSIT COMPLETION",
  MatterName: "Rail Transit Funding",
  MatterTypeName: "Resolution",
  MatterBodyName: "Transportation Committee",
  MatterStatusName: "In Committee",
  MatterAgendaDate: null,
};

test("parseMatterType: Bill", () => assertEqual(parseMatterType("Bill"), "Bill"));
test("parseMatterType: Resolution → Res", () => assertEqual(parseMatterType("Resolution"), "Res"));
test("parseMatterType: Ordinance → Ord", () => assertEqual(parseMatterType("Ordinance"), "Ord"));
test("parseMatterType: empty string → Bill", () => assertEqual(parseMatterType(""), "Bill"));

test("parseMatterNumber extracts leading digits", () => {
  assertEqual(parseMatterNumber("Bill 50 (2025)"), "50");
});
test("parseMatterNumber extracts hyphenated number", () => {
  assertEqual(parseMatterNumber("Resolution 25-180"), "25-180");
});
test("parseMatterNumber: null returns ?", () => {
  assertEqual(parseMatterNumber(null), "?");
});

test("humanizeTitle strips RELATING TO", () => {
  assertEqual(humanizeTitle("RELATING TO SHORT-TERM RENTALS"), "Short-Term Rentals");
});
test("humanizeTitle lowercases articles", () => {
  const result = humanizeTitle("RELATING TO FUNDING OF THE RAIL");
  assert(result.includes(" of ") || result.includes(" the "), `got: ${result}`);
});
test("humanizeTitle: empty string returns empty", () => {
  assertEqual(humanizeTitle(""), "");
});

// ─── Tests: Cache logic (pure JS) ────────────────────────────────────────────

console.log("\nCache freshness logic");

function cacheIsFresh(cache, hoursAgo = 0) {
  if (!cache?.cachedAt) return false;
  const age = (Date.now() - cache.cachedAt) / 1000 / 60 / 60;
  return age < 6;
}

test("fresh cache (just saved) is fresh", () => {
  assert(cacheIsFresh({ cachedAt: Date.now() }), "should be fresh");
});

test("cache from 7 hours ago is stale", () => {
  const sevenHoursAgo = Date.now() - 7 * 60 * 60 * 1000;
  assert(!cacheIsFresh({ cachedAt: sevenHoursAgo }), "should be stale");
});

test("cache from 5.9 hours ago is still fresh", () => {
  const almostSix = Date.now() - 5.9 * 60 * 60 * 1000;
  assert(cacheIsFresh({ cachedAt: almostSix }), "should still be fresh");
});

test("null cache returns false", () => {
  assert(!cacheIsFresh(null), "null cache is not fresh");
});

test("cache with missing cachedAt returns false", () => {
  assert(!cacheIsFresh({}), "missing cachedAt is not fresh");
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
