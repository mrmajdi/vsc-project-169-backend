// @vsc repo:vsc-project-169-backend file:src/routes/posts.ts task:b13-src-routes-posts-ts module:backend session:169
import { Router } from 'express';
import postController from '../controllers/postController';
import validationMiddleware from '../middleware/validationMiddleware';
import authMiddleware from '../middleware/authMiddleware';
import { z } from 'zod';

const router = Router();

const createPostSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  content: z.string().min(1, 'محتوا الزامی است'),
  published: z.boolean().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است').optional(),
  content: z.string().min(1, 'محتوا الزامی است').optional(),
  published: z.boolean().optional(),
});

router.get('/', postController.getAll);
router.post(
  '/',
  authMiddleware,
  validationMiddleware(createPostSchema),
  postController.create
);
router.get('/:id', postController.getOne);
router.put(
  '/:id',
  authMiddleware,
  validationMiddleware(updatePostSchema),
  postController.update
);
router.delete('/:id', authMiddleware, postController.delete);

export default router;
