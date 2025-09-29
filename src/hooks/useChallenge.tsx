import { useContext } from "react";
import ChallengeContext from "../context/ChallengeContext";

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengeProvider");
  }
  return context;
};
