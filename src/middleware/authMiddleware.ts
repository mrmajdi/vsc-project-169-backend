// @vsc repo:vsc-project-169-backend file:src/middleware/authMiddleware.ts task:b16-src-middleware-authmiddleware-ts module:backend session:169
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach decoded payload to request object
    (req as any).user = decoded;
    return next();
  } catch (err) {
    const error = new Error('Invalid or expired token');
    // @ts-ignore
    error.status = 401;
    return next(error);
  }
}
