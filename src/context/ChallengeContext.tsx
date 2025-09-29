import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";

// Define the type for a challenge invitation
interface ChallengeInvite {
  id: number;
  challengerId: number;
  recipientId: number;
  problemTitleSlug: string;
  status: "pending";
  challenger: { displayName: string | null; leetcodeUsername: string };
  recipient: { displayName: string | null; leetcodeUsername: string };
}

interface ChallengeContextType {
  invites: ChallengeInvite[];
  refreshInvites: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | null>(null);

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [invites, setInvites] = useState<ChallengeInvite[]>([]);

  const fetchInvites = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await axiosPrivate.get("/challenge/invites");
      setInvites(response.data);
    } catch (error) {
      console.error("Failed to fetch challenge invites", error);
    }
  }, [accessToken]);

  useEffect(() => {
    // Fetch invites when the user logs in
    if (accessToken) {
      fetchInvites();
    }
  }, [accessToken, fetchInvites]);

  const refreshInvites = () => fetchInvites();

  return (
    <ChallengeContext.Provider value={{ invites, refreshInvites }}>
      {children}
    </ChallengeContext.Provider>
  );
};

export default ChallengeContext;
