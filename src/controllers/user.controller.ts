import { Request, Response } from 'express';

import { UserService } from '@services';
import {
  GeneralParamsType,
  UpdateMultipleUsersBody,
  UpdateUserByIdBody,
} from '@types';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;

    this.fetchUsers = this.fetchUsers.bind(this);
    this.fetchUserById = this.fetchUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUserById = this.updateUserById.bind(this);
    this.updateMultipleUsers = this.updateMultipleUsers.bind(this);
    this.deleteUserById = this.deleteUserById.bind(this);
    this.deleteAllUsers = this.deleteAllUsers.bind(this);
  }

  async fetchUsers(_: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      if (!users || !users.length) {
        res.status(404).json({ error: 'No users found' });
        return;
      }

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async fetchUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateUserById(
    req: Request<GeneralParamsType, object, UpdateUserByIdBody>,
    res: Response,
  ) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      if (!name && !email) {
        res.status(400).json({ error: 'Name or email is required' });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, {
        name,
        email,
      });

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res
          .status(400)
          .json({ error: 'Name, email, and password are required' });
        return;
      }

      const newUser = await this.userService.createUser({
        name,
        email,
        password,
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updateMultipleUsers(
    req: Request<object, object, UpdateMultipleUsersBody>,
    res: Response,
  ) {
    try {
      const { users } = req.body;

      if (!Array.isArray(users) || users.length === 0) {
        res.status(400).json({ error: 'Invalid input' });
        return;
      }

      await this.userService.updateMultipleUsers(users);
      res.status(200).json({ message: 'Users updated successfully' });
    } catch (error) {
      console.error('Error updating multiple users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteUserById(req: Request<GeneralParamsType>, res: Response) {
    try {
      const { id } = req.params;

      const deletedUser = await this.userService.deleteUserById(id);
      if (!deletedUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  async deleteAllUsers(_: Request, res: Response) {
    try {
      await this.userService.deleteAllUsers();
      res.status(200).json({ message: 'All users deleted successfully' });
    } catch (error) {
      console.error('Error deleting all users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
