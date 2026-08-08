import express from "express";
import authMiddleware from "../middleware/AuthMiddleware.js";
import {signup, login, getCurrentUser, signout} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getCurrentUser", authMiddleware, getCurrentUser);
router.post("/signout", authMiddleware, signout);

export default router;