import { User } from './User';
import { Post } from './Post';

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

export { User, Post };
