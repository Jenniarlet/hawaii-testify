// =============================================================================
// src/data/bills.js — Mock Fallback Bill Data
// =============================================================================
// What it is:
//   Hardcoded bill objects used as fallback data when the live APIs are
//   unavailable (offline, quota exceeded, local dev without Vercel functions).
//   The app automatically falls back to these — users never see an error screen.
//
// Exports:
//   MOCK_BILLS         →  8 Hawaii State Legislature bills (HB/SB)
//                         Shown when LegiScan API is unreachable
//                         In production, real bills from https://api.legiscan.com/ replace these
//
//   MOCK_COUNTY_BILLS  →  3 Honolulu City Council bills (Bills/Resolutions)
//                         Shown when Legistar API is unreachable
//                         In production, real bills from https://webapi.legistar.com/v1/honolulu/ replace these
//
// Canonical bill shape (all fields every component expects):
//   { id, type, number, title, plainTitle, summary, committee,
//     hearingDate, hearingTime, location, stateLink, tags, emoji,
//     gradientFrom, gradientTo, source }
//   source: "state" = Hawaii State Legislature | "county" = Honolulu City Council
//
// ⚠️  Bill numbers are session-specific. Verify any mock bill numbers against:
//     Hawaii Legislature: https://www.capitol.hawaii.gov/
//     LegiScan Hawaii:    https://legiscan.com/HI
// =============================================================================

export const MOCK_BILLS = [
  {
    id: "mock-hb1234",
    type: "HB", number: "1234",
    title: "RELATING TO SHORT-TERM RENTALS",
    plainTitle: "Limit Airbnb-Style Rentals to Protect Local Housing",
    summary: "Caps short-term vacation rentals in residential neighborhoods statewide and requires an annual state permit. Aimed at returning rental units to long-term residents priced out by vacation rental demand across Hawaii.",
    committee: "House Housing Committee",
    hearingDate: "March 14, 2026", hearingTime: "9:00 AM",
    location: "Hawaii State Capitol, Room 325",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["housing"], emoji: "🏠",
    gradientFrom: "#075985", gradientTo: "#0c4a6e",
    source: "state",
  },
  {
    id: "mock-sb456",
    type: "SB", number: "456",
    title: "RELATING TO CLEAN ENERGY",
    plainTitle: "Move Hawaii to 100% Renewable Energy by 2030",
    summary: "Moves Hawaii's clean energy deadline from 2045 to 2030 and creates a $200M fund for rooftop solar and battery storage in low-income communities. This would make Hawaii the first U.S. state to fully eliminate fossil fuel electricity.",
    committee: "Senate Energy & Environment Committee",
    hearingDate: "March 18, 2026", hearingTime: "10:00 AM",
    location: "Hawaii State Capitol, Room 414",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["environment"], emoji: "☀️",
    gradientFrom: "#166534", gradientTo: "#052e16",
    source: "state",
  },
  {
    id: "mock-hb789",
    type: "HB", number: "789",
    title: "RELATING TO TEACHER COMPENSATION",
    plainTitle: "Give Hawaii Teachers a 20% Pay Raise",
    summary: "Increases starting teacher salaries from $49,000 to $60,000 and creates a $5,000 annual retention bonus. Hawaii ranks last in teacher retention among all 50 states.",
    committee: "House Education Committee",
    hearingDate: "March 20, 2026", hearingTime: "9:30 AM",
    location: "Hawaii State Capitol, Room 308",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["education"], emoji: "📚",
    gradientFrom: "#92400e", gradientTo: "#451a03",
    source: "state",
  },
  {
    id: "mock-sb321",
    type: "SB", number: "321",
    title: "RELATING TO MEDICAID",
    plainTitle: "Add Dental & Vision to Hawaii Medicaid Coverage",
    summary: "Expands Hawaii's QUEST Integration Medicaid program to include dental cleanings, fillings, eyeglasses, and vision exams for the 380,000 Hawaii residents currently enrolled.",
    committee: "Senate Health Committee",
    hearingDate: "March 22, 2026", hearingTime: "1:00 PM",
    location: "Hawaii State Capitol, Room 224",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["healthcare"], emoji: "❤️‍🩹",
    gradientFrom: "#9f1239", gradientTo: "#4c0519",
    source: "state",
  },
  {
    id: "mock-hb567",
    type: "HB", number: "567",
    title: "RELATING TO SMALL BUSINESS RELIEF",
    plainTitle: "Tax Credits for Hawaii's Small Businesses",
    summary: "Provides a 15% state income tax credit for small businesses with fewer than 25 employees and waives GET for the first $100,000 of revenue for new businesses in their first two years.",
    committee: "House Economic Development Committee",
    hearingDate: "March 25, 2026", hearingTime: "2:00 PM",
    location: "Hawaii State Capitol, Room 312",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["small business"], emoji: "🛍️",
    gradientFrom: "#6d28d9", gradientTo: "#3b0764",
    source: "state",
  },
  {
    id: "mock-sb890",
    type: "SB", number: "890",
    title: "RELATING TO NATIVE HAWAIIAN AFFAIRS",
    plainTitle: "Increase Funding for Native Hawaiian Programs",
    summary: "Allocates $30M to the Office of Hawaiian Affairs for Native Hawaiian language immersion programs, ʻāina stewardship, and affordable housing on homestead lands.",
    committee: "Senate Hawaiian Affairs Committee",
    hearingDate: "March 27, 2026", hearingTime: "9:00 AM",
    location: "Hawaii State Capitol, Room 414",
    stateLink: "https://www.capitol.hawaii.gov/",
    tags: ["Native Hawaiian rights"], emoji: "🌺",
    gradientFrom: "#9f1239", gradientTo: "#4c0519",
    source: "state",
  },
  {
    id: "mock-hb1949",
    type: "HB", number: "1949",
    title: "RELATING TO THE GREEN FEE",
    plainTitle: "Charge Visitors an Environmental Fee to Protect Hawaii's Parks & Beaches",
    summary: "Establishes an Environmental Stewardship Fee Program to collect a fee from visitors for the usage of Hawaii's state-owned beaches, parks, and trails. Revenue funds reef restoration, trail maintenance, and reducing overcrowding at popular natural sites.",
    committee: "House Tourism Committee",
    hearingDate: "TBD", hearingTime: "",
    location: "Hawaii State Capitol",
    stateLink: "https://www.capitol.hawaii.gov/session/measure_indiv.aspx?billtype=HB&billnumber=1949&year=2026",
    tags: ["tourism", "environment"], emoji: "🐠",
    gradientFrom: "#0f766e", gradientTo: "#134e4a",
    source: "state",
  },
  {
    id: "mock-sb2361",
    type: "SB", number: "2361",
    title: "RELATING TO SINGLE-USE PLASTICS",
    plainTitle: "Ban Single-Use Plastic Utensils & Straws from Food Businesses",
    summary: "Prohibits the sale and distribution of single-use plastic service ware — including cutlery, straws, and stirrers — by food and beverage businesses statewide, effective January 1, 2027.",
    committee: "Senate Health and Human Services Committee",
    hearingDate: "TBD", hearingTime: "",
    location: "Hawaii State Capitol",
    stateLink: "https://www.capitol.hawaii.gov/session/measure_indiv.aspx?billtype=SB&billnumber=2361&year=2026",
    tags: ["environment"], emoji: "🌊",
    gradientFrom: "#1d4ed8", gradientTo: "#1e3a8a",
    source: "state",
  },
];

// Fallback mock data for Honolulu City Council bills (shown when Legistar API is unavailable).
export const MOCK_COUNTY_BILLS = [
  {
    id: "mock-legistar-101",
    type: "Bill", number: "50",
    title: "RELATING TO SHORT-TERM RENTALS IN RESIDENTIAL ZONES",
    plainTitle: "Restrict Vacation Rentals in Honolulu Neighborhoods",
    summary: "Limits short-term rental permits in residential-zoned areas on Oʻahu, requiring owner-occupancy and capping the number of units per neighborhood to protect long-term housing supply.",
    committee: "Zoning and Planning Committee",
    hearingDate: "Hearing date TBD", hearingTime: "",
    location: "Honolulu Hale, 530 S King St",
    stateLink: "https://honolulu.legistar.com/",
    tags: ["housing"], emoji: "🏠",
    gradientFrom: "#075985", gradientTo: "#0c4a6e",
    source: "county",
  },
  {
    id: "mock-legistar-102",
    type: "Res", number: "25-180",
    title: "SUPPORTING RAIL TRANSIT COMPLETION AND FUNDING",
    plainTitle: "Fund the Honolulu Rail Through Completion",
    summary: "Urges the state and federal government to provide stable funding to complete the Skyline rail extension from Halawa to Ala Moana, reducing traffic congestion and carbon emissions across Oʻahu.",
    committee: "Transportation Committee",
    hearingDate: "Hearing date TBD", hearingTime: "",
    location: "Honolulu Hale, 530 S King St",
    stateLink: "https://honolulu.legistar.com/",
    tags: ["transportation"], emoji: "🚌",
    gradientFrom: "#1d4ed8", gradientTo: "#1e3a8a",
    source: "county",
  },
  {
    id: "mock-legistar-103",
    type: "Bill", number: "18",
    title: "RELATING TO TREE CANOPY PRESERVATION",
    plainTitle: "Protect Honolulu's Urban Tree Canopy",
    summary: "Requires a replacement permit and 2-for-1 replanting for any mature tree removal on city-managed land, expanding Oʻahu's urban forest to combat heat island effects and stormwater runoff.",
    committee: "Parks and Recreation Committee",
    hearingDate: "Hearing date TBD", hearingTime: "",
    location: "Honolulu Hale, 530 S King St",
    stateLink: "https://honolulu.legistar.com/",
    tags: ["environment"], emoji: "🌿",
    gradientFrom: "#0f766e", gradientTo: "#134e4a",
    source: "county",
  },
];
