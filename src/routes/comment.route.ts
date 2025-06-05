import express from 'express';

import { authenticate } from 'auth';
import { CommentController } from '@controllers';

export const commentRouter = ({
  app,
  commentController,
}: {
  app: express.Application;
  commentController: CommentController;
}) => {
  app
    .route('/posts/:id/comments')
    .all(authenticate())
    .get(commentController.fetchComments)
    .post(commentController.createComment)
    .delete(commentController.deleteAllComments);

  app
    .route('/posts/:postId/comment/:commentId')
    .all(authenticate())
    .get(commentController.fetchCommentById)
    .delete(commentController.deleteCommentById);
};
