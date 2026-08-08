import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {getUser, getAllUsers, updateUser, deleteUser} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", authMiddleware, getUser);
router.get("/", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;