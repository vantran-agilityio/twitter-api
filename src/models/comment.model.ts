import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelStatic,
} from 'sequelize';

import { sequelize } from '@configs';

export interface CommentModel
  extends Model<
    InferAttributes<CommentModel>,
    InferCreationAttributes<CommentModel>
  > {
  id: CreationOptional<string>;
  content: string;
  postId: string;
}

export type CommentRepository = ModelStatic<CommentModel>;

export const Comment = sequelize.define<CommentModel>('comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  postId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'posts', // Assuming the posts table is named 'posts'
      key: 'id',
    },
  },
});
