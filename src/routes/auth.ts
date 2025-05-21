import express from 'express';

import { AuthService } from '@types';

const route = express.Router();

const auth = (authService: AuthService) =>
  route.post('/signup', authService.signUp).post('/signin', authService.signIn);

export const authRouter = ({
  app,
  authService,
}: {
  app: express.Application;
  authService: AuthService;
}) => app.use('/auth', auth(authService));
