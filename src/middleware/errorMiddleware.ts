// @vsc repo:vsc-project-169-backend file:src/middleware/errorMiddleware.ts task:b16-src-middleware-errormiddleware-ts module:backend session:169
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // Log error with timestamp, method, URL, and stack
  const timestamp = new Date().toISOString();
  console.error(
    `[${timestamp}] ${req.method} ${req.originalUrl || req.url} - Error:`,
    err
  );

  // Determine status code
  const statusCode =
    typeof err.status === 'number' && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  // Build response body
  const responseBody: { success: false; error: string; stack?: string } = {
    success: false,
    error: err.message || 'Internal Server Error',
  };

  // Include stack trace in non-production environments
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    responseBody.stack = err.stack;
  }

  // Send JSON response
  res.status(statusCode).json(responseBody);
};

export default errorMiddleware;
