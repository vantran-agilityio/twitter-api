import { Request, Response } from 'express';

import { User } from '@models';
import { GeneralParamsType } from './param';

export type UserDependencies = {
  userRepository?: typeof User;
};

type UserBaseBody = {
  name: string;
  email: string;
};

type UpdateUserByIdBody = UserBaseBody;
type UpdateMultipleUsersBody = { users: (UserBaseBody & { id: string })[] };

type CreateUserBody = UserBaseBody & {
  password: string;
};

// Fetch Users
export type FetchUsersService = (req: Request, res: Response) => Promise<void>;
export type FetchUserByIdService = (
  req: Request<GeneralParamsType>,
  res: Response,
) => Promise<void>;

// Create User
export type CreateUserService = (
  req: Request<object, object, CreateUserBody>,
  res: Response,
) => Promise<void>;

// Update User
export type UpdateMultipleUsersService = (
  req: Request<object, object, UpdateMultipleUsersBody>,
  res: Response,
) => Promise<void>;
export type UpdateUserByIdService = (
  req: Request<GeneralParamsType, object, UpdateUserByIdBody>,
  res: Response,
) => Promise<void>;

// Delete User
export type DeleteUserByIdService = (
  req: Request<GeneralParamsType>,
  res: Response,
) => Promise<void>;

export type UserService = {
  fetchUsers: FetchUsersService;
  fetchUserById: FetchUserByIdService;
  createUser: CreateUserService;
  updateUserById: UpdateUserByIdService;
  updateMultipleUsers: UpdateMultipleUsersService;
  deleteUserById: DeleteUserByIdService;
};
