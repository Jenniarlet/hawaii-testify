// =============================================================================
// src/utils/legiscan.js — LegiScan API Client (Hawaii State Legislature)
// =============================================================================
// What it is:
//   The browser-side client for fetching Hawaii State Legislature bills.
//   Calls our own /api/legiscan proxy (never LegiScan directly) so the
//   secret API key stays server-side.
//
// Data source:
//   LegiScan REST API via /api/legiscan proxy → https://api.legiscan.com/
//   Covers: HB (House Bills) and SB (Senate Bills) for the current Hawaii session
//
// Caching strategy (per LegiScan's own guidelines — "use the hashes"):
//   1. On first load: calls getSearch (1 query) to get up to 20 bills + their change_hash
//   2. Compares each bill's change_hash to what's stored in localStorage
//   3. Only calls getBill (1 query each) for bills whose hash has changed (max 10)
//   4. Unchanged bills are served directly from localStorage cache
//   5. The full result set is cached for 6 hours before the next refresh cycle
//   → Typical usage: ~9–11 queries on first load, then 1 query per 6-hour cycle
//
// localStorage keys used:
//   ht_legiscan_cache  →  { bills, hashes, cachedAt }
//
// Fallback: if the API is unreachable (offline, quota exceeded, etc.),
//   returns MOCK_BILLS from src/data/bills.js — app stays functional
// =============================================================================

import { MOCK_BILLS } from "../data/bills";
import { transformBill } from "./billTransform";

const CACHE_KEY = "ht_legiscan_cache";
const CACHE_HOURS = 6;

function getCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || null;
  } catch {
    return null;
  }
}

function setCache(bills, hashes) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ bills, hashes, cachedAt: Date.now() })
  );
}

function cacheIsFresh(cache) {
  if (!cache?.cachedAt) return false;
  const age = (Date.now() - cache.cachedAt) / 1000 / 60 / 60;
  return age < CACHE_HOURS;
}

async function apiCall(op, params = {}) {
  const qs = new URLSearchParams({ op, ...params }).toString();
  const res = await fetch(`/api/legiscan?${qs}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== "OK") throw new Error(data.alert?.message || "LegiScan error");
  return data;
}

export async function fetchHawaiiBills() {
  // 1. Return fresh cache if available (saves queries)
  const cache = getCache();
  if (cacheIsFresh(cache)) {
    console.log("[LegiScan] Serving from cache");
    return cache.bills;
  }

  try {
    // 2. Search for current Hawaii state bills (costs 1 query)
    const searchData = await apiCall("getSearch", {
      state: "HI",
      query: "",
      year: "2",
    });

    const results = Object.values(searchData.searchresult).filter(
      (r) => r && typeof r === "object" && r.bill_id
    );

    if (!results.length) throw new Error("No bills returned");

    // 3. Determine which bills need a fresh fetch using change_hash
    const oldHashes = cache?.hashes || {};
    const toFetch = results
      .slice(0, 20)
      .filter((r) => oldHashes[r.bill_id] !== r.change_hash)
      .slice(0, 10); // max 10 getBill calls per refresh

    const unchanged = results
      .slice(0, 20)
      .filter((r) => oldHashes[r.bill_id] === r.change_hash && cache?.bills)
      .map((r) => cache.bills.find((b) => b.legiscanId === r.bill_id))
      .filter(Boolean);

    // 4. Fetch full details only for new/changed bills (1 query each)
    const freshBills = await Promise.all(
      toFetch.map(async (r) => {
        try {
          const billData = await apiCall("getBill", { id: r.bill_id });
          return transformBill(billData.bill);
        } catch {
          return null;
        }
      })
    );

    const allBills = [...freshBills.filter(Boolean), ...unchanged].slice(0, 8);

    if (!allBills.length) throw new Error("No bills could be transformed");

    // 5. Update cache with new hashes
    const newHashes = {};
    results.slice(0, 20).forEach((r) => {
      newHashes[r.bill_id] = r.change_hash;
    });

    setCache(allBills, newHashes);
    console.log(`[LegiScan] Fetched ${freshBills.filter(Boolean).length} new, ${unchanged.length} from cache`);
    return allBills;
  } catch (err) {
    console.warn("[LegiScan] API unavailable, using mock bills:", err.message);
    // Fall back to mock bills — app still works offline or during dev
    return MOCK_BILLS;
  }
}
