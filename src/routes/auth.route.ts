import express from 'express';

import { AuthController } from '@controllers';

export const authRouter = ({
  app,
  authController,
}: {
  app: express.Application;
  authController: AuthController;
}) =>
  app
    .post('/signup', authController.signUp)
    .post('/signin', authController.signIn);
