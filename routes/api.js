import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const rootRoutes = Router();

rootRoutes.post("/auth/register", AuthController.register);
rootRoutes.post("/auth/login", AuthController.login);

export default rootRoutes;
