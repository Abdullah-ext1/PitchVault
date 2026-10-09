import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const VoteButtons = ({
  pitchId,
  initialUpvotes,
  initialDownvotes,
  initialScore,
  initialMyVote,
  isOwner,
}) => {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes || 0);
  const [downvoteCount, setDownvoteCount] = useState(initialDownvotes || 0);
  const [score, setScore] = useState(initialScore || 0);
  const [myVote, setMyVote] = useState(initialMyVote || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVote = async (value) => {
    if (!user) {
      setError("Please login to vote");
      return;
    }

    if (isOwner) {
      setError("You cannot vote on your own pitch");
      return;
    }

    const previousState = { upvoteCount, downvoteCount, score, myVote };
    const newMyVote = myVote === value ? 0 : value;

    const dUp = (newMyVote === 1 ? 1 : 0) - (myVote === 1 ? 1 : 0);
    const dDown = (newMyVote === -1 ? 1 : 0) - (myVote === -1 ? 1 : 0);

    setUpvoteCount(upvoteCount + dUp);
    setDownvoteCount(downvoteCount + dDown);
    setScore(score + dUp - dDown);
    setMyVote(newMyVote);
    setError("");

    setLoading(true);

    try {
      let response;
      try {
        response = await API.put(`/votes/${pitchId}`, { value: newMyVote });
      } catch (err) {
        if (err.response?.status === 404) {
          response = await API.put(`/pitches/${pitchId}/vote`, {
            value: newMyVote,
          });
        } else {
          throw err;
        }
      }
      const data = response.data.data;

      setUpvoteCount(data.upvoteCount);
      setDownvoteCount(data.downvoteCount);
      setScore(data.score);
      setMyVote(data.myVote);
    } catch (err) {
      setUpvoteCount(previousState.upvoteCount);
      setDownvoteCount(previousState.downvoteCount);
      setScore(previousState.score);
      setMyVote(previousState.myVote);
      setError(err.response?.data?.message || "Failed to vote");
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <span className="small muted">
        Your pitch · {upvoteCount} up · {downvoteCount} down · Score {score}
      </span>
    );
  }

  return (
    <div className="col g6">
      <div className="row wrap g8 center">
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={loading}
          className={`btn btn-outline btn-sm ${myVote === 1 ? "is-up" : ""}`}
          aria-pressed={myVote === 1}
        >
          Upvote {upvoteCount}
        </button>

        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={loading}
          className={`btn btn-outline btn-sm ${myVote === -1 ? "is-down" : ""}`}
          aria-pressed={myVote === -1}
        >
          Downvote {downvoteCount}
        </button>
      </div>

      {error && <p className="err">{error}</p>}
    </div>
  );
};

export default VoteButtons;
