// =============================================================================
// src/components/SwipeFeed.jsx — Tinder-Style Bill Swipe UI
// =============================================================================
// What it is:
//   The main browsing screen. Displays bills as a stack of swipeable cards.
//   Powered by react-spring (animation) and @use-gesture/react (touch/drag).
//
// Interaction:
//   Swipe LEFT  (or tap ✕) → skip the bill, move to the next one
//   Swipe RIGHT (or tap ✓) → select the bill → triggers testimony flow in App.jsx
//   Threshold: 100px drag distance OR velocity > 0.5
//
// Bill ordering:
//   Bills whose topic tags match the user's selected interests (from onboarding)
//   are moved to the front of the stack. Other bills follow after.
//
// Source badges on each card:
//   STATE (ocean teal) → Hawaii State Legislature bill (HB / SB)
//                        Submitted to: https://www.capitol.hawaii.gov/
//   CITY  (leaf green) → Honolulu City Council bill (Bill / Resolution / Ordinance)
//                        Submitted to: https://honolulucitycouncil.org/
//
// Props:
//   bills[]       → merged array of state + county bills from App.jsx
//   profile       → user profile (used for interest-based ordering)
//   onSwipeRight  → callback with the selected bill object
//   onAllDone     → callback when every card has been swiped
// =============================================================================

import { useState } from "react";
import { useSprings, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

const SWIPE_THRESHOLD = 100;

function getFilteredBills(bills, profile) {
  if (!profile?.interests?.length) return bills;
  const relevant = bills.filter((b) => b.tags.some((t) => profile.interests.includes(t)));
  const others = bills.filter((b) => !b.tags.some((t) => profile.interests.includes(t)));
  return [...relevant, ...others];
}

export default function SwipeFeed({ bills, profile, onSwipeRight, onAllDone }) {
  const ordered = getFilteredBills(bills, profile);
  const [gone] = useState(() => new Set());
  const [currentIndex, setCurrentIndex] = useState(ordered.length - 1);

  const [springs, api] = useSprings(ordered.length, (i) => ({
    x: 0, rot: 0,
    scale: i === ordered.length - 1 ? 1 : 0.95,
    opacity: 1,
    config: { friction: 50, tension: 500 },
  }));

  const bind = useDrag(
    ({ args: [index], active, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const trigger = Math.abs(mx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.5;

      if (!active && trigger) {
        const dir = dx > 0 ? 1 : -1;
        gone.add(index);
        api.start((i) => {
          if (i !== index) return;
          return {
            x: dir * (window.innerWidth + 200),
            rot: mx / 10 + dir * 10 * vx,
            scale: 1, opacity: 0,
            config: { friction: 50, tension: 200 },
          };
        });
        setTimeout(() => {
          if (dir === 1) onSwipeRight(ordered[index]);
          setCurrentIndex((prev) => {
            const next = prev - 1;
            if (next < 0) setTimeout(onAllDone, 300);
            return next;
          });
        }, 300);
      } else {
        api.start((i) => {
          if (i !== index) return;
          return {
            x: active ? mx : 0,
            rot: active ? mx / 15 : 0,
            scale: active ? 1.05 : i === currentIndex ? 1 : 0.95,
            opacity: 1,
            immediate: (key) => key === "x" && active,
          };
        });
      }
    },
    { filterTaps: true, axis: "x" }
  );

  function swipeProgrammatic(dir) {
    const index = currentIndex;
    if (index < 0) return;
    gone.add(index);
    api.start((i) => {
      if (i !== index) return;
      return {
        x: dir * (window.innerWidth + 200),
        rot: dir * 15, scale: 1, opacity: 0,
        config: { friction: 50, tension: 200 },
      };
    });
    setTimeout(() => {
      if (dir === 1) onSwipeRight(ordered[index]);
      setCurrentIndex((prev) => {
        const next = prev - 1;
        if (next < 0) setTimeout(onAllDone, 300);
        return next;
      });
    }, 300);
  }

  return (
    <div className="flex flex-col h-full bg-cream">
      {/* Header */}
      <div className="px-6 pt-14 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif text-charcoal">🌺 HawaiiTestify</h1>
          <p className="text-muted text-xs font-extrabold uppercase tracking-widest">State + City Council</p>
        </div>
        <div className="text-right">
          <p className="text-charcoal text-xs font-medium">
            {Math.max(0, currentIndex + 1)} of {ordered.length}
          </p>
          <p className="text-muted text-xs">bills to review</p>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="flex items-center justify-center gap-4 px-6 pb-3">
        <div className="flex items-center gap-1 text-coral text-xs font-medium">
          <span>←</span><span>Skip</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-1 text-leaf text-xs font-medium">
          <span>Testify</span><span>→</span>
        </div>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative flex items-center justify-center px-4">
        {springs.map(({ x, rot, scale, opacity }, i) => {
          const bill = ordered[i];
          const isTop = i === currentIndex;
          const isBehind = i === currentIndex - 1;
          if (!isTop && !isBehind) return null;

          return (
            <animated.div
              key={bill.id}
              style={{
                position: "absolute", width: "100%", maxWidth: "400px",
                transform: x.to((xv) => `translate3d(${xv}px, 0, 0)`),
                opacity, zIndex: isTop ? 10 : 5,
              }}
              {...(isTop ? bind(i) : {})}
              className="draggable"
            >
              {/* Skip indicator */}
              {isTop && (
                <animated.div
                  style={{ position: "absolute", top: 20, left: 20, zIndex: 20, opacity: x.to([0, -50], [0, 1], "clamp") }}
                  className="bg-muted text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-charcoal/20 rotate-[-15deg]"
                >SKIP</animated.div>
              )}
              {/* Testify indicator */}
              {isTop && (
                <animated.div
                  style={{ position: "absolute", top: 20, right: 20, zIndex: 20, opacity: x.to([0, 50], [0, 1], "clamp") }}
                  className="bg-coral text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-coral-deep rotate-[15deg]"
                >TESTIFY</animated.div>
              )}

              <animated.div
                style={{ transform: rot.to((r) => `rotate(${r}deg)`), scale }}
                className="rounded-3xl overflow-hidden select-none"
                style={{ transform: rot.to((r) => `rotate(${r}deg)`), scale, boxShadow: "0 12px 34px rgba(31,41,51,0.12)" }}
              >
                {/* Gradient header */}
                <div className="p-6 pb-8" style={{ background: `linear-gradient(135deg, ${bill.gradientFrom}, ${bill.gradientTo})` }}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {bill.type} {bill.number}
                    </span>
                    <div className="flex items-center gap-2">
                      {bill.source === "county" ? (
                        <span className="bg-leaf/80 text-white text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm">
                          CITY
                        </span>
                      ) : (
                        <span className="bg-ocean/80 text-white text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm">
                          STATE
                        </span>
                      )}
                      <span className="text-4xl">{bill.emoji}</span>
                    </div>
                  </div>
                  <h2 className="text-white text-xl font-bold font-serif leading-tight mb-2">{bill.plainTitle}</h2>
                  <p className="text-white/70 text-xs font-medium">{bill.title}</p>
                </div>

                {/* Card body */}
                <div className="bg-white p-5">
                  <p className="text-charcoal text-sm leading-relaxed mb-5">{bill.summary}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>🏛️</span>
                      <span className="font-semibold text-charcoal">{bill.committee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>📅</span>
                      <span>
                        <span className="font-semibold text-charcoal">{bill.hearingDate}</span>
                        {bill.hearingTime && ` · ${bill.hearingTime}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>📍</span>
                      <span>{bill.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {bill.tags.map((tag) => (
                      <span key={tag} className="bg-seafoam/30 text-ocean text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </animated.div>
            </animated.div>
          );
        })}

        {currentIndex < 0 && (
          <div className="text-center text-charcoal px-8">
            <div className="text-5xl mb-4">🌺</div>
            <h2 className="text-xl font-bold font-serif mb-2 text-charcoal">You've reviewed all bills!</h2>
            <p className="text-muted text-sm">Mahalo for staying engaged.</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="px-8 pb-12 pt-4 flex items-center justify-center gap-8">
        <button
          onClick={() => swipeProgrammatic(-1)}
          disabled={currentIndex < 0}
          className="w-16 h-16 rounded-full bg-white border-2 border-coral flex items-center justify-center text-2xl shadow-md active:scale-90 transition-transform disabled:opacity-30"
        >✕</button>
        <div className="text-center">
          <p className="text-muted text-xs">drag or tap</p>
        </div>
        <button
          onClick={() => swipeProgrammatic(1)}
          disabled={currentIndex < 0}
          className="w-16 h-16 rounded-full bg-white border-2 border-leaf flex items-center justify-center text-2xl shadow-md active:scale-90 transition-transform disabled:opacity-30"
        >✓</button>
      </div>
    </div>
  );
}
