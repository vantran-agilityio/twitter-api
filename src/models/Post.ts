import { sequelize } from '@configs';
import { DataTypes } from 'sequelize';
import { User } from './User';
import { PostModel } from '@types';

export const Post = sequelize.define<PostModel>('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Post.belongsTo(User, {
  targetKey: 'userId',
});
