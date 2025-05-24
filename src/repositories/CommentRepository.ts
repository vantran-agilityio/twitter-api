import { Comment } from '@models';
import { CommentBaseBody } from '@types';

export class CommentRepository {
  private comment: typeof Comment;

  constructor(comment: typeof Comment) {
    this.comment = comment;
  }

  async fetchComments(postId: string) {
    return this.comment.findAll({
      where: { postId },
    });
  }

  async fetchCommentById(commentId: string, postId: string) {
    return this.comment.findOne({
      where: { id: commentId, postId },
    });
  }

  async createComment(postId: string, body: CommentBaseBody) {
    return this.comment.create({ postId, ...body });
  }

  async deleteCommentById(commentId: string, postId: string) {
    return this.comment.destroy({
      where: { id: commentId, postId },
    });
  }

  async deleteAllComments(postId: string) {
    return this.comment.destroy({
      where: { postId },
      truncate: true,
    });
  }
}
