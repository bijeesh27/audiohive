
import rateLimit from 'express-rate-limit';
import { AppError } from '../common/AppError.js';

//all API routes
export const globalRateLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutes
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (_req, _res, next) => {
    next(new AppError('Too many requests. Please slow down.', 429));
  },
});

//login and register
export const authRateLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10, // 10 attempts per 15 min
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (_req, _res, next) => {
    next(new AppError('Too many login attempts. Please try again in 15 minutes.', 429));
  },
});

//password reset
export const passwordResetLimiter = rateLimit({
  windowMs:         60 * 60 * 1000, // 1 hour
  max:              3,
  handler: (_req, _res, next) => {
    next(new AppError('Too many password reset requests. Please try again in 1 hour.', 429));
  },
});