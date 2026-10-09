import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Vote } from "../models/vote.models.js";
import { Pitch } from "../models/pitch.models.js";

export const votePitch = asyncHandler(async (req, res) => {
  const { pitchId } = req.params;
  const { value } = req.body;
  const userId = req.user._id;

  const pitch = await Pitch.findById(pitchId);

  if (!pitch) {
    throw new ApiError(404, "Pitch not found");
  }

  if (pitch.owner.toString() === userId.toString()) {
    throw new ApiError(403, "You cannot vote on your own pitch");
  }

  let oldValue = 0;
  let existingVote = null;

  if (value === 0) {
    existingVote = await Vote.findOneAndDelete({ user: userId, pitch: pitchId });
    oldValue = existingVote ? existingVote.value : 0;
  } else {
    try {
      existingVote = await Vote.findOneAndUpdate(
        { user: userId, pitch: pitchId },
        { $set: { value } },
        { upsert: true, new: false }
      );
      oldValue = existingVote ? existingVote.value : 0;
    } catch (error) {
      if (error.code === 11000) {
        existingVote = await Vote.findOneAndUpdate(
          { user: userId, pitch: pitchId },
          { $set: { value } },
          { new: false }
        );
        oldValue = existingVote ? existingVote.value : 0;
      } else {
        throw error;
      }
    }
  }

  const newValue = value;

  const dUp = (newValue === 1 ? 1 : 0) - (oldValue === 1 ? 1 : 0);
  const dDown = (newValue === -1 ? 1 : 0) - (oldValue === -1 ? 1 : 0);

  if (dUp !== 0 || dDown !== 0) {
    await Pitch.findByIdAndUpdate(pitchId, {
      $inc: {
        upvoteCount: dUp,
        downvoteCount: dDown,
        score: dUp - dDown,
      },
    });
  }

  const updatedPitch = await Pitch.findById(pitchId).select("upvoteCount downvoteCount score");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        upvoteCount: updatedPitch.upvoteCount,
        downvoteCount: updatedPitch.downvoteCount,
        score: updatedPitch.score,
        myVote: newValue,
      },
      "Vote recorded successfully"
    )
  );
});
