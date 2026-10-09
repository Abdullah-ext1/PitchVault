import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROLES } from "../constants.js";

const investorProfileSchema = new Schema(
  {
    firmName: {
      type: String,
      trim: true,
    },
    sectors: {
      type: [String],
      default: [],
    },
    stages: {
      type: [String],
      default: [],
    },
    checkMinInr: {
      type: Number,
      min: 0,
    },
    checkMaxInr: {
      type: Number,
      min: 0,
    },
    isListed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      immutable: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    investorProfile: {
      type: investorProfileSchema,
      default: null,
    },
    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.toPublicJSON = function () {
  const obj = {
    _id: this._id,
    fullName: this.fullName,
    role: this.role,
    bio: this.bio,
    linkedinUrl: this.linkedinUrl,
  };

  if (
    this.role === ROLES.INVESTOR &&
    this.investorProfile?.isListed
  ) {
    obj.investorProfile = this.investorProfile;
  }

  return obj;
};

export const User = mongoose.model("User", userSchema);
