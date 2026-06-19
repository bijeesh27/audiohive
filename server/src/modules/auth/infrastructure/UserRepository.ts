import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from "../domain/IUserRepository.js";
import { UserEntity, UserRole, UserStatus } from "../domain/User.entity.js";
import { UserModel, IUserDocument } from "./user.schema.js";

export class UserRepository implements IUserRepository {
  private toDomain(doc: IUserDocument): UserEntity {
    return new UserEntity(
      (doc._id as any).toString(),
      doc.name,
      doc.email,
      doc.passwordHash,
      doc.role as UserRole,
      doc.workspaceId?.toString() ?? null,
      doc.status as UserStatus,
      doc.avatarUrl ?? null,
      doc.isOnline,
      doc.lastSeenAt ?? null,
      doc.createdAt as Date,
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await UserModel.findById(id)
      .select("+passwordHash +refreshTokens")
      .lean<IUserDocument>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() })
      .select("+passwordHash +refreshTokens")
      .lean<IUserDocument>();
    return doc ? this.toDomain(doc) : null;
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const doc = await UserModel.create(data);
    const fresh = await UserModel.findById(doc._id)
      .select("+passwordHash +refreshTokens")
      .lean<IUserDocument>();
    return this.toDomain(fresh!);
  }

  async update(id: string, data: UpdateUserData): Promise<UserEntity | null> {
    const doc = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    )
      .select("+passwordHash +refreshTokens")
      .lean<IUserDocument>();
    return doc ? this.toDomain(doc) : null;
  }

  async addRefreshToken(userId: string, tokenHash: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $push: { refreshTokens: tokenHash },
    });
  }

  async removeRefreshToken(userId: string, tokenHash: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: tokenHash },
    });
  }

  async hasRefreshToken(userId: string, tokenHash: string): Promise<boolean> {
    const doc = await UserModel.findOne({
      _id: userId,
      refreshTokens: tokenHash,
    });
    return !!doc;
  }

  async clearAllRefreshTokens(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }
}
