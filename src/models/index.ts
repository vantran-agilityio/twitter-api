import { User } from './user.model';
import { Post } from './post.model';
import { Comment } from './comment.model';

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

export { User, Post, Comment };
