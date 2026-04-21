// =============================================================================
// src/components/SubmitScreen.jsx — Submission Instructions
// =============================================================================
// What it is:
//   The final step. Shows the user exactly how to submit their testimony,
//   with direct links to the relevant government website and pre-filled
//   email links. No API calls — purely informational.
//
// Steps shown:
//   1. Copy testimony (reminder to fill in [bracketed] fields)
//   2. Submit online at the bill's official page (bill.stateLink)
//   3. Or email testimony@capitol.hawaii.gov with bill number in subject
//   4. Submit before the hearing deadline (bill.hearingDate)
//   5. Optional: testify in person or via Zoom at the hearing
//
// Submission destinations:
//   State bills  → https://www.capitol.hawaii.gov/ + testimony@capitol.hawaii.gov
//   County bills → Currently links to the Legistar detail page (bill.stateLink).
//                  Future: add City Council-specific submission path at
//                  https://honolulucitycouncil.org/
//
// Props:
//   bill    → the selected bill (committee, dates, links, location)
//   onDone  → returns user to SwipeFeed to review more bills
// =============================================================================

export default function SubmitScreen({ bill, onDone }) {
  const subject = encodeURIComponent(`Testimony on ${bill.type} ${bill.number} — ${bill.title}`);
  const committeeEmail = "testimony@capitol.hawaii.gov";

  const steps = [
    {
      number: "1", icon: "📋",
      title: "Copy your testimony",
      description: "Go back and copy your full testimony to your clipboard. Replace the [bracketed] fields with your real name, address, and contact info.",
    },
    {
      number: "2", icon: "🌐",
      title: "Submit online via the Capitol website",
      description: "The Hawaii State Legislature accepts written testimony directly through their website — no account needed.",
      action: {
        label: "Submit at capitol.hawaii.gov →",
        url: bill.stateLink || "https://www.capitol.hawaii.gov/",
      },
    },
    {
      number: "3", icon: "✉️",
      title: "Or email your testimony",
      description: `Email your testimony to ${committeeEmail} with "${bill.type} ${bill.number}" in the subject line. This goes directly into the legislative record.`,
      action: {
        label: "Email testimony@capitol.hawaii.gov →",
        url: `mailto:${committeeEmail}?subject=${subject}`,
      },
    },
    {
      number: "4", icon: "📅",
      title: "Submit before the hearing",
      description: `The hearing for ${bill.type} ${bill.number} is ${bill.hearingDate}${bill.hearingTime ? ` at ${bill.hearingTime}` : ""}. Submit at least 24 hours before so it's included in the official record.`,
    },
    {
      number: "5", icon: "🎤",
      title: "Testify in person (optional)",
      description: `You can also testify in person at ${bill.location}. Sign in 15 minutes before the hearing. You'll have 3 minutes to speak. Remote testimony via Zoom is often available too.`,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-ocean-900">
      {/* Header */}
      <div
        className="px-6 pt-14 pb-8"
        style={{ background: `linear-gradient(180deg, ${bill.gradientFrom} 0%, #0c4a6e 100%)` }}
      >
        <div className="text-4xl mb-3">{bill.emoji}</div>
        <h2 className="text-white text-2xl font-bold leading-tight">You're Ready to Testify!</h2>
        <p className="text-white/70 text-sm mt-2">
          {bill.type} {bill.number} · {bill.hearingDate}
        </p>
        <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
          <p className="text-white/90 text-sm font-medium">{bill.committee}</p>
          <p className="text-white/60 text-xs mt-0.5">{bill.location}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <p className="text-ocean-300 text-xs font-semibold uppercase tracking-wider">
          How to submit your testimony
        </p>

        {steps.map((step) => (
          <div key={step.number} className="bg-ocean-800 rounded-2xl p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-ocean-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-ocean-500 text-xs font-bold">STEP {step.number}</span>
                <p className="text-white font-semibold text-sm mb-1 mt-0.5">{step.title}</p>
                <p className="text-ocean-400 text-xs leading-relaxed">{step.description}</p>
                {step.action && (
                  <a
                    href={step.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-ocean-400 text-xs font-semibold border border-ocean-600 rounded-full px-3 py-1.5"
                  >
                    {step.action.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-palm-900 to-ocean-900 border border-palm-800 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🌺</div>
          <p className="text-white font-bold mb-1">Mahalo for your civic engagement!</p>
          <p className="text-ocean-400 text-xs leading-relaxed">
            Every testimony matters. Hawaii legislators are required to read all submitted written testimony before voting.
          </p>
        </div>
      </div>

      {/* Done */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={onDone}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-ocean-500 text-white shadow-lg active:scale-95 transition-transform"
        >
          Review More Bills
        </button>
      </div>
    </div>
  );
}
