import { z } from "zod";
import { ROLES, PITCH_STAGES, PITCH_CATEGORIES } from "../constants.js";
import { emailSchema, urlSchema } from "./common.validators.js";

export const registerSchema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: emailSchema,
  password: z.string().min(8).max(100),
  role: z.enum([ROLES.FOUNDER, ROLES.INVESTOR]),
}).strict();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
}).strict();

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).trim().optional(),
  bio: z.string().max(500).trim().optional(),
  linkedinUrl: urlSchema,
  investorProfile: z.object({
    firmName: z.string().trim().optional(),
    sectors: z.array(z.enum(PITCH_CATEGORIES)).optional(),
    stages: z.array(z.enum(PITCH_STAGES)).optional(),
    checkMinInr: z.number().int().min(0).optional(),
    checkMaxInr: z.number().int().min(0).optional(),
    isListed: z.boolean().optional(),
  }).optional(),
}).strict();
