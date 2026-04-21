// =============================================================================
// src/utils/storage.js — Browser localStorage Helpers
// =============================================================================
// What it is:
//   Simple read/write helpers for persisting user data between sessions.
//   All data stays on the user's device — nothing is sent to a server.
//
// Keys stored in localStorage:
//   ht_profile  →  User's onboarding answers: { island, role, interests[] }
//                  Written by Onboarding.jsx, read by App.jsx and testimony.js
//   ht_swipes   →  History of bills the user has swiped on: [{ billId, ... }]
//                  Currently saved but not yet displayed (future: "Saved Bills" tab)
//
// Note: Bill cache keys (ht_legiscan_cache, ht_legistar_cache) are managed
//   directly inside legiscan.js and legistar.js respectively, not here.
// =============================================================================

const PROFILE_KEY = "ht_profile";
const SWIPES_KEY = "ht_swipes";

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null;
  } catch {
    return null;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getSwipes() {
  try {
    return JSON.parse(localStorage.getItem(SWIPES_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveSwipe(swipeData) {
  const swipes = getSwipes();
  const existing = swipes.findIndex((s) => s.billId === swipeData.billId);
  if (existing >= 0) {
    swipes[existing] = swipeData;
  } else {
    swipes.push(swipeData);
  }
  localStorage.setItem(SWIPES_KEY, JSON.stringify(swipes));
}

export function clearAll() {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(SWIPES_KEY);
}
