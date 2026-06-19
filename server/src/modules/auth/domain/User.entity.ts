export enum UserRole {
  SUPER_ADMIN = "superadmin",
  WORKSPACE_ADMIN = "workspaceadmin",
  MODERATOR = "moderator",
  MEMBER = "member",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  PENDING = "pending",
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: string,
    public readonly workspaceId: string | null,
    public readonly status: string,
    public readonly avatarUrl: string | null,
    public readonly isOnline: boolean,
    public readonly lastSeenAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isSuperAdmin(): boolean {
    return this.role === UserRole.SUPER_ADMIN;
  }

  isWorkspaceAdmin(): boolean {
    return this.role === UserRole.WORKSPACE_ADMIN;
  }
  belongsToWorkspace(workspaceId: string): boolean {
    return this.workspaceId === workspaceId;
  }
  toPublicProfile() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      workspaceId: this.workspaceId,
      status: this.status,
      avatatUrl: this.avatarUrl,
      isOnline: this.isOnline,
      lastSEEnAt: this.lastSeenAt,
      createdAt: this.createdAt,
    };
  }
}
