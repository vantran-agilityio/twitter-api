import { InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export interface PostModel
  extends Model<
    InferAttributes<PostModel>,
    InferCreationAttributes<PostModel>
  > {
  id: string;
  title: string;
  userId: string;
}
