export interface JwtPayload {
  userId: string;
  role: string;
}

export interface RefreshPayload {
  userId: string;
}

export interface IJwtService {
  generateAccessToken(userId: string, role: string): string;
  generateRefreshToken(userId: string): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): RefreshPayload;
}
