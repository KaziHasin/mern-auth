import express from "express";
const router = express.Router();

import {
  register,
  login,
  logout,
  resetPassword,
  generateNewPassword,
  changePassword,
  getProfile,
  updateProfile,
  updateImage,
  deleteUser,
} from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", auth, logout);
router.post("/auth/reset-password", resetPassword);
router.post("/auth/generate-new-password/:token", generateNewPassword);
router.post("/auth/change-password", auth, changePassword);
router.put("/profile/image", auth, updateImage);
router
  .route("/profile")
  .get(auth, getProfile)
  .put(auth, updateProfile)
  .delete(auth, deleteUser);

export default router;
