import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { getRequests, createRequest, updateRequest, ViewMyRequests, ViewPendingRequests } from "../controllers/requestController.js";

const router = express.Router();

router.get("/requests/pending", authMiddleware, ViewPendingRequests);
router.get("/requests/mine", authMiddleware, ViewMyRequests);
router.get("/projects/:projectId/requests", authMiddleware, getRequests);
router.post("/projects/:projectId/requests", authMiddleware, createRequest);
router.put("/requests/:id", authMiddleware, updateRequest);

export default router;