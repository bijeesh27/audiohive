import { Router } from "express";

import { UserRepository } from "../infrastructure/UserRepository.js";
import { JwtService } from "../infrastructure/JwtService.js";

import { RegisterUserUseCase } from "../application/usecases/RegisterUser.usecase.js";

import { AuthController } from "./auth.controller.js";
import { authRateLimiter } from "../../../middleware/rateLimiter.js";
import { LoginUserUseCase } from "../application/usecases/LoginUser.usecase.js";
import { RefreshTokenUseCase } from "../application/usecases/RefreshToken.usecase.js";
import { LogoutUserUseCase } from "../application/usecases/Logout.usecase.js";

const userRepository = new UserRepository();
const jwtService = new JwtService();

const controller = new AuthController(
  new RegisterUserUseCase(userRepository, jwtService),
  new LoginUserUseCase(userRepository, jwtService),
  new RefreshTokenUseCase(userRepository, jwtService),
  new LogoutUserUseCase(userRepository),
);

const router = Router();

router.post("/register", authRateLimiter, controller.register);
router.post("/login", authRateLimiter, controller.login);
router.post("/refresh-token", controller.refreshToken);
router.post('/logout',controller.logout)

export default router;
