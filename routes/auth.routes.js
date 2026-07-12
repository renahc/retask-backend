import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { RegisterSchema, LoginSchema } from "../schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validateSchema(RegisterSchema),
  AuthController.register,
);

authRouter.post("/login", validateSchema(LoginSchema), AuthController.login);
authRouter.get("/me", authMiddleware, AuthController.me);
