import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import { sequelize } from '@configs';

export interface PostModel
  extends Model<
    InferAttributes<PostModel>,
    InferCreationAttributes<PostModel>
  > {
  id: string;
  title: string;
  userId: string;
}

export const Post = sequelize.define<PostModel>('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
