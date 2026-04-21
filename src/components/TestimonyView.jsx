// =============================================================================
// src/components/TestimonyView.jsx — Generated Testimony Display
// =============================================================================
// What it is:
//   Displays the complete, ready-to-submit testimony letter. The letter is
//   generated on the fly by src/utils/testimony.js using the user's profile
//   and their Prompts inputs — no API calls, runs entirely in the browser.
//
// What the user can do here:
//   - Read their generated testimony
//   - Copy it to clipboard (with a fallback for older mobile browsers)
//   - Proceed to SubmitScreen for step-by-step submission instructions
//   - Go back to Prompts to edit their responses
//
// The letter contains [bracketed] placeholders (name, address, contact) that
// the user must fill in before submitting.
//
// Props:
//   bill        → the selected bill (for header display and committee name)
//   profile     → user profile (island + role used in letter body)
//   promptData  → { stance, reason, story } from Prompts screen
//   onBack      → returns to Prompts screen
//   onSubmit    → advances to SubmitScreen
// =============================================================================

import { useState } from "react";
import { generateTestimony } from "../utils/testimony";

export default function TestimonyView({ bill, profile, promptData, onBack, onSubmit }) {
  const [copied, setCopied] = useState(false);

  const testimony = generateTestimony({
    bill,
    profile,
    stance: promptData.stance,
    reason: promptData.reason,
    story: promptData.story,
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(testimony);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older mobile browsers
      const el = document.createElement("textarea");
      el.value = testimony;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <button
          onClick={onBack}
          className="text-ocean text-sm mb-4 flex items-center gap-1 font-medium"
        >
          ← Edit responses
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">✍️</span>
          <h2 className="text-charcoal text-xl font-bold font-serif">Your Testimony</h2>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl">{bill.emoji}</span>
          <span className="text-muted text-sm font-medium">
            {bill.type} {bill.number} — {bill.committee}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              promptData.stance === "for"
                ? "bg-leaf/20 text-leaf"
                : "bg-coral/10 text-coral-deep"
            }`}
          >
            {promptData.stance === "for" ? "✓ Support" : "✕ Oppose"}
          </span>
          <span className="text-muted text-xs">·</span>
          <span className="text-muted text-xs">Hearing: {bill.hearingDate}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-6" />

      {/* Testimony text */}
      <div className="flex-1 overflow-y-auto testimony-scroll px-6 py-5">
        <div className="bg-white rounded-3xl p-5" style={{ boxShadow: "0 12px 34px rgba(31,41,51,0.08)" }}>
          <pre className="text-charcoal text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {testimony}
          </pre>
        </div>
        <p className="text-muted text-xs text-center mt-4 px-4">
          Replace [Your Name], [Your Address], and [Your Phone / Email] before submitting.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 pt-4 space-y-3">
        <button
          onClick={handleCopy}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-200 active:scale-95 ${
            copied
              ? "bg-leaf text-white"
              : "bg-coral text-white shadow-lg shadow-charcoal/20"
          }`}
        >
          {copied ? "✓ Copied to Clipboard!" : "Copy Testimony"}
        </button>
        <button
          onClick={onSubmit}
          className="w-full py-4 rounded-full font-bold text-lg bg-white text-charcoal border-2 border-border active:scale-95 transition-transform"
        >
          How to Submit →
        </button>
      </div>
    </div>
  );
}
