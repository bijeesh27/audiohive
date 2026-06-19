import crypto from "crypto";
import { IUserRepository } from "../../domain/IUserRepository.js";
import { IJwtService } from "../../domain/IJwtService.js";
import { InvalidTokenError } from "../../domain/auth.errors.js";
import { RefreshResultDTO } from "../dto/auth.dto.js";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshResultDTO> {
    let payload: { userId: string };
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new InvalidTokenError();
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const isValid = await this.userRepository.hasRefreshToken(
      payload.userId,
      tokenHash,
    );
    if (!isValid) throw new InvalidTokenError();

    const user = await this.userRepository.findById(payload.userId);
    if (!user) throw new InvalidTokenError();

    await this.userRepository.removeRefreshToken(payload.userId, tokenHash);

    const newAccessToken = this.jwtService.generateAccessToken(
      user.id,
      user.role,
    );
    const newRefreshToken = this.jwtService.generateRefreshToken(user.id);

    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await this.userRepository.addRefreshToken(user.id, newTokenHash);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
