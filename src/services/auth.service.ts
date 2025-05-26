import jwt from 'jwt-simple';

import { UserRepository } from '@repositories';
import { isPasswordValid } from '@utils';
import { appConfig } from '@libs';
import { ERROR } from '@constants';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async signIn(email: string, password: string) {
    return this.userRepository.findByEmail(email).then((user) => {
      if (user && isPasswordValid(user.password, password)) {
        const payload = { id: user.id };

        return { token: jwt.encode(payload, appConfig.jwtSecret) };
      } else {
        throw new Error(ERROR.INVALID_CREDENTIALS);
      }
    });
  }

  async signUp(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = await this.userRepository.create({ name, email, password });
    return newUser;
  }
}
