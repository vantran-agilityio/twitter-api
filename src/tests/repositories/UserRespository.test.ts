import { User, UserModel } from '@models';
import { UserRepository } from '@repositories';
import { CreateUserBody, UpdateUserByIdBody, UserBody } from '@types';

jest.mock('@models', () => {
  return {
    User: {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockUser: UserModel;
  let mockUsers: UserModel[];

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
    } as UserModel;

    mockUsers = [
      mockUser,
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashed-password-2',
      } as UserModel,
    ];

    userRepository = new UserRepository(User);
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById('1');

      expect(User.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await userRepository.findById('999');

      // Assert
      expect(User.findByPk).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (User.findByPk as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.findById('1')).rejects.toThrow(
        'Database error',
      );
      expect(User.findByPk).toHaveBeenCalledWith('1');
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.findByEmail('john@example.com');

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      (User.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await userRepository.findByEmail(
        'nonexistent@example.com',
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (User.findOne as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        userRepository.findByEmail('john@example.com'),
      ).rejects.toThrow('Database error');
      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      // Arrange
      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      // Act
      const result = await userRepository.findAll();

      // Assert
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      (User.findAll as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await userRepository.findAll();

      // Assert
      expect(User.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (User.findAll as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.findAll()).rejects.toThrow('Database error');
      expect(User.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      // Arrange
      const userData: CreateUserBody = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const newUser = {
        id: '3',
        ...userData,
      } as UserModel;

      (User.create as jest.Mock).mockResolvedValue(newUser);

      // Act
      const result = await userRepository.create(userData);

      // Assert
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(newUser);
    });

    it('should propagate errors', async () => {
      // Arrange
      const userData: CreateUserBody = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const error = new Error('Database error');
      (User.create as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.create(userData)).rejects.toThrow(
        'Database error',
      );
      expect(User.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('update', () => {
    it('should update and return the number of affected rows', async () => {
      // Arrange
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      (User.update as jest.Mock).mockResolvedValue([1]);

      // Act
      const result = await userRepository.update('1', userData);

      // Assert
      expect(User.update).toHaveBeenCalledWith(userData, {
        where: { id: '1' },
      });
      expect(result).toEqual([1]);
    });

    it('should return [0] when no user is updated', async () => {
      // Arrange
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      (User.update as jest.Mock).mockResolvedValue([0]);

      // Act
      const result = await userRepository.update('999', userData);

      // Assert
      expect(User.update).toHaveBeenCalledWith(userData, {
        where: { id: '999' },
      });
      expect(result).toEqual([0]);
    });

    it('should propagate errors', async () => {
      // Arrange
      const userData: UpdateUserByIdBody = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const error = new Error('Database error');
      (User.update as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.update('1', userData)).rejects.toThrow(
        'Database error',
      );
      expect(User.update).toHaveBeenCalledWith(userData, {
        where: { id: '1' },
      });
    });
  });

  describe('updateMultiple', () => {
    it('should update multiple users and return the results', async () => {
      // Arrange
      const usersData: UserBody[] = [
        { id: '1', name: 'Updated John', email: 'john.updated@example.com' },
        { id: '2', name: 'Updated Jane', email: 'jane.updated@example.com' },
      ];

      (User.update as jest.Mock)
        .mockResolvedValueOnce([1])
        .mockResolvedValueOnce([1]);

      // Act
      const result = await userRepository.updateMultiple(usersData);

      // Assert
      expect(User.update).toHaveBeenCalledTimes(2);
      expect(User.update).toHaveBeenNthCalledWith(
        1,
        { name: 'Updated John', email: 'john.updated@example.com' },
        { where: { id: '1' } },
      );
      expect(User.update).toHaveBeenNthCalledWith(
        2,
        { name: 'Updated Jane', email: 'jane.updated@example.com' },
        { where: { id: '2' } },
      );
      expect(result).toEqual([[1], [1]]);
    });

    it('should handle partial failures in batch updates', async () => {
      // Arrange
      const usersData: UserBody[] = [
        { id: '1', name: 'Updated John', email: 'john.updated@example.com' },
        { id: '999', name: 'Nonexistent', email: 'none@example.com' },
      ];

      (User.update as jest.Mock)
        .mockResolvedValueOnce([1])
        .mockResolvedValueOnce([0]);

      // Act
      const result = await userRepository.updateMultiple(usersData);

      // Assert
      expect(User.update).toHaveBeenCalledTimes(2);
      expect(result).toEqual([[1], [0]]);
    });

    it('should propagate errors from any update operation', async () => {
      // Arrange
      const usersData: UserBody[] = [
        { id: '1', name: 'Updated John', email: 'john.updated@example.com' },
        { id: '2', name: 'Updated Jane', email: 'jane.updated@example.com' },
      ];

      const error = new Error('Database error');
      (User.update as jest.Mock)
        .mockResolvedValueOnce([1])
        .mockRejectedValueOnce(error);

      // Act & Assert
      await expect(userRepository.updateMultiple(usersData)).rejects.toThrow(
        'Database error',
      );
      expect(User.update).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteById', () => {
    it('should delete a user and return number of affected rows', async () => {
      // Arrange
      (User.destroy as jest.Mock).mockResolvedValue(1);

      // Act
      const result = await userRepository.deleteById('1');

      // Assert
      expect(User.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toBe(1);
    });

    it('should return 0 when no user is deleted', async () => {
      // Arrange
      (User.destroy as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await userRepository.deleteById('999');

      // Assert
      expect(User.destroy).toHaveBeenCalledWith({
        where: { id: '999' },
      });
      expect(result).toBe(0);
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (User.destroy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.deleteById('1')).rejects.toThrow(
        'Database error',
      );
      expect(User.destroy).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('deleteAll', () => {
    it('should delete all users and return number of affected rows', async () => {
      // Arrange
      (User.destroy as jest.Mock).mockResolvedValue(2);

      // Act
      const result = await userRepository.deleteAll();

      // Assert
      expect(User.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
      expect(result).toBe(2);
    });

    it('should return 0 when no users are deleted', async () => {
      // Arrange
      (User.destroy as jest.Mock).mockResolvedValue(0);

      // Act
      const result = await userRepository.deleteAll();

      // Assert
      expect(User.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
      expect(result).toBe(0);
    });

    it('should propagate errors', async () => {
      // Arrange
      const error = new Error('Database error');
      (User.destroy as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(userRepository.deleteAll()).rejects.toThrow(
        'Database error',
      );
      expect(User.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
    });
  });
});
