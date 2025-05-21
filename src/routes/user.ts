import express from 'express';

import { UserService } from '@types';

export const userRouter = ({
  app,
  userService,
}: {
  app: express.Application;
  userService: UserService;
}) =>
  app.route('/user').get(userService.fetchUsers).post(userService.createUser);
