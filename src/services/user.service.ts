import { UserRepository } from '@repositories';
import { CreateUserBody, UpdateUserByIdBody, UserBody } from '@types';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  getAllUsers() {
    return this.userRepository.findAll();
  }

  createUser(userData: CreateUserBody) {
    return this.userRepository.create(userData);
  }

  updateUser(id: string, userData: UpdateUserByIdBody) {
    return this.userRepository.update(id, userData);
  }

  updateMultipleUsers(body: UserBody[]) {
    return this.userRepository.updateMultiple(body);
  }

  deleteUserById(id: string) {
    return this.userRepository.deleteById(id);
  }

  deleteAllUsers() {
    return this.userRepository.deleteAll();
  }
}
