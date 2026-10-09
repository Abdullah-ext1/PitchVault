import { z } from "zod";
import {
  PITCH_CATEGORIES,
  PITCH_STAGES,
  LOOKING_FOR,
} from "../constants.js";
import { objectIdSchema, paginationSchema, urlSchema } from "./common.validators.js";

export const createPitchSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100).trim(),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(200).trim(),
  problem: z.string().min(20, "Problem description must be at least 20 characters").max(1000).trim(),
  solution: z.string().min(20, "Solution description must be at least 20 characters").max(1000).trim(),
  category: z.enum(PITCH_CATEGORIES),
  stage: z.enum(PITCH_STAGES),
  lookingFor: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.enum(LOOKING_FOR)).min(1, "Select at least one option for looking for")
  ),
  askAmountInr: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(0).optional()
  ),
  equityOfferedBps: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(0).max(10000).optional()
  ),
  websiteUrl: urlSchema,
}).strict();

export const updatePitchSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100).trim().optional(),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(200).trim().optional(),
  problem: z.string().min(20, "Problem description must be at least 20 characters").max(1000).trim().optional(),
  solution: z.string().min(20, "Solution description must be at least 20 characters").max(1000).trim().optional(),
  category: z.enum(PITCH_CATEGORIES).optional(),
  stage: z.enum(PITCH_STAGES).optional(),
  lookingFor: z.preprocess(
    (val) => (typeof val === "string" ? [val] : val),
    z.array(z.enum(LOOKING_FOR)).min(1).optional()
  ),
  askAmountInr: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(0).optional()
  ),
  equityOfferedBps: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(0).max(10000).optional()
  ),
  websiteUrl: urlSchema,
}).strict();

export const pitchIdSchema = z.object({
  pitchId: objectIdSchema,
});

export const getPitchesQuerySchema = paginationSchema.extend({
  sort: z.enum(["new", "top", "trending"]).optional(),
  q: z.string().optional(),
  category: z.enum(PITCH_CATEGORIES).optional(),
  stage: z.enum(PITCH_STAGES).optional(),
  lookingFor: z.enum(LOOKING_FOR).optional(),
});
