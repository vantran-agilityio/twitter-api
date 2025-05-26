import { UserService } from '@services';
import { UserRepository } from '@repositories';
import { User, UserModel } from '@models';
import { CreateUserBody, UpdateUserByIdBody, UserBody } from '@types';

// Mock the UserRepository
jest.mock('@repositories', () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMultiple: jest.fn(),
      deleteById: jest.fn(),
      deleteAll: jest.fn(),
    })),
  };
});

describe('UserService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let userService: UserService;
  let mockUser: UserModel;
  let mockUsers: UserModel[];

  beforeEach(() => {
    mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
    } as UserModel;

    mockUsers = [
      mockUser,
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashedpassword2',
      } as UserModel,
    ];

    userRepository = new UserRepository(User) as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById('999');

      expect(userRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.findById.mockRejectedValue(error);

      await expect(userService.getUserById('1')).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no users exist', async () => {
      userRepository.findAll.mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.findAll.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('Database error');
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const userData: CreateUserBody = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const newUser = {
        id: '3',
        ...userData,
      } as UserModel;

      userRepository.create.mockResolvedValue(newUser);

      const result = await userService.createUser(userData);

      expect(userRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(newUser);
    });

    it('should propagate errors from the repository', async () => {
      const userData: CreateUserBody = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const error = new Error('Database error');
      userRepository.create.mockRejectedValue(error);

      await expect(userService.createUser(userData)).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('updateUser', () => {
    it('should update and return the number of affected rows', async () => {
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      userRepository.update.mockResolvedValue([1]);

      const result = await userService.updateUser('1', userData);

      expect(userRepository.update).toHaveBeenCalledWith('1', userData);
      expect(result).toEqual([1]);
    });

    it('should return [0] when no user is updated', async () => {
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      userRepository.update.mockResolvedValue([0]);

      const result = await userService.updateUser('999', userData);

      expect(userRepository.update).toHaveBeenCalledWith('999', userData);
      expect(result).toEqual([0]);
    });

    it('should propagate errors from the repository', async () => {
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const error = new Error('Database error');
      userRepository.update.mockRejectedValue(error);

      await expect(userService.updateUser('1', userData)).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.update).toHaveBeenCalledWith('1', userData);
    });
  });

  describe('updateMultipleUsers', () => {
    it('should update multiple users and return the results', async () => {
      const usersData: UserBody[] = [
        { id: '1', name: 'Updated John', email: 'john.updated@example.com' },
        { id: '2', name: 'Updated Jane', email: 'jane.updated@example.com' },
      ];

      userRepository.updateMultiple.mockResolvedValue([[1], [1]]);

      const result = await userService.updateMultipleUsers(usersData);

      expect(userRepository.updateMultiple).toHaveBeenCalledWith(usersData);
      expect(result).toEqual([[1], [1]]);
    });

    it('should return empty results for empty input array', async () => {
      const usersData: UserBody[] = [];

      userRepository.updateMultiple.mockResolvedValue([]);

      const result = await userService.updateMultipleUsers(usersData);

      expect(userRepository.updateMultiple).toHaveBeenCalledWith(usersData);
      expect(result).toEqual([]);
    });

    it('should propagate errors from the repository', async () => {
      const usersData: UserBody[] = [
        { id: '1', name: 'Updated John', email: 'john.updated@example.com' },
      ];

      const error = new Error('Database error');
      userRepository.updateMultiple.mockRejectedValue(error);

      await expect(userService.updateMultipleUsers(usersData)).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.updateMultiple).toHaveBeenCalledWith(usersData);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user and return number of affected rows', async () => {
      userRepository.deleteById.mockResolvedValue(1);

      const result = await userService.deleteUserById('1');

      expect(userRepository.deleteById).toHaveBeenCalledWith('1');
      expect(result).toBe(1);
    });

    it('should return 0 when no user is deleted', async () => {
      userRepository.deleteById.mockResolvedValue(0);

      const result = await userService.deleteUserById('999');

      expect(userRepository.deleteById).toHaveBeenCalledWith('999');
      expect(result).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.deleteById.mockRejectedValue(error);

      await expect(userService.deleteUserById('1')).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.deleteById).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteAllUsers', () => {
    it('should delete all users and return number of affected rows', async () => {
      userRepository.deleteAll.mockResolvedValue(2);

      const result = await userService.deleteAllUsers();

      expect(userRepository.deleteAll).toHaveBeenCalled();
      expect(result).toBe(2);
    });

    it('should return 0 when no users are deleted', async () => {
      userRepository.deleteAll.mockResolvedValue(0);

      const result = await userService.deleteAllUsers();

      expect(userRepository.deleteAll).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      userRepository.deleteAll.mockRejectedValue(error);

      await expect(userService.deleteAllUsers()).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.deleteAll).toHaveBeenCalled();
    });
  });
});
