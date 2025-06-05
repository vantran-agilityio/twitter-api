import express from 'express';

import { authenticate } from 'auth';
import { UserController } from '@controllers';

export const userRouter = ({
  app,
  userController,
}: {
  app: express.Application;
  userController: UserController;
}) => {
  app
    .route('/users')
    .all(authenticate())
    .get(userController.fetchUsers)
    .post(userController.createUser)
    .put(userController.updateMultipleUsers)
    .delete(userController.deleteAllUsers);

  app
    .route('/users/:id')
    .all(authenticate())
    .get(userController.fetchUserById)
    .put(userController.updateUserById)
    .delete(userController.deleteUserById);
};
