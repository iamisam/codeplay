import { useCallback, createContext, useState, type ReactNode } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";

// Define types for our data
interface Friend {
  userId: number;
  displayName: string | null;
  leetcodeUsername: string;
  status: "online" | "away" | "offline";
}

interface FriendRequest {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: "pending";
  requester: { displayName: string | null; leetcodeUsername: string };
  addressee: { displayName: string | null; leetcodeUsername: string };
}

interface FriendsContextType {
  friends: Friend[];
  requests: FriendRequest[];
  isPanelOpen: boolean;
  togglePanel: () => void;
  refreshData: () => void;
}

const FriendsContext = createContext<FriendsContextType | null>(null);

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!accessToken) return;
    try {
      const [friendsRes, requestsRes] = await Promise.all([
        axiosPrivate.get("/friends"),
        axiosPrivate.get("/friends/requests"),
      ]);
      setFriends(friendsRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error("Failed to fetch friends data", error);
    }
  }, [accessToken]); // Dependency on accessToken
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);
  const refreshData = () => fetchData();

  return (
    <FriendsContext.Provider
      value={{ friends, requests, isPanelOpen, togglePanel, refreshData }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsContext;
