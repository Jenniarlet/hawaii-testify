import { useState, useEffect } from "react";
import { getProfile } from "./utils/storage";
import { fetchHawaiiBills } from "./utils/legiscan";
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

  // Load bills from LegiScan (or mock fallback) on mount
  useEffect(() => {
    fetchHawaiiBills().then((b) => {
      setBills(b);
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
            <p className="text-ocean-300 text-sm font-medium">Loading Hawaii State Legislature bills…</p>
            <p className="text-ocean-600 text-xs">Powered by LegiScan</p>
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
