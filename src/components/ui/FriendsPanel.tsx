import { useFriends } from "../../hooks/useFriends";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";
import StatusIndicator from "./StatusIndicator";

const FriendsPanel = () => {
  const { friends, requests, isPanelOpen, togglePanel, refreshData } =
    useFriends();
  const { user } = useAuth();

  const currentUserId = user ? user.userId : null;

  const incomingRequests = requests.filter(
    (r) => r.addresseeId === currentUserId,
  );
  const outgoingRequests = requests.filter(
    (r) => r.requesterId === currentUserId,
  );

  const sortedFriends = [...friends].sort((a, b) => {
    const statusOrder = { online: 0, away: 1, offline: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const handleAccept = async (requesterId: number) => {
    await axiosPrivate.put(`/friends/accept/${requesterId}`);
    refreshData();
  };

  const handleDeclineOrCancel = async (otherUserId: number) => {
    await axiosPrivate.delete(`/friends/request/${otherUserId}`);
    refreshData();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={togglePanel}
      />
      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-50 transform transition-transform ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 h-full flex flex-col">
          <button
            onClick={togglePanel}
            className="self-end text-slate-400 hover:text-white"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold text-white mb-4">Friends</h2>

          {/* Friend Requests Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-emerald-400 mb-2">
              Friend Requests
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {incomingRequests.length > 0 ? (
                incomingRequests.map((req) => (
                  <div key={req.id} className="bg-slate-800 p-2 rounded-md">
                    <p className="text-sm text-slate-300">
                      {req.requester.displayName ||
                        req.requester.leetcodeUsername}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleAccept(req.requesterId)}
                        className="text-xs bg-green-500/80 px-2 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineOrCancel(req.requesterId)}
                        className="text-xs bg-red-500/80 px-2 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No incoming requests.</p>
              )}
              {outgoingRequests.map((req) => (
                <div key={req.id} className="bg-slate-800 p-2 rounded-md">
                  <p className="text-sm text-slate-300">
                    Request to{" "}
                    {req.addressee.displayName ||
                      req.addressee.leetcodeUsername}
                  </p>
                  <button
                    onClick={() => handleDeclineOrCancel(req.addresseeId)}
                    className="text-xs bg-gray-600 px-2 py-1 rounded mt-1"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Friends List Section */}
          <div className="flex-grow overflow-y-auto">
            <h3 className="font-semibold text-emerald-400 mb-2">
              Friends ({friends.length})
            </h3>
            <div className="space-y-3">
              {sortedFriends.length > 0 ? (
                sortedFriends.map((friend) => (
                  <Link
                    to={`/user/${friend.displayName || friend.leetcodeUsername}`}
                    key={friend.userId}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-800"
                  >
                    <StatusIndicator status={friend.status} />
                    <span className="text-slate-200">
                      {friend.displayName || friend.leetcodeUsername}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-500">
                  Your friends list is empty.
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FriendsPanel;
