import { Request, Response } from 'express';
import { UserController } from '@controllers';
import { UserService } from '@services';
import { User, UserModel } from '@models';
import { UserRepository } from '@repositories';
import {
  GeneralParamsType,
  UpdateMultipleUsersBody,
  UpdateUserByIdBody,
} from '@types';
import { ERROR, SUCCESS } from '@constants';

jest.mock('@services', () => {
  return {
    UserService: jest.fn().mockImplementation(() => ({
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      updateMultipleUsers: jest.fn(),
      deleteUserById: jest.fn(),
      deleteAllUsers: jest.fn(),
    })),
  };
});

describe('UserController', () => {
  let userRepository: UserRepository;
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockUserData: UserModel[];
  let mockSingleUser: UserModel;

  beforeEach(() => {
    mockUserData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ] as UserModel[];

    mockSingleUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    } as UserModel;

    userRepository = new UserRepository(User);
    userService = new UserService(userRepository) as jest.Mocked<UserService>;
    userController = new UserController(userService);

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('fetchUsers', () => {
    it('should return all users with status 200', async () => {
      userService.getAllUsers.mockResolvedValue(mockUserData);

      await userController.fetchUsers(req as Request, res as Response);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserData);
    });

    it('should return 404 when no users are found', async () => {
      userService.getAllUsers.mockResolvedValue([]);

      await userController.fetchUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.USER_NOT_FOUND });
    });

    it('should handle errors and return 500 status', async () => {
      userService.getAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.fetchUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });

  describe('fetchUserById', () => {
    it('should return a single user with status 200', async () => {
      req.params = { id: '1' };
      userService.getUserById.mockResolvedValue(mockSingleUser);

      await userController.fetchUserById(req as Request, res as Response);

      expect(userService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSingleUser);
    });

    it('should return 404 when user is not found', async () => {
      req.params = { id: '999' };
      userService.getUserById.mockResolvedValue(null);

      await userController.fetchUserById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.USER_NOT_FOUND });
    });
  });

  describe('createUser', () => {
    it('should create a user and return 201 status', async () => {
      req.body = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };
      userService.createUser.mockResolvedValue({
        id: '3',
        name: 'New User',
        email: 'new@example.com',
      } as UserModel);

      await userController.createUser(req as Request, res as Response);

      expect(userService.createUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: '3',
        name: 'New User',
        email: 'new@example.com',
      });
    });

    it('should return 400 when required fields are missing', async () => {
      req.body = { name: 'New User' };

      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: ERROR.NAME_EMAIL_PASSWORD_REQUIRED,
      });
      expect(userService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('updateUserById', () => {
    it('should update a user and return 200 status', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated Name', email: 'updated@example.com' };

      userService.getUserById.mockResolvedValue(mockSingleUser);
      userService.updateUser.mockResolvedValue([1]);

      await userController.updateUserById(
        req as Request<GeneralParamsType, object, UpdateUserByIdBody>,
        res as Response,
      );

      expect(userService.updateUser).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: SUCCESS.USER_UPDATE_SUCCESS,
      });
    });

    it('should return 400 when name and email are both missing', async () => {
      req.params = { id: '1' };
      req.body = {};

      userService.getUserById.mockResolvedValue(mockSingleUser);

      await userController.updateUserById(
        req as Request<GeneralParamsType, object, UpdateUserByIdBody>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name or email is required',
      });
      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should return 404 when user to update is not found', async () => {
      req.params = { id: '999' };
      req.body = { name: 'Updated Name', email: 'updated@example.com' };
      userService.updateUser.mockResolvedValue([0]);

      await userController.updateUserById(
        req as Request<GeneralParamsType, object, UpdateUserByIdBody>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.USER_NOT_FOUND });
    });
  });

  describe('updateMultipleUsers', () => {
    it('should update multiple users and return 200 status', async () => {
      req.body = {
        users: [
          { id: '1', name: 'Updated John', email: 'john@example.com' },
          { id: '2', name: 'Updated Jane', email: 'jane@example.com' },
        ],
      };
      userService.updateMultipleUsers.mockResolvedValue([]);

      await userController.updateMultipleUsers(
        req as Request<object, object, UpdateMultipleUsersBody>,
        res as Response,
      );

      expect(userService.updateMultipleUsers).toHaveBeenCalledWith(
        req.body.users,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: SUCCESS.USERS_UPDATE_SUCCESS,
      });
    });

    it('should return 400 when users array is invalid', async () => {
      req.body = {};

      await userController.updateMultipleUsers(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
      expect(userService.updateMultipleUsers).not.toHaveBeenCalled();
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user and return 200 status', async () => {
      req.params = { id: '1' };
      userService.deleteUserById.mockResolvedValue(1);

      await userController.deleteUserById(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(userService.deleteUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: SUCCESS.USER_DELETE_SUCCESS,
      });
    });

    it('should return 404 when user to delete is not found', async () => {
      req.params = { id: '999' };
      userService.deleteUserById.mockResolvedValue(0);

      await userController.deleteUserById(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.USER_NOT_FOUND });
    });
  });

  describe('deleteAllUsers', () => {
    it('should delete all users and return 200 status', async () => {
      userService.deleteAllUsers.mockResolvedValue(1);

      await userController.deleteAllUsers(req as Request, res as Response);

      expect(userService.deleteAllUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All users deleted successfully',
      });
    });

    it('should handle errors when deleting all users', async () => {
      userService.deleteAllUsers.mockRejectedValue(new Error('Database error'));

      await userController.deleteAllUsers(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });
});
