import express from 'express';

import { CommentService } from '@types';
import { authenticate } from 'auth';

export const commentRouter = ({
  app,
  commentService,
}: {
  app: express.Application;
  commentService: CommentService;
}) => {
  app
    .route('/posts/:id/comments')
    .all(authenticate())
    .get(commentService.fetchComments)
    .post(commentService.createComment)
    .delete(commentService.deleteAllComments);

  app
    .route('/posts/:postId/comment/:commentId')
    .all(authenticate())
    .get(commentService.fetchCommentById)
    .delete(commentService.deleteCommentById);
};
