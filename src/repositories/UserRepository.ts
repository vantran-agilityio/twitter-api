import { User } from '@models';
import { CreateUserBody, UpdateUserByIdBody, UserBody } from '@types';

export class UserRepository {
  private user: typeof User;

  constructor(user: typeof User) {
    this.user = user;
  }

  async findById(id: string) {
    return this.user.findByPk(id);
  }

  async findByEmail(email: string) {
    return this.user.findOne({
      where: { email },
    });
  }

  async findAll() {
    return this.user.findAll();
  }

  async create(userData: CreateUserBody) {
    return this.user.create(userData);
  }

  async update(id: string, userData: UpdateUserByIdBody) {
    return this.user.update(userData, {
      where: { id },
    });
  }

  async updateMultiple(users: UserBody[]) {
    return Promise.all(
      users.map(async ({ id, name, email }) =>
        this.user.update({ name, email }, { where: { id } }),
      ),
    );
  }

  async deleteById(id: string) {
    return this.user.destroy({
      where: { id },
    });
  }

  async deleteAll() {
    return this.user.destroy({
      where: {},
      truncate: true,
    });
  }
}
