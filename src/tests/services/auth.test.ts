import jwt from 'jwt-simple';
import { AuthService } from '@services';
import { UserRepository } from '@repositories';
import { User, UserModel } from '@models';
import { isPasswordValid } from '@utils';
import { appConfig } from '@libs';
import { ERROR } from '@constants';

jest.mock('jwt-simple', () => ({
  encode: jest.fn(),
}));

jest.mock('@utils', () => ({
  isPasswordValid: jest.fn(),
}));

jest.mock('@repositories', () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => ({
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    })),
  };
});

describe('AuthService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let authService: AuthService;
  let mockUser: UserModel;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUser = {
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
    } as UserModel;

    userRepository = new UserRepository(User) as jest.Mocked<UserRepository>;
    authService = new AuthService(userRepository);
  });

  describe('signIn', () => {
    it('should return a token when credentials are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const mockToken = 'generated-jwt-token';

      userRepository.findByEmail.mockResolvedValue(mockUser);
      (isPasswordValid as jest.Mock).mockReturnValue(true);
      (jwt.encode as jest.Mock).mockReturnValue(mockToken);

      const result = await authService.signIn(email, password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(isPasswordValid).toHaveBeenCalledWith(mockUser.password, password);
      expect(jwt.encode).toHaveBeenCalledWith(
        { id: mockUser.id },
        appConfig.jwtSecret,
      );
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw an error when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        ERROR.INVALID_CREDENTIALS,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(isPasswordValid).not.toHaveBeenCalled();
      expect(jwt.encode).not.toHaveBeenCalled();
    });

    it('should throw an error when password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';

      userRepository.findByEmail.mockResolvedValue(mockUser);
      (isPasswordValid as jest.Mock).mockReturnValue(false);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        ERROR.INVALID_CREDENTIALS,
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(isPasswordValid).toHaveBeenCalledWith(mockUser.password, password);
      expect(jwt.encode).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const error = new Error('Database error');

      userRepository.findByEmail.mockRejectedValue(error);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        'Database error',
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(isPasswordValid).not.toHaveBeenCalled();
      expect(jwt.encode).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should create and return a new user when email is not taken', async () => {
      const name = 'New User';
      const email = 'new@example.com';
      const password = 'password123';

      const newUser = {
        id: '456',
        name,
        email,
        password: 'hashed-new-password',
      } as UserModel;

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(newUser);

      const result = await authService.signUp(name, email, password);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.create).toHaveBeenCalledWith({
        name,
        email,
        password,
      });
      expect(result).toEqual(newUser);
    });

    it('should throw an error when email already exists', async () => {
      const name = 'Duplicate User';
      const email = 'test@example.com';
      const password = 'password123';

      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(authService.signUp(name, email, password)).rejects.toThrow(
        'Email already exists',
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate create errors from the repository', async () => {
      const name = 'New User';
      const email = 'new@example.com';
      const password = 'password123';
      const error = new Error('Database error');

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockRejectedValue(error);

      await expect(authService.signUp(name, email, password)).rejects.toThrow(
        'Database error',
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.create).toHaveBeenCalledWith({
        name,
        email,
        password,
      });
    });

    it('should propagate findByEmail errors from the repository', async () => {
      const name = 'New User';
      const email = 'new@example.com';
      const password = 'password123';
      const error = new Error('Database error');

      userRepository.findByEmail.mockRejectedValue(error);

      await expect(authService.signUp(name, email, password)).rejects.toThrow(
        'Database error',
      );

      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });
});
