/**
 * Application-wide constants
 */

export const DB_NAME = "pitch-vault";

export const ROLES = {
  FOUNDER: "founder",
  INVESTOR: "investor",
};

export const PITCH_CATEGORIES = [
  "FinTech",
  "HealthTech",
  "EdTech",
  "SaaS",
  "AI",
  "Consumer",
  "Climate",
  "Other",
];

export const PITCH_STAGES = ["Idea", "MVP", "Launched", "Revenue"];

export const LOOKING_FOR = [
  "Funding",
  "Mentorship",
  "CoFounder",
  "BetaUsers",
  "Introductions",
];

export const INTRO_REQUEST_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  WITHDRAWN: "withdrawn",
};
