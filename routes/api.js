import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const rootRoutes = Router();

rootRoutes.post("/auth/register", AuthController.register);

export default rootRoutes;
