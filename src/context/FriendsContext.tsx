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
  recipientId: number;
  status: "pending";
  requester: { displayName: string | null; leetcodeUsername: string };
  recipient: { displayName: string | null; leetcodeUsername: string };
}

interface FriendsContextType {
  friends: Friend[];
  requests: FriendRequest[];
  isPanelOpen: boolean;
  refreshTimestamp: number;
  togglePanel: () => void;
  refreshData: () => void;
}

const FriendsContext = createContext<FriendsContextType | null>(null);

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now());

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

  const togglePanel = () => {
    // If the panel is currently closed and is about to be opened, fetch data.
    if (!isPanelOpen) {
      fetchData();
    }
    setIsPanelOpen((prev) => !prev);
  };
  const refreshData = () => {
    fetchData();
    setRefreshTimestamp(Date.now());
  };

  return (
    <FriendsContext.Provider
      value={{
        friends,
        requests,
        isPanelOpen,
        refreshTimestamp,
        togglePanel,
        refreshData,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsContext;
