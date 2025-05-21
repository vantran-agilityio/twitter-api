import express from 'express';

import { UserService } from '@types';
import { authenticate } from 'auth';

export const userRouter = ({
  app,
  userService,
}: {
  app: express.Application;
  userService: UserService;
}) =>
  app
    .route('/user')
    .all(authenticate())
    .get(userService.fetchUsers)
    .post(userService.createUser);
