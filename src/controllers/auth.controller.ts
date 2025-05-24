import { AuthService } from '@services';
import { SignInBody, SignUpBody } from '@types';
import { Request, Response } from 'express';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;

    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  async signIn(req: Request<object, object, SignInBody>, res: Response) {
    try {
      const { email, password } = req.body;

      const token = await this.authService.signIn(email, password);

      res.status(200).json(token);
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async signUp(req: Request<object, object, SignUpBody>, res: Response) {
    try {
      const { name, email, password } = req.body;

      const newUser = await this.authService.signUp(name, email, password);

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error signing up:', error);
      res.status(400).json({ message: 'Email already exists' });
    }
  }
}
