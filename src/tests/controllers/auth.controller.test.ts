import { Request, Response } from 'express';
import { AuthController } from '@controllers';
import { AuthService } from '@services';
import { SignInBody, SignUpBody } from '@types';
import { User, UserModel } from '@models';
import { UserRepository } from '@repositories';
import { ERROR } from '@constants';

jest.mock('@services', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      signIn: jest.fn(),
      signUp: jest.fn(),
    })),
  };
});

describe('AuthController', () => {
  let userRepository: UserRepository;
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error to prevent output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    userRepository = new UserRepository(User);
    authService = new AuthService(userRepository) as jest.Mocked<AuthService>;
    authController = new AuthController(authService);

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('signIn', () => {
    it('should sign in user and return token with status 200', async () => {
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = { token: 'jwt-token-123' };
      authService.signIn.mockResolvedValue(mockToken);

      await authController.signIn(
        req as Request<object, object, SignInBody>,
        res as Response,
      );

      expect(authService.signIn).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockToken);
    });

    it('should return 401 when credentials are invalid', async () => {
      req.body = {
        email: 'wrong@example.com',
        password: 'wrong-password',
      };

      authService.signIn.mockRejectedValue(
        new Error(ERROR.INVALID_CREDENTIALS),
      );

      await authController.signIn(
        req as Request<object, object, SignInBody>,
        res as Response,
      );

      expect(authService.signIn).toHaveBeenCalledWith(
        'wrong@example.com',
        'wrong-password',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing in:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: ERROR.INVALID_CREDENTIALS,
      });
    });
  });

  describe('signUp', () => {
    it('should sign up user and return new user with status 201', async () => {
      req.body = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'new-id',
        name: 'Test User',
        email: 'newuser@example.com',
      } as UserModel;

      authService.signUp.mockResolvedValue(mockUser);

      await authController.signUp(
        req as Request<object, object, SignUpBody>,
        res as Response,
      );

      expect(authService.signUp).toHaveBeenCalledWith(
        'Test User',
        'newuser@example.com',
        'password123',
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 when email already exists', async () => {
      req.body = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password123',
      };

      authService.signUp.mockRejectedValue(new Error('Email already exists'));

      await authController.signUp(
        req as Request<object, object, SignUpBody>,
        res as Response,
      );

      expect(authService.signUp).toHaveBeenCalledWith(
        'Existing User',
        'existing@example.com',
        'password123',
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error signing up:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });
  });
});
