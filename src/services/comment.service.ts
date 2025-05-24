import { CommentRepository, PostRepository } from '@repositories';
import { CommentBaseBody } from '@types';

export class CommentService {
  private commentRepository: CommentRepository;
  private postRepository: PostRepository;

  constructor(
    commentRepository: CommentRepository,
    postRepository: PostRepository,
  ) {
    this.commentRepository = commentRepository;
    this.postRepository = postRepository;
  }

  async fetchComments(postId: string) {
    return this.commentRepository.fetchComments(postId);
  }

  async fetchCommentById(commentId: string, postId: string) {
    return this.commentRepository.fetchCommentById(commentId, postId);
  }

  async createComment(postId: string, body: CommentBaseBody) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return this.commentRepository.createComment(postId, body);
  }

  async deleteCommentById(commentId: string, postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return this.commentRepository.deleteCommentById(commentId, postId);
  }
  async deleteAllComments(postId: string) {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return this.commentRepository.deleteAllComments(postId);
  }
}
