import { DataTypes } from 'sequelize';

import { sequelize } from '@configs';
import { UserModel } from '@types';
import { Post } from './Post';

export const User = sequelize.define<UserModel>('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  postId: {
    type: DataTypes.ARRAY,
    allowNull: true,
  },
});

User.hasMany(Post, {
  foreignKey: 'userId',
});
