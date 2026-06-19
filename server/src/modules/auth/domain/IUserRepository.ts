import { UserEntity } from "./User.entity.js";

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  workspaceId?: string | null;
}

export interface UpdateUserData {
  name?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeenAt?: Date;
  status?: string;
  role?: string;
}

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: string, data: UpdateUserData): Promise<UserEntity | null>;

  addRefreshToken(userId: string, tokenHash: string): Promise<void>;
  removeRefreshToken(userId: string, tokenHash: string): Promise<void>;
  hasRefreshToken(userId: string, tokenHash: string): Promise<boolean>;
  clearAllRefreshTokens(userId: string): Promise<void>;

  // setPasswordResetToken(
  //   userId: string,
  //   tokenHash: string,
  //   expiresAt: Date,
  // ): Promise<void>;
  // findByPasswordResetToken(tokenHash: string): Promise<UserEntity | null>;
  // clearPasswordResetToken(userId: string): Promise<void>;
  // updatePassword(userId: string, passwordHash: string): Promise<void>;
}
