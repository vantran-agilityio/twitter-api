import { Request, Response } from 'express';

import { User } from '@models';

export type UserDependencies = {
  userRepository: typeof User;
};

export type FetchUsersService = (req: Request, res: Response) => Promise<void>;
// type FetchUserByIdService = (req: Request, res: Response) => Promise<void>;
export type CreateUserService = (req: Request, res: Response) => Promise<void>;
// type UpdateUserService = (req: Request, res: Response) => Promise<void>;
// type DeleteUserService = (req: Request, res: Response) => Promise<void>;

export type UserService = {
  fetchUsers: FetchUsersService;
  //   fetchUserById: FetchUserByIdService;
  createUser: CreateUserService;
  //   updateUser: UpdateUserService;
  //   deleteUser: DeleteUserService;
};
