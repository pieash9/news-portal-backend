import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import ProfileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/Authenticate.js";
import NewsController from "../controllers/NewsController.js";

const rootRoutes = Router();

rootRoutes.post("/auth/register", AuthController.register);
rootRoutes.post("/auth/login", AuthController.login);

// profile routes
rootRoutes.get("/profile", authMiddleware, ProfileController.index);
rootRoutes.put("/profile", authMiddleware, ProfileController.update);

// news routes
rootRoutes.get("/news", NewsController.index);
rootRoutes.post("/news", authMiddleware, NewsController.store);
rootRoutes.get("/news/:id", NewsController.show);
rootRoutes.put("/news/:id", authMiddleware, NewsController.update);
rootRoutes.delete("/news/:id", authMiddleware, NewsController.destroy);

export default rootRoutes;
