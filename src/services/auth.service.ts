import { Request, Response } from 'express';
import jwt from 'jwt-simple';

import { appConfig } from '@libs';
import {
  AuthService,
  SignInBody,
  SignInService,
  SignUpBody,
  SignUpService,
  UserDependencies,
} from '@types';
import { isPasswordValid } from '@utils';

import { User } from '@models';

const signIn =
  ({ userRepository = User }: UserDependencies): SignInService =>
  async (req: Request<object, object, SignInBody>, res) => {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;

      userRepository
        .findOne({ where: { email } })
        .then((user) => {
          if (user && isPasswordValid(user.password, password)) {
            const payload = { id: user.id };
            res.json({
              token: jwt.encode(payload, appConfig.jwtSecret),
            });
          } else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
        })
        .catch(() => res.sendStatus(401));
    } else {
      res.sendStatus(401);
    }
  };

const signUp =
  ({ userRepository = User }: UserDependencies): SignUpService =>
  async (
    req: Request<object, object, SignUpBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        return;
      }

      const newUser = await userRepository.create({ name, email, password });

      res.status(201).json({ newUser, password });
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const service: AuthService = {
  signIn: signIn({}),
  signUp: signUp({}),
};

export default service;
