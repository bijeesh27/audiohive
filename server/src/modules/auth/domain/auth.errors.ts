// src/modules/auth/domain/auth.errors.ts
import { AppError } from '../../../common/AppError.js';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid email or password', 401);
  }
}

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('An account with this email already exists', 409);
  }
}

export class AccountSuspendedError extends AppError {
  constructor() {
    super('Your account has been suspended. Contact your workspace admin.', 403);
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super('Invalid or expired token. Please log in again.', 401);
  }
}

export class PasswordResetTokenExpiredError extends AppError {
  constructor() {
    super('Password reset link has expired. Please request a new one.', 400);
  }
}

export class UserNotFoundError extends AppError {
  constructor() {
    super('User not found', 404);
  }
}