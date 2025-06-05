import express from 'express';

import { authenticate } from 'auth';
import { PostController } from '@controllers';

export const postRouter = ({
  app,
  postController,
}: {
  app: express.Application;
  postController: PostController;
}) => {
  app
    .route('/posts')
    .all(authenticate())
    .get(postController.getPosts)
    .delete(postController.deleteAllPosts);

  app
    .route('/posts/:id')
    .all(authenticate())
    .get(postController.getPostById)
    .put(postController.updatePostById);

  app
    .route('/users/:id/post')
    .all(authenticate())
    .post(postController.createPost);

  app
    .route('/users/:userId/post/:postId')
    .all(authenticate())
    .delete(postController.deletePostById);
};
