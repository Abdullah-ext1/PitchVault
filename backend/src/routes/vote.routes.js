import { Router } from "express";
import { votePitch } from "../controllers/vote.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import { pitchIdSchema } from "../validators/pitch.validators.js";
import { voteSchema } from "../validators/vote.validators.js";
import { voteLimiter } from "../middlewares/rateLimit.middlewares.js";

const router = Router();

// PUT /api/v1/votes/:pitchId — cast, change, or remove a vote
router.put(
  "/:pitchId",
  verifyJWT,
  voteLimiter,
  validate(pitchIdSchema, "params"),
  validate(voteSchema),
  votePitch
);

export default router;
