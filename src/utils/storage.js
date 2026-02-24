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
