import { User } from '@models';
import {
  CreateUserService,
  DeleteAllUsersService,
  FetchUsersService,
  UpdateMultipleUsersService,
  UpdateUserByIdService,
  UserDependencies,
  UserService,
} from '@types';
import { isEmailValid } from '@utils';

const fetchUsers =
  ({ userRepository = User }: UserDependencies): FetchUsersService =>
  async (_req, res) => {
    try {
      const users = await userRepository.findAll();

      if (!users.length) {
        res.status(404).json({ message: 'No users found' });
      }

      res.status(200).json(users);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createUser =
  ({ userRepository = User }: UserDependencies): CreateUserService =>
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }
      if (!isEmailValid(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }

      const newUser = await userRepository.create({
        name,
        email,
        password,
      });

      res.status(201).json(newUser);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const fetchUserById =
  ({ userRepository = User }: UserDependencies): FetchUsersService =>
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userRepository.findByPk(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(user);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const putMultipleUsers =
  ({ userRepository = User }: UserDependencies): UpdateMultipleUsersService =>
  async (req, res) => {
    try {
      const { users } = req.body;
      if (!Array.isArray(users) || users.length === 0) {
        res.status(400).json({ message: 'Users data is required' });
        return;
      }

      const updatedUsers = await Promise.all(
        users.map(async (user) => {
          const { id, name, email } = user;

          if (!name || !email) {
            res.status(400).json({ message: 'Name and email are required' });
            return null;
          }

          if (!isEmailValid(email)) {
            res.status(400).json({ message: 'Invalid email format' });
            return null;
          }

          const existingUser = await userRepository.findByPk(id);
          if (!existingUser) {
            res.status(404).json({ message: `${name} not found` });
            return null;
          }
          await existingUser.update({ name, email }, { where: { id } });
          return existingUser;
        }),
      );

      res.status(200).json(updatedUsers.filter(Boolean));
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const putUserById =
  ({ userRepository = User }: UserDependencies): UpdateUserByIdService =>
  async (req, res) => {
    try {
      const { id } = req.params;

      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({ message: 'Name and email are required' });
        return;
      }
      if (!isEmailValid(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }

      const user = await userRepository.findByPk(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await user.update(req.body, { where: { id } });
      res.status(200).json(user);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteAllUsers =
  ({ userRepository = User }: UserDependencies): DeleteAllUsersService =>
  async (_req, res) => {
    try {
      userRepository.destroy({
        where: {},
      });

      res.status(200).json({
        message: 'Users deleted successfully',
      });
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteUserById =
  ({ userRepository = User }: UserDependencies): UpdateUserByIdService =>
  async (req, res) => {
    try {
      const { id } = req.params;
      await userRepository.destroy({ where: { id } });

      res.status(200).json({ message: 'User deleted successfully' });
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createService = ({
  userRepository = User,
}: UserDependencies): UserService => {
  return {
    fetchUsers: fetchUsers({ userRepository }),
    fetchUserById: fetchUserById({ userRepository }),

    createUser: createUser({ userRepository }),

    updateMultipleUsers: putMultipleUsers({
      userRepository,
    }),
    updateUserById: putUserById({ userRepository }),

    deleteUserById: deleteUserById({
      userRepository,
    }),
    deleteAllUsers: deleteAllUsers({
      userRepository,
    }),
  };
};

export default createService({ userRepository: User });
