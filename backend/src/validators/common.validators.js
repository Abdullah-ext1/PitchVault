import { z } from "zod";

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const emailSchema = z.string().email().toLowerCase().trim();

export const urlSchema = z.preprocess(
  (val) => (val === "" || val === null ? undefined : val),
  z.string().url().optional()
);
