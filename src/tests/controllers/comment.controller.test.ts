import { Request, Response } from 'express';
import { CommentController } from '@controllers';
import { CommentService } from '@services';
import { Comment, CommentModel, Post } from '@models';
import { CommentRepository, PostRepository } from '@repositories';
import {
  CommentBaseBody,
  GeneralParamsType,
  FetchCommentParamsType,
} from '@types';

jest.mock('@services', () => {
  return {
    CommentService: jest.fn().mockImplementation(() => ({
      fetchComments: jest.fn(),
      fetchCommentById: jest.fn(),
      createComment: jest.fn(),
      deleteCommentById: jest.fn(),
      deleteAllComments: jest.fn(),
    })),
    PostService: jest.fn().mockImplementation(() => ({
      fetchPosts: jest.fn(),
      fetchPostById: jest.fn(),
      createPost: jest.fn(),
      updatePost: jest.fn(),
      deletePostById: jest.fn(),
      deleteAllPosts: jest.fn(),
    })),
  };
});

describe('CommentController', () => {
  let commentRepository: CommentRepository;
  let postRepository: PostRepository;
  let commentController: CommentController;
  let commentService: jest.Mocked<CommentService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockCommentData: CommentModel[];
  let mockSingleComment: CommentModel;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error to prevent output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockCommentData = [
      {
        id: '1',
        content: 'First comment',
        postId: 'post1',
      },
      {
        id: '2',
        content: 'Second comment',
        userId: 'user2',
        postId: 'post1',
      },
    ] as CommentModel[];

    mockSingleComment = {
      id: '1',
      content: 'First comment',
      postId: 'post1',
    } as CommentModel;

    commentRepository = new CommentRepository(Comment);
    postRepository = new PostRepository(Post);
    commentService = new CommentService(
      commentRepository,
      postRepository,
    ) as jest.Mocked<CommentService>;
    commentController = new CommentController(commentService);

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('fetchComments', () => {
    it('should return all comments for a post with status 200', async () => {
      req.params = { id: 'post1' };
      commentService.fetchComments.mockResolvedValue(mockCommentData);

      await commentController.fetchComments(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(commentService.fetchComments).toHaveBeenCalledWith('post1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCommentData);
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { id: 'post1' };
      commentService.fetchComments.mockRejectedValue(
        new Error('Database error'),
      );

      await commentController.fetchComments(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching comments:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('fetchCommentById', () => {
    it('should return a single comment with status 200', async () => {
      req.params = { postId: 'post1', commentId: '1' };
      commentService.fetchCommentById.mockResolvedValue(mockSingleComment);

      await commentController.fetchCommentById(
        req as Request<FetchCommentParamsType>,
        res as Response,
      );

      expect(commentService.fetchCommentById).toHaveBeenCalledWith(
        '1',
        'post1',
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSingleComment);
    });

    it('should return 404 when comment is not found', async () => {
      req.params = { postId: 'post1', commentId: '999' };
      commentService.fetchCommentById.mockResolvedValue(null);

      await commentController.fetchCommentById(
        req as Request<FetchCommentParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { postId: 'post1', commentId: '1' };
      commentService.fetchCommentById.mockRejectedValue(
        new Error('Database error'),
      );

      await commentController.fetchCommentById(
        req as Request<FetchCommentParamsType>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching comment by ID:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createComment', () => {
    it('should handle errors and return 500 status', async () => {
      req.params = { id: 'post1' };
      req.body = { content: 'New comment', userId: 'user1' };

      commentService.createComment.mockRejectedValue(
        new Error('Database error'),
      );

      await commentController.createComment(
        req as Request<GeneralParamsType, object, CommentBaseBody>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating comment:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteCommentById', () => {
    it('should return 404 when comment is not found', async () => {
      req.params = { postId: 'post1', commentId: '999' };
      commentService.deleteCommentById.mockResolvedValue(0);

      await commentController.deleteCommentById(
        req as Request<FetchCommentParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Comment not found' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { postId: 'post1', commentId: '1' };
      commentService.deleteCommentById.mockRejectedValue(
        new Error('Database error'),
      );

      await commentController.deleteCommentById(
        req as Request<FetchCommentParamsType>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting comment:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteAllComments', () => {
    it('should delete all comments for a post and return 200 status', async () => {
      req.params = { id: 'post1' };
      commentService.deleteAllComments.mockResolvedValue(1);

      await commentController.deleteAllComments(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(commentService.deleteAllComments).toHaveBeenCalledWith('post1');
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 when post is not found', async () => {
      req.params = { id: 'nonexistent' };
      commentService.deleteAllComments.mockRejectedValue(
        new Error('Post not found'),
      );

      await commentController.deleteAllComments(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { id: 'post1' };
      commentService.deleteAllComments.mockRejectedValue(
        new Error('Database error'),
      );

      await commentController.deleteAllComments(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting all comments:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
