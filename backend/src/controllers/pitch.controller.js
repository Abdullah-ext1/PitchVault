import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Pitch } from "../models/pitch.models.js";
import { parsePagination, buildPaginationResponse } from "../utils/pagination.js";
import { getTrendingPipeline } from "../utils/ranking.js";
import { uploadVideo, deleteFromCloudinary, deleteTempFile } from "../utils/cloudinary.js";

export const createPitch = asyncHandler(async (req, res) => {
  const videoFile = req.file;

  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  let uploadedVideo = null;

  try {
    try {
      uploadedVideo = await uploadVideo(videoFile.path);
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      throw new ApiError(
        500,
        `Video upload failed: ${uploadError.message || "Cloudinary error"}`
      );
    }

    if (!uploadedVideo) {
      throw new ApiError(500, "Failed to upload video to Cloudinary");
    }

    if (uploadedVideo.duration > 120) {
      await deleteFromCloudinary(uploadedVideo.public_id);
      throw new ApiError(422, "Video duration must not exceed 120 seconds");
    }

    const pitchData = {
      ...req.body,
      owner: req.user._id,
      video: {
        publicId: uploadedVideo.public_id,
        secureUrl: uploadedVideo.secure_url,
        thumbnailUrl: uploadedVideo.secure_url.replace(/\.[^.]+$/, ".jpg"),
        durationSec: uploadedVideo.duration,
        bytes: uploadedVideo.bytes,
        format: uploadedVideo.format,
      },
    };

    const pitch = await Pitch.create(pitchData);

    const populatedPitch = await Pitch.findById(pitch._id).populate(
      "owner",
      "fullName role bio linkedinUrl"
    );

    return res
      .status(201)
      .json(new ApiResponse(201, { pitch: populatedPitch }, "Pitch created successfully"));
  } catch (error) {
    if (uploadedVideo) {
      await deleteFromCloudinary(uploadedVideo.public_id);
    }
    throw error;
  } finally {
    deleteTempFile(videoFile?.path);
  }
});

export const getAllPitches = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query.page, req.query.limit);
  const { sort = "trending", q, category, stage, lookingFor } = req.query;

  const filter = {};

  if (q) {
    filter.$text = { $search: q };
  }
  if (category) filter.category = category;
  if (stage) filter.stage = stage;
  if (lookingFor) filter.lookingFor = lookingFor;

  let pitches;
  let total;

  if (sort === "trending") {
    const pipeline = [
      { $match: filter },
      ...getTrendingPipeline(),
      { $skip: skip },
      { $limit: limit },
    ];

    pitches = await Pitch.aggregate(pipeline);
    total = await Pitch.countDocuments(filter);

    await Pitch.populate(pitches, {
      path: "owner",
      select: "fullName role bio linkedinUrl",
    });
  } else {
    const sortOption = sort === "new" ? { createdAt: -1, _id: -1 } : { score: -1, _id: -1 };

    pitches = await Pitch.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("owner", "fullName role bio linkedinUrl");

    total = await Pitch.countDocuments(filter);
  }

  const response = buildPaginationResponse(pitches, total, page, limit);

  return res.status(200).json(new ApiResponse(200, response, "Pitches fetched successfully"));
});

export const getPitchById = asyncHandler(async (req, res) => {
  const pitch = await Pitch.findById(req.params.pitchId).populate(
    "owner",
    "fullName role bio linkedinUrl"
  );

  if (!pitch) {
    throw new ApiError(404, "Pitch not found");
  }

  return res.status(200).json(new ApiResponse(200, { pitch }, "Pitch fetched successfully"));
});

export const getMyPitches = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query.page, req.query.limit);

  const pitches = await Pitch.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Pitch.countDocuments({ owner: req.user._id });

  const response = buildPaginationResponse(pitches, total, page, limit);

  return res.status(200).json(new ApiResponse(200, response, "Your pitches fetched successfully"));
});

export const updatePitch = asyncHandler(async (req, res) => {
  const pitch = await Pitch.findOneAndUpdate(
    { _id: req.params.pitchId, owner: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate("owner", "fullName role bio linkedinUrl");

  if (!pitch) {
    throw new ApiError(404, "Pitch not found");
  }

  return res.status(200).json(new ApiResponse(200, { pitch }, "Pitch updated successfully"));
});

export const deletePitch = asyncHandler(async (req, res) => {
  const pitch = await Pitch.findOneAndDelete({
    _id: req.params.pitchId,
    owner: req.user._id,
  });

  if (!pitch) {
    throw new ApiError(404, "Pitch not found");
  }

  if (pitch.video?.publicId) {
    await deleteFromCloudinary(pitch.video.publicId);
  }

  return res.status(200).json(new ApiResponse(200, {}, "Pitch deleted successfully"));
});
