const ROLE_LABELS = {
  resident: "a Hawaii resident",
  parent: "a parent of children in Hawaii",
  student: "a student",
  teacher: "an educator in the Hawaii public school system",
  business: "a small business owner in Hawaii",
  healthcare: "a healthcare worker serving our community",
  native_hawaiian: "a Native Hawaiian",
  environmental: "an environmental advocate",
  veteran: "a veteran and Hawaii resident",
  retiree: "a longtime Hawaii resident",
};

const ISLAND_LABELS = {
  oahu: "Oʻahu",
  maui: "Maui",
  hawaii: "Hawaiʻi Island",
  kauai: "Kauaʻi",
  molokai: "Molokaʻi",
  lanai: "Lānaʻi",
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
  "Please pass this bill. Hawaii residents are counting on the Legislature to act.",
  "I respectfully ask for your support of this measure. The time to act is now.",
  "Thank you for your commitment to our community. I urge a favorable decision on this bill.",
];

const AGAINST_CLOSERS = [
  "I respectfully ask the Committee to hold this bill and seek broader community input before moving forward.",
  "I urge the Committee to consider the concerns of residents like me before advancing this measure.",
  "Please take the time to address these concerns. Our community deserves thoughtful legislation.",
  "I ask that the Committee listen to the voices of those most affected by this bill.",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTestimony({ bill, profile, stance, reason, story }) {
  const roleLabel = ROLE_LABELS[profile.role] || "a Hawaii resident";
  const islandLabel = ISLAND_LABELS[profile.island] || "Hawaii";
  const isFor = stance === "for";
  const opener = pick(isFor ? FOR_OPENERS : AGAINST_OPENERS);
  const closer = pick(isFor ? FOR_CLOSERS : AGAINST_CLOSERS);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  let t = `${date}\n\n`;
  t += `To the ${bill.committee},\n`;
  t += `Hawaii State Legislature\n\n`;
  t += `Aloha,\n\n`;

  t += `My name is [Your Name], and I am ${roleLabel} living on ${islandLabel}. `;
  t += `${opener} ${bill.type} ${bill.number} — ${bill.title}.\n\n`;

  if (reason?.trim()) {
    t += `${reason.trim()}\n\n`;
  } else {
    if (isFor) {
      t += `This measure directly addresses one of the most pressing challenges facing our community. `;
      t += `As ${roleLabel}, I see firsthand the impact that inaction has on everyday life here in Hawaii. `;
      t += `${bill.type} ${bill.number} represents the kind of meaningful, community-centered policy our state needs.\n\n`;
    } else {
      t += `While I understand the intent behind this measure, I have serious concerns about how it will impact residents like me. `;
      t += `As ${roleLabel} on ${islandLabel}, I believe this bill as written could cause unintended harm to our community. `;
      t += `I urge the Committee to carefully weigh its effects before moving forward.\n\n`;
    }
  }

  if (story?.trim()) {
    t += `I want to share a personal experience that speaks to why this matters: ${story.trim()}\n\n`;
  }

  t += `${closer}\n\n`;
  t += `Mahalo for your time and service to the people of Hawaii.\n\n`;
  t += `Respectfully,\n`;
  t += `[Your Name]\n`;
  t += `[Your Address], ${islandLabel}, HI\n`;
  t += `[Your Phone / Email]`;

  return t;
}
