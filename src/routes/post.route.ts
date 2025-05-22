import express from 'express';

import { PostService } from '@types';
import { authenticate } from 'auth';

export const postRouter = ({
  app,
  postService,
}: {
  app: express.Application;
  postService: PostService;
}) => {
  app
    .route('/posts')
    .all(authenticate())
    .get(postService.fetchPosts)
    .delete(postService.deleteAllPosts);

  app
    .route('/posts/:id')
    .all(authenticate())
    .get(postService.fetchPostById)
    .put(postService.updatePostById);

  app.route('/users/:id/post').all(authenticate()).post(postService.createPost);

  app
    .route('/users/:userId/post/:postId')
    .all(authenticate())
    .delete(postService.deletePostById);
};
