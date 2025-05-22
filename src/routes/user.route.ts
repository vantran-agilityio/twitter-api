import express from 'express';

import { UserService } from '@types';
import { authenticate } from 'auth';

export const userRouter = ({
  app,
  userService,
}: {
  app: express.Application;
  userService: UserService;
}) => {
  app
    .route('/users')
    .all(authenticate())
    .get(userService.fetchUsers)
    .post(userService.createUser)
    .put(userService.updateMultipleUsers)
    .delete(userService.deleteAllUsers);

  app
    .route('/users/:id')
    .all(authenticate())
    .get(userService.fetchUserById)
    .put(userService.updateUserById)
    .delete(userService.deleteUserById);
};
