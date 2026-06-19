import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../application/usecases/RegisterUser.usecase.js";
import { COOKIE_NAMES } from "../../../common/constants.js";
import { env } from "../../../config/env.js";
import { LoginUserUseCase } from "../application/usecases/LoginUser.usecase.js";
import { sendCreated, sendSuccess } from "../../../common/response.js";
import { RefreshTokenUseCase } from "../application/usecases/RefreshToken.usecase.js";
import { LogoutUserUseCase } from "../application/usecases/Logout.usecase.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.registerUserUseCase.execute(req.body);

      res.cookie(
        COOKIE_NAMES.REFRESH_TOKEN,
        result.refreshToken,
        COOKIE_OPTIONS,
      );

      sendCreated(
        res,
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        "Account created successfully",
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.loginUserUseCase.execute(req.body);

      res.cookie(
        COOKIE_NAMES.REFRESH_TOKEN,
        result.refreshToken,
        COOKIE_OPTIONS,
      );
      sendSuccess(
        res,
        { accessToken: result.accessToken, user: result.user },
        200,
        "Login Successful",
      );
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "No refresh token provided" });
        return;
      }

      const result = await this.refreshTokenUseCase.execute(token);

      res.cookie(
        COOKIE_NAMES.REFRESH_TOKEN,
        (result as any).refreshToken,
        COOKIE_OPTIONS,
      );

      sendSuccess(res, { accessToken: result.accessToken }, 200);
    } catch (err) {
      next(err);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

      if (token && (req as any).user?.id) {
        await this.logoutUserUseCase.execute((req as any).user.id, token);
      }

      res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, {}, 200, "Logged out successfully");
    } catch (err) {
      next(err);
    }
  };
}
