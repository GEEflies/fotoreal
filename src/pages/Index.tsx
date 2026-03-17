import { useState, useEffect } from "react";
import { AvatarSelector, getStoredAvatar, type AvatarType } from "@/components/AvatarSelector";
import LandingA from "./LandingA";
import LandingB from "./LandingB";

const Index = () => {
  const [avatar, setAvatar] = useState<AvatarType>(getStoredAvatar);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    if (!avatar) {
      // Small delay so the page doesn't flash the selector immediately
      const t = setTimeout(() => setShowSelector(true), 400);
      return () => clearTimeout(t);
    }
  }, [avatar]);

  const handleSelect = (selected: AvatarType) => {
    setAvatar(selected);
    setShowSelector(false);
  };

  // No avatar selected yet — show blank + selector
  if (!avatar) {
    return (
      <div className="min-h-screen bg-background">
        {showSelector && <AvatarSelector onSelect={handleSelect} />}
      </div>
    );
  }

  // Route to correct LP
  return avatar === "photographer" ? <LandingA /> : <LandingB />;
};

export default Index;
