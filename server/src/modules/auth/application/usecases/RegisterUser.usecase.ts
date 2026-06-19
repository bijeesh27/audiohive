import bcrypt from "bcryptjs";
import { IUserRepository } from "../../domain/IUserRepository.js";
import { IJwtService } from "../../domain/IJwtService.js";
import { UserAlreadyExistsError } from "../../domain/auth.errors.js";
import { AuthResultDTO, RegisterUserDTO } from "../dto/auth.dto.js";
import { UserRole } from "../../domain/User.entity.js";
import crypto from "crypto";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<AuthResultDTO> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) throw new UserAlreadyExistsError();

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      role: dto.role ?? UserRole.MEMBER,
      workspaceId: dto.workspaceId ?? null,
    });

    const accessToken = this.jwtService.generateAccessToken(user.id, user.role);
    const refreshToken = this.jwtService.generateRefreshToken(user.id);

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await this.userRepository.addRefreshToken(user.id, tokenHash);

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
