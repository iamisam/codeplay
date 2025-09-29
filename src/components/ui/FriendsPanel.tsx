import { Link } from "react-router-dom";
import { useFriends } from "../../hooks/useFriends";
import useAuth from "../../hooks/useAuth";
import { axiosPrivate } from "../../api/axios";
import StatusIndicator from "./StatusIndicator";
import { useChallenges } from "../../hooks/useChallenge";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const FriendsPanel = () => {
  const { friends, requests, isPanelOpen, togglePanel, refreshData } =
    useFriends();
  const { invites, refreshInvites } = useChallenges();
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUserId = user ? user.userId : null;
  const pollingIntervals = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});

  const incomingRequests = requests.filter(
    (r) => r.recipientId === currentUserId,
  );
  const outgoingRequests = requests.filter(
    (r) => r.requesterId === currentUserId,
  );

  const incomingInvites = invites.filter(
    (i) => i.recipientId === currentUserId,
  );
  const outgoingInvites = invites.filter(
    (i) => i.challengerId === currentUserId,
  );
  const handleAcceptChallenge = async (challengeId: number) => {
    await axiosPrivate.put(`/challenge/invites/${challengeId}/accept`);
    refreshInvites();
    navigate(`/challenge/${challengeId}`);
  };

  useEffect(() => {
    const intervals = pollingIntervals.current;

    outgoingInvites.forEach((invite) => {
      if (!intervals[invite.id]) {
        intervals[invite.id] = setInterval(async () => {
          try {
            const res = await axiosPrivate.get(
              `/challenge/${invite.id}/status`,
            );
            if (res.data.status !== "pending") {
              refreshInvites();
              if (intervals[invite.id]) {
                clearInterval(intervals[invite.id]);
                delete intervals[invite.id];
              }
            }
          } catch (error) {
            if (error instanceof Error) {
              console.log(error);
            }
            if (intervals[invite.id]) {
              clearInterval(intervals[invite.id]);
              delete intervals[invite.id];
            }
          }
        }, 10000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [outgoingInvites, refreshInvites]);

  const handleDeclineChallenge = async (challengeId: number) => {
    await axiosPrivate.delete(`/challenge/invites/${challengeId}/decline`);
    refreshInvites();
  };

  // Sorting logic for friends list: online > away > offline
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Friends</h2>
            <button
              onClick={togglePanel}
              className="text-slate-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>

          {/* Challenge Invitations Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-purple-400 mb-2 text-sm">
              Challenges
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {incomingInvites.length > 0 ? (
                incomingInvites.map((invite) => (
                  <div
                    key={`invite-in-${invite.id}`}
                    className="bg-slate-800 p-2 rounded-md"
                  >
                    <p className="text-xs text-slate-400">
                      From:{" "}
                      {invite.challenger.displayName ||
                        invite.challenger.leetcodeUsername}
                    </p>
                    <p className="text-sm text-slate-200 truncate">
                      {invite.problemTitleSlug}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleAcceptChallenge(invite.id)}
                        className="text-xs bg-green-500/80 px-2 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineChallenge(invite.id)}
                        className="text-xs bg-red-500/80 px-2 py-1 rounded"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No pending challenges.</p>
              )}
              {outgoingInvites.map((invite) => (
                <div
                  key={`invite-out-${invite.id}`}
                  className="bg-slate-800 p-2 rounded-md"
                >
                  <p className="text-xs text-slate-400">
                    To:{" "}
                    {invite.recipient.displayName ||
                      invite.recipient.leetcodeUsername}
                  </p>
                  <p className="text-sm text-slate-200 truncate">
                    {invite.problemTitleSlug}
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">
                    Waiting for response...
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Friend Requests Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-emerald-400 mb-2 text-sm">
              Friend Requests
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {incomingRequests.length > 0 ? (
                incomingRequests.map((req) => (
                  <div
                    key={`incoming-${req.id}`}
                    className="bg-slate-800 p-2 rounded-md flex justify-between items-center"
                  >
                    <p className="text-sm text-slate-300 truncate">
                      {req.requester?.displayName ||
                        req.requester?.leetcodeUsername ||
                        "Unknown User"}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req.requesterId)}
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-green-500/80 hover:bg-green-500 text-white transition-colors"
                        title="Accept"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeclineOrCancel(req.requesterId)}
                        className="h-7 w-7 flex items-center justify-center rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                        title="Decline"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No incoming requests.</p>
              )}
              {outgoingRequests.map((req) => (
                <div
                  key={`outgoing-${req.id}`}
                  className="bg-slate-800 p-2 rounded-md flex justify-between items-center"
                >
                  <p className="text-sm text-slate-300 truncate">
                    Request to{" "}
                    {req.recipient?.displayName ||
                      req.recipient?.leetcodeUsername ||
                      "Unknown User"}
                  </p>
                  <button
                    onClick={() => handleDeclineOrCancel(req.recipientId)}
                    className="text-xs bg-slate-700 hover:bg-red-500 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Friends List Section */}
          <div className="flex-grow overflow-y-auto pr-2">
            <h3 className="font-semibold text-emerald-400 mb-2 text-sm">
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
                    <span className="text-slate-200 truncate">
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
