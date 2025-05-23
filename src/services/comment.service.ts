import { Comment, Post } from '@models';
import {
  CommentDependencies,
  CommentService,
  CreateCommentService,
  DeleteAllCommentsService,
  DeleteCommentByIdService,
  FetchCommentByIdService,
  FetchCommentsService,
} from '@types';

const fetchComments =
  ({
    commentRepository = Comment,
  }: CommentDependencies): FetchCommentsService =>
  async (req, res) => {
    try {
      const { id: postId } = req.params;

      const comments = await commentRepository.findAll({
        where: { postId },
      });

      if (!comments.length) {
        res.status(404).json({ message: 'No comments found for this post' });
        return;
      }

      res.status(200).json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const fetchCommentById =
  ({
    commentRepository = Comment,
  }: CommentDependencies): FetchCommentByIdService =>
  async (req, res) => {
    try {
      const { commentId, postId } = req.params;

      const comment = await commentRepository.findOne({
        where: { id: commentId, postId },
      });

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      res.status(200).json(comment);
    } catch (error) {
      console.error('Error fetching comment by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createComment =
  ({
    commentRepository = Comment,
    postRepository = Post,
  }: CommentDependencies): CreateCommentService =>
  async (req, res) => {
    try {
      const { content } = req.body;
      const { id: postId } = req.params;

      console.log('postId', postId);

      if (!content) {
        res.status(400).json({ message: 'Comment content is required' });
        return;
      }

      // Check if post exists
      const post = await postRepository.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      const newComment = await commentRepository.create({
        content,
        postId,
        // userId: req.user.id, // If you want to associate comments with users
      });

      res
        .status(201)
        .json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteCommentById =
  ({
    commentRepository = Comment,
  }: CommentDependencies): DeleteCommentByIdService =>
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const comment = await commentRepository.findOne({
        where: { id: commentId, postId },
      });

      if (!comment) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      await commentRepository.destroy({
        where: { id: commentId, postId },
      });

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteAllComments =
  ({
    commentRepository = Comment,
  }: CommentDependencies): DeleteAllCommentsService =>
  async (req, res) => {
    try {
      const { id: postId } = req.params;

      await commentRepository.destroy({
        where: { postId },
      });

      res
        .status(200)
        .json({ message: 'All comments for this post deleted successfully' });
    } catch (error) {
      console.error('Error deleting all comments:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createService = ({
  commentRepository = Comment,
  postRepository = Post,
}: CommentDependencies): CommentService => {
  return {
    fetchComments: fetchComments({
      commentRepository,
    }),
    fetchCommentById: fetchCommentById({
      commentRepository,
    }),

    createComment: createComment({
      commentRepository,
      postRepository,
    }),

    deleteCommentById: deleteCommentById({
      commentRepository,
    }),
    deleteAllComments: deleteAllComments({
      commentRepository,
    }),
  };
};

export default createService({
  commentRepository: Comment,
  postRepository: Post,
});
