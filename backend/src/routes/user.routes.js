import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validate.middlewares.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from "../validators/user.validators.js";
import { authLimiter, loginLimiter } from "../middlewares/rateLimit.middlewares.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", authLimiter, refreshAccessToken);
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/me", verifyJWT, validate(updateProfileSchema), updateProfile);

export default router;
