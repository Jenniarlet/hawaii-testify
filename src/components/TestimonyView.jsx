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
    <div className="flex flex-col h-full bg-ocean-900">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <button
          onClick={onBack}
          className="text-ocean-400 text-sm mb-4 flex items-center gap-1"
        >
          ← Edit responses
        </button>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">✍️</span>
          <h2 className="text-white text-xl font-bold">Your Testimony</h2>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl">{bill.emoji}</span>
          <span className="text-ocean-300 text-sm font-medium">
            Bill {bill.number} — {bill.committee}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              promptData.stance === "for"
                ? "bg-palm-800 text-palm-300"
                : "bg-coral-900 text-coral-300"
            }`}
          >
            {promptData.stance === "for" ? "✓ Support" : "✕ Oppose"}
          </span>
          <span className="text-ocean-600 text-xs">·</span>
          <span className="text-ocean-400 text-xs">Hearing: {bill.hearingDate}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-ocean-800 mx-6" />

      {/* Testimony text */}
      <div className="flex-1 overflow-y-auto testimony-scroll px-6 py-5">
        <div className="bg-white rounded-3xl p-5 shadow-xl">
          <pre className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {testimony}
          </pre>
        </div>
        <p className="text-ocean-500 text-xs text-center mt-4 px-4">
          Replace [Your Name], [Your Address], and [Your Phone / Email] before submitting.
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-10 pt-4 space-y-3">
        <button
          onClick={handleCopy}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95 ${
            copied
              ? "bg-palm-600 text-white"
              : "bg-ocean-500 text-white shadow-lg shadow-ocean-900/50"
          }`}
        >
          {copied ? "✓ Copied to Clipboard!" : "Copy Testimony"}
        </button>
        <button
          onClick={onSubmit}
          className="w-full py-4 rounded-2xl font-bold text-lg bg-ocean-800 text-ocean-300 border-2 border-ocean-700 active:scale-95 transition-transform"
        >
          How to Submit →
        </button>
      </div>
    </div>
  );
}
