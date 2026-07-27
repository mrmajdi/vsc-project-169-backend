// @vsc repo:vsc-project-169-backend file:src/services/authService.ts task:b15-src-services-authservice-ts module:backend session:169
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-for-testing-only';
const SALT_ROUNDS = 10;

export async function hashPassword(plainPassword: string): Promise<string> {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export async function verifyAccessToken(token: string): Promise<object> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          reject(new TokenExpiredError('توکن منقضی شده است'));
        } else {
          reject(new InvalidTokenError('توکن نامعتبر است'));
        }
      } else {
        resolve(decoded as object);
      }
    });
  });
}
