import { Request, Response } from 'express';

import { User } from '@models';
import {
  CreateUserService,
  FetchUsersService,
  UserDependencies,
  UserService,
} from '@types';

const fetchUsers =
  ({ userRepository = User }: UserDependencies): FetchUsersService =>
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await userRepository.findAll();

      if (!users.length) {
        res.status(404).json({ message: 'No users found' });
      }

      res.status(200).json(users);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createUser =
  ({ userRepository = User }: UserDependencies): CreateUserService =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }

      const newUser = await userRepository.create({ name, email, password });

      res.status(201).json(newUser);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const service: UserService = {
  fetchUsers: fetchUsers({}),
  createUser: createUser({}),
};

export default service;
