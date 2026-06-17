
export const USER_ROLES = {
  SUPER_ADMIN: "superadmin",
  WORKSPACE_ADMIN: "workspaceadmin",
  MODERATOR: "moderator",
  MEMBER: "member",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
} as const;

export const WORKSPACE_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  PENDING: "pending",
  ONBOARDING: "onboarding",
} as const;

export const WORKSPACE_REQUEST_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const ROOM_TYPES = {
  TEAM: "team",
  PROJECT: "project",
  MEETING: "meeting",
  PRIVATE: "private",
} as const;

export const MEETING_STATUS = {
  SCHEDULED: "scheduled",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const NOTIFICATION_TYPES = {
  MEETING_REMINDER: "meeting_reminder",
  DIRECT_MESSAGE: "direct_message",
  ANNOUNCEMENT: "announcement",
  MENTION: "mention",
  ROOM_ACTIVITY: "room_activity",
  WHITEBOARD: "whiteboard",
  SYSTEM: "system",
} as const;

export const REPORT_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  REJECTED: "rejected",
} as const;

export const PLAN_NAMES = {
  FREE: "free",
  STARTER: "starter",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
} as const;

export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
} as const;

export const REDIS_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_PRESENCE: (userId: string) => `presence:${userId}`,
  WORKSPACE_USERS: (wsId: string) => `workspace:${wsId}:online`,
  RATE_LIMIT: (ip: string) => `ratelimit:${ip}`,
  PASSWORD_RESET: (token: string) => `pwreset:${token}`,
  EMAIL_VERIFY: (token: string) => `emailverify:${token}`,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
