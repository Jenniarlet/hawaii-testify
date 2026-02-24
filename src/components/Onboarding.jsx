import { useState } from "react";
import { ISLANDS, ROLES, INTERESTS } from "../data/options";
import { saveProfile } from "../utils/storage";

const STEPS = ["island", "role", "interests"];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [island, setIsland] = useState(null);
  const [role, setRole] = useState(null);
  const [interests, setInterests] = useState([]);

  function toggleInterest(id) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const profile = { island, role, interests };
      saveProfile(profile);
      onComplete(profile);
    }
  }

  const canProceed =
    (step === 0 && island) ||
    (step === 1 && role) ||
    (step === 2 && interests.length >= 3);

  return (
    <div className="flex flex-col h-full bg-ocean-900 text-white">
      {/* Header */}
      <div className="px-6 pt-14 pb-6">
        {step === 0 && (
          <div>
            <div className="text-4xl mb-3">🌺</div>
            <h1 className="text-2xl font-bold leading-tight">Welcome to HawaiiTestify</h1>
            <p className="text-ocean-300 mt-2 text-sm leading-relaxed">
              Your voice matters at the Hawaii State Legislature. Let's personalize your experience.
            </p>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="text-4xl mb-3">👋</div>
            <h2 className="text-2xl font-bold leading-tight">What's your role in the community?</h2>
            <p className="text-ocean-300 mt-2 text-sm">This helps us tailor your testimony voice.</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-2xl font-bold leading-tight">What issues matter most to you?</h2>
            <p className="text-ocean-300 mt-2 text-sm">Pick 3–5 topics. We'll show you the most relevant bills.</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 px-6 mb-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-300 ${
              i <= step ? "bg-ocean-400" : "bg-ocean-700"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {step === 0 && (
          <div>
            <p className="text-ocean-300 text-sm font-medium uppercase tracking-wider mb-3">
              Which island are you on?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ISLANDS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setIsland(n.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                    island === n.id
                      ? "border-ocean-400 bg-ocean-800 scale-[0.98]"
                      : "border-ocean-700 bg-ocean-800/40"
                  }`}
                >
                  <span className="text-2xl">{n.emoji}</span>
                  <span className="text-sm font-semibold leading-tight">{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                  role === r.id
                    ? "border-ocean-400 bg-ocean-800 scale-[0.98]"
                    : "border-ocean-700 bg-ocean-800/40"
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="font-semibold">{r.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map((interest) => {
                const selected = interests.includes(interest.id);
                const maxed = interests.length >= 5 && !selected;
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    disabled={maxed}
                    className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 font-semibold text-sm transition-all duration-150 ${
                      selected
                        ? "border-ocean-400 bg-ocean-600 text-white scale-95"
                        : maxed
                        ? "border-ocean-800 bg-ocean-800/20 text-ocean-600 opacity-40"
                        : "border-ocean-700 bg-ocean-800/40 text-ocean-200"
                    }`}
                  >
                    <span>{interest.emoji}</span>
                    <span>{interest.label}</span>
                  </button>
                );
              })}
            </div>
            {interests.length > 0 && (
              <p className="text-ocean-400 text-xs mt-4">
                {interests.length}/5 selected
                {interests.length < 3 ? ` — pick ${3 - interests.length} more` : " — looks great!"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
            canProceed
              ? "bg-ocean-500 text-white shadow-lg shadow-ocean-900/50 active:scale-95"
              : "bg-ocean-800 text-ocean-600 cursor-not-allowed"
          }`}
        >
          {step === STEPS.length - 1 ? "Let's Go →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
