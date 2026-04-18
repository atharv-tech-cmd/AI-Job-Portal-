import express from "express";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/applicationController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);

export default router;
