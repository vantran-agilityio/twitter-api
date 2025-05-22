import { User } from './user.model';
import { Post } from './post.model';

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

export { User, Post };
