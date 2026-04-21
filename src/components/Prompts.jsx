// =============================================================================
// src/components/Prompts.jsx — Testimony Input Form
// =============================================================================
// What it is:
//   The screen where the user fills in their testimony inputs after swiping
//   right on a bill. Collects three things:
//     1. Stance      → Support or Oppose (toggle)
//     2. Reason      → Why this bill matters to them (up to 500 chars)
//     3. Personal story → Optional lived experience (up to 600 chars)
//
// No API calls — purely a form that collects user input.
// On submit, passes { stance, reason, story } up to App.jsx, which routes
// to TestimonyView to generate the letter.
//
// Props:
//   bill      → the bill object the user selected (for display context)
//   onSubmit  → callback with { stance, reason, story }
//   onSkip    → back button — returns to the SwipeFeed without submitting
// =============================================================================

import { useState } from "react";

export default function Prompts({ bill, onSubmit, onSkip }) {
  const [stance, setStance] = useState("for");
  const [reason, setReason] = useState("");
  const [story, setStory] = useState("");

  function handleGenerate() {
    onSubmit({ stance, reason, story });
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <button
          onClick={onSkip}
          className="text-ocean text-sm mb-4 flex items-center gap-1 font-medium"
        >
          ← Back to bills
        </button>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">{bill.emoji}</span>
          <span className="bg-seafoam/30 text-ocean text-xs font-extrabold uppercase tracking-widest px-2 py-1 rounded-full">
            {bill.type} {bill.number}
          </span>
        </div>
        <h2 className="text-charcoal text-xl font-bold font-serif leading-tight mt-2">
          {bill.plainTitle}
        </h2>
        <p className="text-muted text-sm mt-1">{bill.committee}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-6" />

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Stance toggle */}
        <div>
          <p className="text-charcoal text-sm font-semibold mb-3">
            1. Your Position
          </p>
          <div className="flex rounded-2xl overflow-hidden border-2 border-border">
            <button
              onClick={() => setStance("for")}
              className={`flex-1 py-3.5 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                stance === "for"
                  ? "bg-leaf text-white"
                  : "bg-sand text-muted"
              }`}
            >
              <span>✓</span>
              <span>Support</span>
            </button>
            <button
              onClick={() => setStance("against")}
              className={`flex-1 py-3.5 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                stance === "against"
                  ? "bg-coral text-white"
                  : "bg-sand text-muted"
              }`}
            >
              <span>✕</span>
              <span>Oppose</span>
            </button>
          </div>
        </div>

        {/* Why it matters */}
        <div>
          <p className="text-charcoal text-sm font-semibold mb-1">
            2. Why does this matter to you?
          </p>
          <p className="text-muted text-xs mb-3">
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
            className="w-full bg-white text-charcoal placeholder-muted/50 rounded-2xl p-4 text-sm leading-relaxed resize-none border-2 border-border focus:border-ocean focus:outline-none"
          />
          <p className="text-muted text-xs mt-1 text-right">
            {reason.length}/500
          </p>
        </div>

        {/* Personal story */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-charcoal text-sm font-semibold">
              3. Personal story
            </p>
            <span className="text-muted text-xs bg-sand px-2 py-0.5 rounded-full">
              optional
            </span>
          </div>
          <p className="text-muted text-xs mb-3">
            Testimonies with real stories are 3× more likely to be cited by council members.
          </p>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder='e.g. "My family has lived in Kāneʻohe for three generations. Last year, five homes on my street converted to vacation rentals..."'
            rows={4}
            maxLength={600}
            className="w-full bg-white text-charcoal placeholder-muted/50 rounded-2xl p-4 text-sm leading-relaxed resize-none border-2 border-border focus:border-ocean focus:outline-none"
          />
          <p className="text-muted text-xs mt-1 text-right">
            {story.length}/600
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-full font-bold text-lg bg-coral text-white shadow-lg shadow-charcoal/20 active:scale-95 transition-transform"
        >
          Generate My Testimony ✍️
        </button>
      </div>
    </div>
  );
}
