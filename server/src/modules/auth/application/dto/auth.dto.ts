export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
  workspaceId?: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface LogoutDTO {
  userId: string;
  refreshToken: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}
export interface AuthResultDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    workspaceId: string | null;
    avatarUrl: string | null;
  };
}

export interface RefreshResultDTO {
  accessToken: string;
  refreshToken: string;
}
