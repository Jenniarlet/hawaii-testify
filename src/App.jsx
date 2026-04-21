// =============================================================================
// src/App.jsx — Root Component & App-Level State Manager
// =============================================================================
// What it is:
//   The single top-level React component. Owns all shared state and controls
//   which screen is currently visible. Acts as the router for this single-page app.
//
// Screen flow:
//   loading → onboarding (first time only) → feed → prompts → testimony → submit
//                ↑__________________________________________↓  (loop back)
//
// Data fetching:
//   On mount, fetches bills from TWO sources in parallel:
//     1. LegiScan (Hawaii State Legislature) via src/utils/legiscan.js
//        → calls /api/legiscan → https://api.legiscan.com/
//     2. Legistar (Honolulu City Council) via src/utils/legistar.js
//        → calls /api/legistar → https://webapi.legistar.com/v1/honolulu/
//   Results are merged into one bills[] array passed to SwipeFeed.
//
// State managed here (passed down as props):
//   bills[]       → all fetched bills (state + county, merged)
//   profile       → user's onboarding answers (island, role, interests)
//   selectedBill  → the bill the user swiped right on
//   promptData    → stance/reason/story collected in Prompts screen
// =============================================================================

import { useState, useEffect } from "react";
import { getProfile } from "./utils/storage";
import { fetchHawaiiBills } from "./utils/legiscan";
import { fetchHonoluluBills } from "./utils/legistar";
import Onboarding from "./components/Onboarding";
import SwipeFeed from "./components/SwipeFeed";
import Prompts from "./components/Prompts";
import TestimonyView from "./components/TestimonyView";
import SubmitScreen from "./components/SubmitScreen";

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [bills, setBills] = useState([]);
  const [billsLoading, setBillsLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [promptData, setPromptData] = useState(null);
  const [feedKey, setFeedKey] = useState(0);

  // Load bills from both LegiScan (state) and Legistar (Honolulu City Council) on mount
  useEffect(() => {
    Promise.all([fetchHawaiiBills(), fetchHonoluluBills()]).then(([state, county]) => {
      setBills([...state, ...county]);
      setBillsLoading(false);
    });
  }, []);

  // Check if user has already onboarded
  useEffect(() => {
    const saved = getProfile();
    if (saved) {
      setProfile(saved);
      setScreen("feed");
    } else {
      setScreen("onboarding");
    }
  }, []);

  function handleOnboardingComplete(p) {
    setProfile(p);
    setScreen("feed");
  }

  function handleSwipeRight(bill) {
    setSelectedBill(bill);
    setScreen("prompts");
  }

  function handleAllDone() {
    setScreen("feed");
  }

  function handlePromptsSubmit(data) {
    setPromptData(data);
    setScreen("testimony");
  }

  function handlePromptsBack() {
    setScreen("feed");
    setSelectedBill(null);
  }

  function handleGoToSubmit() {
    setScreen("submit");
  }

  function handleDone() {
    setSelectedBill(null);
    setPromptData(null);
    setFeedKey((k) => k + 1);
    setScreen("feed");
  }

  if (screen === "loading") {
    return (
      <div className="flex items-center justify-center h-full bg-ocean-900">
        <div className="text-4xl animate-pulse">🌺</div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-md mx-auto relative overflow-hidden bg-ocean-900 shadow-2xl">
      {screen === "onboarding" && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {screen === "feed" && (
        billsLoading ? (
          <div className="flex flex-col items-center justify-center h-full bg-ocean-900 gap-4">
            <div className="text-5xl animate-pulse">🌺</div>
            <p className="text-ocean-300 text-sm font-medium">Loading Hawaii bills…</p>
            <p className="text-ocean-600 text-xs">State Legislature + Honolulu City Council</p>
          </div>
        ) : (
          <SwipeFeed
            key={feedKey}
            bills={bills}
            profile={profile}
            onSwipeRight={handleSwipeRight}
            onAllDone={handleAllDone}
          />
        )
      )}

      {screen === "prompts" && selectedBill && (
        <Prompts
          bill={selectedBill}
          onSubmit={handlePromptsSubmit}
          onSkip={handlePromptsBack}
        />
      )}

      {screen === "testimony" && selectedBill && promptData && (
        <TestimonyView
          bill={selectedBill}
          profile={profile}
          promptData={promptData}
          onBack={() => setScreen("prompts")}
          onSubmit={handleGoToSubmit}
        />
      )}

      {screen === "submit" && selectedBill && (
        <SubmitScreen
          bill={selectedBill}
          onDone={handleDone}
        />
      )}
    </div>
  );
}
