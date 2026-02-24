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
    <div className="flex flex-col h-full bg-ocean-900">
      {/* Header */}
      <div className="px-6 pt-14 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">🌺 HawaiiTestify</h1>
          <p className="text-ocean-400 text-xs">Hawaii State Legislature</p>
        </div>
        <div className="text-right">
          <p className="text-ocean-300 text-xs font-medium">
            {Math.max(0, currentIndex + 1)} of {ordered.length}
          </p>
          <p className="text-ocean-500 text-xs">bills to review</p>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="flex items-center justify-center gap-4 px-6 pb-3">
        <div className="flex items-center gap-1 text-coral-400 text-xs font-medium">
          <span>←</span><span>Skip</span>
        </div>
        <div className="h-px flex-1 bg-ocean-800" />
        <div className="flex items-center gap-1 text-palm-400 text-xs font-medium">
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
                  className="bg-coral-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-coral-300 rotate-[-15deg]"
                >SKIP</animated.div>
              )}
              {/* Testify indicator */}
              {isTop && (
                <animated.div
                  style={{ position: "absolute", top: 20, right: 20, zIndex: 20, opacity: x.to([0, 50], [0, 1], "clamp") }}
                  className="bg-palm-500 text-white text-sm font-bold px-3 py-1 rounded-full border-2 border-palm-300 rotate-[15deg]"
                >TESTIFY</animated.div>
              )}

              <animated.div
                style={{ transform: rot.to((r) => `rotate(${r}deg)`), scale }}
                className="rounded-3xl overflow-hidden shadow-2xl select-none"
              >
                {/* Gradient header */}
                <div className="p-6 pb-8" style={{ background: `linear-gradient(135deg, ${bill.gradientFrom}, ${bill.gradientTo})` }}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      {bill.type} {bill.number}
                    </span>
                    <span className="text-4xl">{bill.emoji}</span>
                  </div>
                  <h2 className="text-white text-xl font-bold leading-tight mb-2">{bill.plainTitle}</h2>
                  <p className="text-white/70 text-xs font-medium">{bill.title}</p>
                </div>

                {/* Card body */}
                <div className="bg-white p-5">
                  <p className="text-gray-700 text-sm leading-relaxed mb-5">{bill.summary}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span>🏛️</span>
                      <span className="font-semibold text-gray-700">{bill.committee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📅</span>
                      <span>
                        <span className="font-semibold text-gray-700">{bill.hearingDate}</span>
                        {bill.hearingTime && ` · ${bill.hearingTime}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>📍</span>
                      <span>{bill.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {bill.tags.map((tag) => (
                      <span key={tag} className="bg-ocean-100 text-ocean-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
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
          <div className="text-center text-white px-8">
            <div className="text-5xl mb-4">🌺</div>
            <h2 className="text-xl font-bold mb-2">You've reviewed all bills!</h2>
            <p className="text-ocean-300 text-sm">Mahalo for staying engaged.</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="px-8 pb-12 pt-4 flex items-center justify-center gap-8">
        <button
          onClick={() => swipeProgrammatic(-1)}
          disabled={currentIndex < 0}
          className="w-16 h-16 rounded-full bg-ocean-800 border-2 border-coral-500 flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform disabled:opacity-30"
        >✕</button>
        <div className="text-center">
          <p className="text-ocean-500 text-xs">drag or tap</p>
        </div>
        <button
          onClick={() => swipeProgrammatic(1)}
          disabled={currentIndex < 0}
          className="w-16 h-16 rounded-full bg-ocean-800 border-2 border-palm-500 flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform disabled:opacity-30"
        >✓</button>
      </div>
    </div>
  );
}
