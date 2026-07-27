// @vsc repo:vsc-project-169-backend file:src/routes/auth.ts task:b13-src-routes-auth-ts module:backend session:169
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validationMiddleware } from '../middleware/validationMiddleware';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', validationMiddleware(registerSchema), register);
router.post('/login', validationMiddleware(loginSchema), login);

export default router;
