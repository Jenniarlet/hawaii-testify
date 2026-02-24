// LegiScan API client
// - Routes through /api/legiscan (Vercel serverless) to keep key server-side
// - Caches bills in localStorage using change_hash to minimize query spend
// - Falls back to mock bills if API is unavailable

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
