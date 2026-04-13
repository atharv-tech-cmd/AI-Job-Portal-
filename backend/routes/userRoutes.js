import express from "express";
import { analyzeResume, generateResume } from "../controllers/aiController.js";
import { login, logout, register, updateProfile, forgotPassword, resetPassword, verifyEmail, verifyLoginOTP } from "../controllers/userController.js";
import { getAdminStats } from "../controllers/adminController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/verify-login", verifyLoginOTP);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/ai-analyze", isAuthenticated, analyzeResume);
router.get("/ai-generate-resume", isAuthenticated, generateResume);
router.get("/admin/stats", isAuthenticated, getAdminStats);

export default router;
