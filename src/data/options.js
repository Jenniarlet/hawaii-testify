// =============================================================================
// src/data/options.js — Onboarding Picklist Data
// =============================================================================
// What it is:
//   Static lists of options shown during the 3-step onboarding flow.
//   No API — this is hardcoded reference data that rarely changes.
//
// Exports:
//   ISLANDS    →  The 6 main Hawaiian islands (used in step 1 of onboarding)
//   ROLES      →  Community roles (resident, teacher, etc.) — used in step 2
//                 Role is embedded in the testimony letter ("As a teacher...")
//   INTERESTS  →  Topic tags (housing, environment, etc.) — used in step 3
//                 Matched against bill.tags[] in SwipeFeed to surface relevant
//                 bills first in the swipe stack
//
// Used by: src/components/Onboarding.jsx
//          src/utils/testimony.js (ROLE_LABELS maps role id → letter text)
// =============================================================================

export const ISLANDS = [
  { id: "oahu", label: "Oʻahu", emoji: "🌆" },
  { id: "maui", label: "Maui", emoji: "🌄" },
  { id: "hawaii", label: "Hawaiʻi Island", emoji: "🌋" },
  { id: "kauai", label: "Kauaʻi", emoji: "🌿" },
  { id: "molokai", label: "Molokaʻi", emoji: "🏝️" },
  { id: "lanai", label: "Lānaʻi", emoji: "🌅" },
];

export const ROLES = [
  { id: "resident", label: "Resident", emoji: "🏘️" },
  { id: "parent", label: "Parent", emoji: "👨‍👩‍👧" },
  { id: "student", label: "Student", emoji: "🎓" },
  { id: "teacher", label: "Teacher / Educator", emoji: "📖" },
  { id: "business", label: "Business Owner", emoji: "💼" },
  { id: "healthcare", label: "Healthcare Worker", emoji: "🩺" },
  { id: "native_hawaiian", label: "Native Hawaiian", emoji: "🌺" },
  { id: "environmental", label: "Environmental Advocate", emoji: "🌿" },
  { id: "veteran", label: "Veteran", emoji: "🎖️" },
  { id: "retiree", label: "Retiree / Kūpuna", emoji: "🌸" },
];

export const INTERESTS = [
  { id: "housing", label: "Housing", emoji: "🏠" },
  { id: "environment", label: "Environment", emoji: "🌊" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "healthcare", label: "Healthcare", emoji: "❤️‍🩹" },
  { id: "small business", label: "Small Business", emoji: "🛍️" },
  { id: "Native Hawaiian rights", label: "Native Hawaiian Rights", emoji: "🌺" },
  { id: "tourism", label: "Tourism", emoji: "🐠" },
  { id: "transportation", label: "Transportation", emoji: "🚌" },
  { id: "public safety", label: "Public Safety", emoji: "🛡️" },
];
