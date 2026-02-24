import { useState, useEffect } from "react";
import { getProfile } from "./utils/storage";
import Onboarding from "./components/Onboarding";
import SwipeFeed from "./components/SwipeFeed";
import Prompts from "./components/Prompts";
import TestimonyView from "./components/TestimonyView";
import SubmitScreen from "./components/SubmitScreen";

// Screens: onboarding | feed | prompts | testimony | submit
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [profile, setProfile] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [promptData, setPromptData] = useState(null);
  const [feedKey, setFeedKey] = useState(0); // reset feed after submit

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
    setScreen("feed"); // stays on feed, shows the all-done state
  }

  function handlePromptsSubmit(data) {
    setPromptData(data);
    setScreen("testimony");
  }

  function handlePromptsBack() {
    setScreen("feed");
    setSelectedBill(null);
  }

  function handleTestimonyBack() {
    setScreen("prompts");
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
        <SwipeFeed
          key={feedKey}
          profile={profile}
          onSwipeRight={handleSwipeRight}
          onAllDone={handleAllDone}
        />
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
          onBack={handleTestimonyBack}
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
