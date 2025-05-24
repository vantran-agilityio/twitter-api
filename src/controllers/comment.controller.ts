import { CommentService } from '@services';
import {
  CommentBaseBody,
  FetchCommentParamsType,
  GeneralParamsType,
} from '@types';
import { Request, Response } from 'express';

export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;

    this.fetchComments = this.fetchComments.bind(this);
    this.fetchCommentById = this.fetchCommentById.bind(this);
    this.createComment = this.createComment.bind(this);
    this.deleteCommentById = this.deleteCommentById.bind(this);
    this.deleteAllComments = this.deleteAllComments.bind(this);
  }

  async fetchComments(req: Request<GeneralParamsType>, res: Response) {
    try {
      const { id: postId } = req.params;

      const comments = await this.commentService.fetchComments(postId);
      if (!comments || !comments.length) {
        res.status(404).json({ error: 'No comments found' });
        return;
      }

      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async fetchCommentById(req: Request<FetchCommentParamsType>, res: Response) {
    try {
      const { commentId, postId } = req.params;

      const comment = await this.commentService.fetchCommentById(
        commentId,
        postId,
      );
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(200).json(comment);
    } catch (error) {
      console.error('Error fetching comment by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createComment(
    req: Request<GeneralParamsType, object, CommentBaseBody>,
    res: Response,
  ) {
    try {
      const { id: postId } = req.params;

      const commentData = req.body;

      const newComment = await this.commentService.createComment(
        postId,
        commentData,
      );

      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteCommentById(req: Request<FetchCommentParamsType>, res: Response) {
    try {
      const { commentId, postId } = req.params;

      const deletedComment = await this.commentService.deleteCommentById(
        commentId,
        postId,
      );
      if (!deletedComment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(204).send({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteAllComments(req: Request<GeneralParamsType>, res: Response) {
    try {
      const { id: postId } = req.params;

      await this.commentService.deleteAllComments(postId);

      res.status(204).send({ message: 'All comments deleted successfully' });
    } catch (error) {
      console.error('Error deleting all comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
