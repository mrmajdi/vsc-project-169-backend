// @vsc repo:vsc-project-169-backend file:src/controllers/commentController.ts task:b14-src-controllers-commentcontroller-ts module:backend session:169
import { Request, Response, NextFunction } from 'express';
import commentService from '../services/commentService';
import { Comment } from '../types';

/**
 * Create a new comment.
 * @param req - Express request with validated body containing content and postId,
 *              and req.user set by auth middleware.
 * @param res - Express response.
 * @param next - Express next function for error handling.
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { content, postId } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      const error = new Error('Unauthorized');
      return next(error);
    }

    const comment = await commentService.create({
      content,
      postId,
      authorId,
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

/**
 * Get comments for a specific post.
 * @param req - Express request with postId in params.
 * @param res - Express response.
 * @param next - Express next function for error handling.
 */
export const getByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;
    const numericPostId = Number(postId);

    if (isNaN(numericPostId)) {
      const error = new Error('Invalid post ID');
      return next(error);
    }

    const comments = await commentService.getByPost(numericPostId);

    res.status(200).json({ comments });
  } catch (err) {
    next(err);
  }
};
