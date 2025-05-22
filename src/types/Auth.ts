import { Request, Response } from 'express';

export type SignUpService = (req: Request, res: Response) => Promise<void>;
export type SignInService = (req: Request, res: Response) => Promise<void>;

export type AuthService = {
  signUp: SignUpService;
  signIn: SignInService;
};

export type SignInBody = {
  email: string;
  password: string;
};

export type SignUpBody = {
  name: string;
  email: string;
  password: string;
};
