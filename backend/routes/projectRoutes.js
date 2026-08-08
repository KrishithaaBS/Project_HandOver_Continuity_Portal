import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, getMyProjects } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", authMiddleware, getAllProjects);
router.get("/mine", authMiddleware, getMyProjects);
router.get("/:id", authMiddleware, getProjectById);
router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;