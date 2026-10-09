import { Router } from "express";
import {
  createPitch,
  getAllPitches,
  getPitchById,
  getMyPitches,
  updatePitch,
  deletePitch,
} from "../controllers/pitch.controller.js";

import { verifyJWT, optionalJWT } from "../middlewares/auth.middlewares.js";
import { requireRole } from "../middlewares/role.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
  createPitchSchema,
  updatePitchSchema,
  pitchIdSchema,
  getPitchesQuerySchema,
} from "../validators/pitch.validators.js";

import { upload } from "../middlewares/upload.middlewares.js";
import { uploadLimiter } from "../middlewares/rateLimit.middlewares.js";
import { ROLES } from "../constants.js";

const router = Router();

router.get("/", optionalJWT, validate(getPitchesQuerySchema, "query"), getAllPitches);
router.get("/mine", verifyJWT, requireRole(ROLES.FOUNDER), getMyPitches);
router.get("/:pitchId", optionalJWT, validate(pitchIdSchema, "params"), getPitchById);
router.post("/", verifyJWT, requireRole(ROLES.FOUNDER), uploadLimiter, upload.single("video"), validate(createPitchSchema), createPitch);
router.patch("/:pitchId", verifyJWT, validate(pitchIdSchema, "params"), validate(updatePitchSchema), updatePitch);
router.delete("/:pitchId", verifyJWT, validate(pitchIdSchema, "params"), deletePitch);


export default router;
