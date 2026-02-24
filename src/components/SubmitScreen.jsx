export default function SubmitScreen({ bill, testimony, onDone }) {
  const councilEmail = "council@honolulu.gov";
  const subject = encodeURIComponent(`Testimony on Bill ${bill.number} — ${bill.title}`);

  const steps = [
    {
      number: "1",
      icon: "📋",
      title: "Copy your testimony",
      description: "Go back and copy your full testimony to your clipboard.",
    },
    {
      number: "2",
      icon: "🌐",
      title: "Visit the Honolulu City Council website",
      description:
        "Go to honolulu.gov/council and find the \"Submit Testimony\" link under the relevant committee.",
      action: {
        label: "Open Honolulu City Council →",
        url: "https://www.honolulu.gov/council",
      },
    },
    {
      number: "3",
      icon: "✉️",
      title: "Or email directly to the committee",
      description: `Email your testimony to ${councilEmail} with the subject line "Testimony on Bill ${bill.number}."`,
      action: {
        label: `Email council@honolulu.gov →`,
        url: `mailto:${councilEmail}?subject=${subject}`,
      },
    },
    {
      number: "4",
      icon: "📅",
      title: "Submit before the hearing",
      description: `The hearing for Bill ${bill.number} is on ${bill.hearingDate} at ${bill.hearingTime}. Submit at least 24 hours before for the record.`,
    },
    {
      number: "5",
      icon: "🎤",
      title: "Testify in person (optional)",
      description: `You can also testify in person at ${bill.location}. Sign in 15 minutes before the start time. You'll have 3 minutes to speak.`,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-ocean-900">
      {/* Header */}
      <div
        className="px-6 pt-14 pb-8"
        style={{
          background: `linear-gradient(180deg, ${bill.gradientFrom} 0%, #0c4a6e 100%)`,
        }}
      >
        <div className="text-4xl mb-3">{bill.emoji}</div>
        <h2 className="text-white text-2xl font-bold leading-tight">
          You're Ready to Testify!
        </h2>
        <p className="text-white/70 text-sm mt-2">
          Bill {bill.number} · {bill.hearingDate}
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
              <div className="w-8 h-8 rounded-full bg-ocean-700 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-ocean-500 text-xs font-bold">
                    STEP {step.number}
                  </span>
                </div>
                <p className="text-white font-semibold text-sm mb-1">{step.title}</p>
                <p className="text-ocean-400 text-xs leading-relaxed">{step.description}</p>
                {step.action && (
                  <a
                    href={step.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-ocean-400 text-xs font-semibold border border-ocean-600 rounded-full px-3 py-1.5 hover:bg-ocean-700 transition-colors"
                  >
                    {step.action.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Mahalo card */}
        <div className="bg-gradient-to-r from-palm-900 to-ocean-900 border border-palm-800 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🌺</div>
          <p className="text-white font-bold mb-1">Mahalo for your civic engagement!</p>
          <p className="text-ocean-400 text-xs leading-relaxed">
            Every testimony matters. The Honolulu City Council is required to read all submitted written testimony before voting.
          </p>
        </div>
      </div>

      {/* Done button */}
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
