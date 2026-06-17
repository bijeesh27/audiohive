import {AppError} from './AppError.js'
export type Result<T, E extends Error = AppError> =
  | { success: true;  value: T }
  | { success: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { success: true, value };
}

export function fail<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}