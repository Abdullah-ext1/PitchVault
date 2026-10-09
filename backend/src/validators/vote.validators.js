import { z } from "zod";

export const voteSchema = z.object({
  value: z.number().int().refine((val) => val === 1 || val === -1 || val === 0, {
    message: "Vote value must be 1 (upvote), -1 (downvote), or 0 (remove vote)",
  }),
}).strict();
