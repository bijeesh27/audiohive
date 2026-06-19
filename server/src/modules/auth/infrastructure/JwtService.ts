import jwt from "jsonwebtoken";
import {
  IJwtService,
  JwtPayload,
  RefreshPayload,
} from "../domain/IJwtService.js";
import { env } from "../../../config/env.js";
import { InvalidTokenError } from "../domain/auth.errors.js";

export class JwtService implements IJwtService {
  generateAccessToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
    });
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    } catch {
      throw new InvalidTokenError();
    }
  }

  verifyRefreshToken(token: string): RefreshPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload;
    } catch {
      throw new InvalidTokenError();
    }
  }
}
