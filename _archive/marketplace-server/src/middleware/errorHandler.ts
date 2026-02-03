import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/index.js';

export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined;

  // If it's our custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    stack = err.stack;
  }

  // Log error
  console.error(`[ERROR] ${statusCode} - ${message}`);
  if (stack) {
    console.error(stack);
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(stack && { stack }),
    },
  });
};
