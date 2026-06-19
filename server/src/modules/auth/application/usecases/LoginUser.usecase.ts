import bcrypt from "bcryptjs";
import crypto from "crypto";
import { IUserRepository } from "../../domain/IUserRepository.js";
import { IJwtService } from "../../domain/IJwtService.js";
import {
  InvalidCredentialsError,
  AccountSuspendedError,
} from "../../domain/auth.errors.js";
import { LoginUserDTO, AuthResultDTO } from "../dto/auth.dto.js";
import { UserStatus } from "../../domain/User.entity.js";

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(dto: LoginUserDTO): Promise<AuthResultDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new InvalidCredentialsError();

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordMatch) throw new InvalidCredentialsError();

    if (user.status === UserStatus.SUSPENDED) throw new AccountSuspendedError();

    const accessToken = this.jwtService.generateAccessToken(user.id, user.role);
    const refreshToken = this.jwtService.generateRefreshToken(user.id);

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await this.userRepository.addRefreshToken(user.id, tokenHash);

    await this.userRepository.update(user.id, {
      isOnline: true,
      lastSeenAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        workspaceId: user.workspaceId,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
