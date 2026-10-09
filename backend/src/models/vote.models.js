import mongoose, { Schema } from "mongoose";

const voteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pitch: {
      type: Schema.Types.ObjectId,
      ref: "Pitch",
      required: true,
    },
    value: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

voteSchema.index({ user: 1, pitch: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
