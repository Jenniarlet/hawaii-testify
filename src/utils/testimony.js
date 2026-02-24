const ROLE_LABELS = {
  resident: "a Honolulu resident",
  parent: "a parent of children in Honolulu",
  student: "a student",
  teacher: "an educator in the Honolulu public school system",
  business: "a small business owner in Honolulu",
  healthcare: "a healthcare worker serving the Honolulu community",
  native_hawaiian: "a Native Hawaiian",
  environmental: "an environmental advocate",
  veteran: "a veteran and Honolulu resident",
  retiree: "a longtime Honolulu resident",
};

const NEIGHBORHOOD_LABELS = {
  downtown: "Downtown Honolulu",
  kailua: "Kailua / Kāneʻohe",
  kapolei: "Kapolei / ʻEwa Beach",
  manoa: "Mānoa / Nuʻuanu",
  waikiki: "Waikīkī",
  aiea: "ʻAiea / Pearl City",
  waianae: "the Waiʻanae Coast",
  northshore: "the North Shore",
};

const FOR_OPENERS = [
  "I write in strong support of",
  "I am writing today to express my full support for",
  "I urge the Committee to pass",
  "I stand in support of",
];

const AGAINST_OPENERS = [
  "I write in opposition to",
  "I am writing today to express my concerns about",
  "I urge the Committee to reconsider",
  "I respectfully oppose",
];

const FOR_CLOSERS = [
  "I urge the Committee to move this measure forward without delay. Our community deserves action.",
  "Please pass this bill. Honolulu residents are counting on the Council to act.",
  "I respectfully ask for your support of this measure. The time to act is now.",
  "Thank you for your commitment to our community. I urge a favorable decision on this bill.",
];

const AGAINST_CLOSERS = [
  "I respectfully ask the Committee to hold this bill and seek community input before moving forward.",
  "I urge the Committee to consider the concerns of residents like me before advancing this measure.",
  "Please take the time to address these concerns. Our community deserves thoughtful legislation.",
  "I ask that the Committee listen to the voices of those most affected by this bill.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTestimony({ bill, profile, stance, reason, story }) {
  const roleLabel = ROLE_LABELS[profile.role] || "a Honolulu resident";
  const neighborhoodLabel =
    NEIGHBORHOOD_LABELS[profile.neighborhood] || "Honolulu";
  const isFor = stance === "for";
  const opener = pick(isFor ? FOR_OPENERS : AGAINST_OPENERS);
  const closer = pick(isFor ? FOR_CLOSERS : AGAINST_CLOSERS);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let testimony = `${date}\n\n`;
  testimony += `To the ${bill.committee},\n`;
  testimony += `City and County of Honolulu\n\n`;

  testimony += `Aloha,\n\n`;

  testimony += `My name is [Your Name], and I am ${roleLabel} living in ${neighborhoodLabel}. `;
  testimony += `${opener} Bill ${bill.number} — ${bill.title}.\n\n`;

  if (reason && reason.trim()) {
    testimony += `${reason.trim()}\n\n`;
  } else {
    if (isFor) {
      testimony += `This measure directly addresses one of the most pressing challenges facing our community. `;
      testimony += `As ${roleLabel}, I see firsthand the impact that inaction has on everyday life in ${neighborhoodLabel}. `;
      testimony += `Bill ${bill.number} represents the kind of meaningful, community-centered policy our city needs.\n\n`;
    } else {
      testimony += `While I understand the intent behind this measure, I have serious concerns about how it will impact residents like me. `;
      testimony += `As ${roleLabel} in ${neighborhoodLabel}, I believe this bill as written could cause unintended harm. `;
      testimony += `I urge the Committee to carefully weigh its effects on our community before moving forward.\n\n`;
    }
  }

  if (story && story.trim()) {
    testimony += `I want to share a personal experience that speaks to why this matters: ${story.trim()}\n\n`;
  }

  testimony += `${closer}\n\n`;
  testimony += `Mahalo for your time and service to our community.\n\n`;
  testimony += `Respectfully,\n`;
  testimony += `[Your Name]\n`;
  testimony += `[Your Address], ${neighborhoodLabel}, HI\n`;
  testimony += `[Your Phone / Email]`;

  return testimony;
}
