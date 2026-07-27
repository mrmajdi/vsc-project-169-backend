// @vsc repo:vsc-project-169-backend file:src/routes/comments.ts task:b13-src-routes-comments-ts module:backend session:169
import { Router } from 'express';
import { z } from 'zod';
import commentController from '../controllers/commentController';
import validationMiddleware from '../middleware/validationMiddleware';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

const commentCreateSchema = z.object({
  content: z.string().min(1, 'نظر نمی‌تواند خالی باشد')
});

router.post(
  '/',
  authMiddleware,
  validationMiddleware(commentCreateSchema),
  commentController.create
);

router.get('/:postId', commentController.getByPost);

export default router;
