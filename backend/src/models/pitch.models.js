import mongoose, { Schema } from "mongoose";
import {
  PITCH_CATEGORIES,
  PITCH_STAGES,
  LOOKING_FOR,
} from "../constants.js";

const pitchSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    problem: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: PITCH_CATEGORIES,
      required: true,
    },
    stage: {
      type: String,
      enum: PITCH_STAGES,
      required: true,
    },
    lookingFor: {
      type: [String],
      enum: LOOKING_FOR,
      required: true,
      validate: [
        (arr) => arr.length > 0,
        "At least one looking for option is required",
      ],
    },
    askAmountInr: {
      type: Number,
      min: 0,
    },
    equityOfferedBps: {
      type: Number,
      min: 0,
      max: 10000,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    video: {
      publicId: String,
      secureUrl: String,
      thumbnailUrl: String,
      durationSec: Number,
      bytes: Number,
      format: String,
    },
    upvoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    downvoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    score: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

pitchSchema.index({ title: "text", tagline: "text", problem: "text", solution: "text" });
pitchSchema.index({ score: -1, _id: -1 });
pitchSchema.index({ createdAt: -1, _id: -1 });
pitchSchema.index({ owner: 1, createdAt: -1 });
pitchSchema.index({ category: 1, stage: 1 });

export const Pitch = mongoose.model("Pitch", pitchSchema);
