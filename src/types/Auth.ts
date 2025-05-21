import { Request, Response } from 'express';

export type SignUpService = (req: Request, res: Response) => Promise<void>;
export type SignInService = (req: Request, res: Response) => Promise<void>;

export type AuthService = {
  signUp: SignUpService;
  signIn: SignInService;
};
