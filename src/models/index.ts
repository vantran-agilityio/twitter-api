import { User, UserModel } from './user.model';
import { Post, PostModel } from './post.model';
import { Comment, CommentModel } from './comment.model';

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

export type { UserModel, PostModel, CommentModel };

export { User, Post, Comment };
