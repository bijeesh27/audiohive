// src/modules/auth/application/usecases/LogoutUser.usecase.ts
import crypto from "crypto";
import { IUserRepository } from "../../domain/IUserRepository.js";

export class LogoutUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, refreshToken: string): Promise<void> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await this.userRepository.removeRefreshToken(userId, tokenHash);

    await this.userRepository.update(userId, {
      isOnline: false,
      lastSeenAt: new Date(),
    });
  }
}
