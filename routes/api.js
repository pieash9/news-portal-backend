import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import ProfileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/Authenticate.js";

const rootRoutes = Router();

rootRoutes.post("/auth/register", AuthController.register);
rootRoutes.post("/auth/login", AuthController.login);

// profile routes
rootRoutes.get("/profile", authMiddleware, ProfileController.index);

export default rootRoutes;
