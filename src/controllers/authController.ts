// @vsc repo:vsc-project-169-backend file:src/controllers/authController.ts task:b14-src-controllers-authcontroller-ts module:backend session:169
import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';

/**
 * Register a new user.
 * @param req - Express request object containing validated email, password and optional name.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in an existing user.
 * @param req - Express request object containing email and password.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accessToken, user } = await authService.login(
      req.body.email,
      req.body.password
    );

    // Set httpOnly cookie with JWT
    const isSecure = process.env.NODE_ENV === 'production';
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * Log out the current user by clearing the token cookie.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function for error handling.
 */
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'خروج انجام شد' });
  } catch (error) {
    next(error);
  }
};
