import { Comment, Post } from '@models';

export type CommentDependencies = {
  commentRepository?: typeof Comment;
  postRepository?: typeof Post;
};

export type CommentBaseBody = {
  content: string;
};

export type CreateCommentBody = CommentBaseBody;
