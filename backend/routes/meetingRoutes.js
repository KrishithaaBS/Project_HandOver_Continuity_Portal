import express from "express";
import { getAllMeetings, getMeetingById, getMeetingsByProject, createMeeting, updateMeeting, deleteMeeting } from "../controllers/meetingController.js";
import authMiddleware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/meetings", authMiddleware, getAllMeetings);
router.get("/meetings/:id", authMiddleware, getMeetingById);
router.get("/project/:projectId", authMiddleware, getMeetingsByProject);
router.post("/projects/:projectId/meetings", authMiddleware, createMeeting);
router.put("/meetings/:id", authMiddleware, updateMeeting);
router.delete("/meetings/:id", authMiddleware, deleteMeeting);

export default router;