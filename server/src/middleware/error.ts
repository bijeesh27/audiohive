import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../common/AppError.js";
import { env } from "node:process";

interface ErrorResponse {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  stack?: string;
}

function handleMongooseDuplicateKey(err: any): AppError {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(`${field} '${value}' is already in use`, 409);
}

function handleMongooseValidation(
  err: mongoose.Error.ValidationError,
): AppError {
  const messages = Object.values(err.errors)
    .map((e) => e.message)
    .join(". ");
  return new AppError(`Validation failed: ${messages}`, 422);
}

function handleMongooseCastError(err: mongoose.Error.CastError): AppError {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

function handleJwtError(): AppError {
  return new AppError("Invalid token. Please log in again", 401);
}

function handleJwtExpiredError(): AppError {
  return new AppError("Token expired. Please log in again", 401);
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  let error = err;

  if ((err as any).code === 11000) error = handleMongooseDuplicateKey(err);
  else if (err instanceof mongoose.Error.ValidationError)
    error = handleMongooseValidation(err);
  else if (err instanceof mongoose.Error.CastError)
    error = handleMongooseCastError(err);
  else if (err.name === "JsonWebTokenError") error = handleJwtError();
  else if (err.name === "TokenExpiredError") error = handleJwtExpiredError();

  const appError =
    error instanceof AppError
      ? error
      : new AppError("Something went wrong", 500, false);
  if (!appError.isOperational) {
    console.error("[UNEXPECTED ERROR]", {
      message: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      userId: (req as any).user?.id,
    });
  }

  const response: ErrorResponse = {
    success: false,
    message: appError.message,
    statusCode: appError.statusCode,
  };

  if (env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(appError.statusCode).json(response);
}

export function setupProcessErrorHandlers(): void {
  process.on("unhandledRejection", (reason: Error) => {
    console.error("[Unhandled Rejection]", reason.message);
    process.exit(1);
  });

  process.on("uncaughtException", (error: Error) => {
    console.error("[Uncaught Exception]", error.message);
    process.exit(1);
  });
}
