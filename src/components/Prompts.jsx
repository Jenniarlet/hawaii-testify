import { useState } from "react";

export default function Prompts({ bill, onSubmit, onSkip }) {
  const [stance, setStance] = useState("for");
  const [reason, setReason] = useState("");
  const [story, setStory] = useState("");

  function handleGenerate() {
    onSubmit({ stance, reason, story });
  }

  return (
    <div className="flex flex-col h-full bg-ocean-900">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <button
          onClick={onSkip}
          className="text-ocean-400 text-sm mb-4 flex items-center gap-1"
        >
          ← Back to bills
        </button>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{bill.emoji}</span>
          <span className="bg-ocean-700 text-ocean-300 text-xs font-bold px-2 py-1 rounded-full">
            Bill {bill.number}
          </span>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight mt-2">
          {bill.plainTitle}
        </h2>
        <p className="text-ocean-400 text-sm mt-1">{bill.committee}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-ocean-800 mx-6" />

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Stance toggle */}
        <div>
          <p className="text-ocean-300 text-sm font-semibold mb-3">
            1. Your Position
          </p>
          <div className="flex rounded-2xl overflow-hidden border-2 border-ocean-700">
            <button
              onClick={() => setStance("for")}
              className={`flex-1 py-3.5 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                stance === "for"
                  ? "bg-palm-600 text-white"
                  : "bg-ocean-800 text-ocean-400"
              }`}
            >
              <span>✓</span>
              <span>Support</span>
            </button>
            <button
              onClick={() => setStance("against")}
              className={`flex-1 py-3.5 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                stance === "against"
                  ? "bg-coral-600 text-white"
                  : "bg-ocean-800 text-ocean-400"
              }`}
            >
              <span>✕</span>
              <span>Oppose</span>
            </button>
          </div>
        </div>

        {/* Why it matters */}
        <div>
          <p className="text-ocean-300 text-sm font-semibold mb-1">
            2. Why does this matter to you?
          </p>
          <p className="text-ocean-500 text-xs mb-3">
            Your testimony is stronger with your personal perspective.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={
              stance === "for"
                ? `e.g. "As a renter in Kailua, I've seen rents rise 40% in 3 years because vacation rentals dominate my neighborhood..."`
                : `e.g. "I'm concerned this bill doesn't include protections for small property owners who depend on rental income..."`
            }
            rows={4}
            maxLength={500}
            className="w-full bg-ocean-800 text-white placeholder-ocean-600 rounded-2xl p-4 text-sm leading-relaxed resize-none border-2 border-ocean-700 focus:border-ocean-500 focus:outline-none"
          />
          <p className="text-ocean-600 text-xs mt-1 text-right">
            {reason.length}/500
          </p>
        </div>

        {/* Personal story */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-ocean-300 text-sm font-semibold">
              3. Personal story
            </p>
            <span className="text-ocean-600 text-xs bg-ocean-800 px-2 py-0.5 rounded-full">
              optional
            </span>
          </div>
          <p className="text-ocean-500 text-xs mb-3">
            Testimonies with real stories are 3× more likely to be cited by council members.
          </p>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder='e.g. "My family has lived in Kāneʻohe for three generations. Last year, five homes on my street converted to vacation rentals..."'
            rows={4}
            maxLength={600}
            className="w-full bg-ocean-800 text-white placeholder-ocean-600 rounded-2xl p-4 text-sm leading-relaxed resize-none border-2 border-ocean-700 focus:border-ocean-500 focus:outline-none"
          />
          <p className="text-ocean-600 text-xs mt-1 text-right">
            {story.length}/600
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-ocean-500 text-white shadow-lg shadow-ocean-900/50 active:scale-95 transition-transform"
        >
          Generate My Testimony ✍️
        </button>
      </div>
    </div>
  );
}
