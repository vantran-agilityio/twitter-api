import { Request, Response } from 'express';

import { PostController } from '@controllers';
import { PostService } from '@services';
import { Post, PostModel, User } from '@models';
import { PostRepository, UserRepository } from '@repositories';
import {
  GeneralParamsType,
  CreatePostBody,
  UpdatePostByIdBody,
  DeletePostParamsType,
} from '@types';
import { ERROR } from '@constants';

jest.mock('@services', () => {
  return {
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

describe('PostController', () => {
  let userRepository: UserRepository;
  let postRepository: PostRepository;
  let postController: PostController;
  let postService: jest.Mocked<PostService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockPostData: PostModel[];
  let mockSinglePost: PostModel;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock console.error to prevent output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockPostData = [
      {
        id: '1',
        title: 'First Post',
        description: 'This is the first post',
        userId: 'user1',
      },
      {
        id: '2',
        title: 'Second Post',
        description: 'This is the second post',
        userId: 'user2',
      },
    ] as PostModel[];

    mockSinglePost = {
      id: '1',
      title: 'First Post',
      description: 'This is the first post',
      userId: 'user1',
    } as PostModel;
    userRepository = new UserRepository(User);
    postRepository = new PostRepository(Post);
    postService = new PostService(
      postRepository,
      userRepository,
    ) as jest.Mocked<PostService>;
    postController = new PostController(postService);

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

  describe('getPosts', () => {
    it('should return all posts with status 200', async () => {
      postService.fetchPosts.mockResolvedValue(mockPostData);

      await postController.getPosts(req as Request, res as Response);

      expect(postService.fetchPosts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPostData);
    });

    it('should return 404 when no posts are found', async () => {
      postService.fetchPosts.mockResolvedValue([]);

      await postController.getPosts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No posts found' });
    });

    it('should handle errors and return 500 status', async () => {
      postService.fetchPosts.mockRejectedValue(new Error('Database error'));

      await postController.getPosts(req as Request, res as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching posts:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });

  describe('getPostById', () => {
    it('should return a single post with status 200', async () => {
      req.params = { id: '1' };
      postService.fetchPostById.mockResolvedValue(mockSinglePost);

      await postController.getPostById(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(postService.fetchPostById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSinglePost);
    });

    it('should return 404 when post is not found', async () => {
      req.params = { id: '999' };
      postService.fetchPostById.mockResolvedValue(null);

      await postController.getPostById(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { id: '1' };
      postService.fetchPostById.mockRejectedValue(new Error('Database error'));

      await postController.getPostById(
        req as Request<GeneralParamsType>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching post by ID:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });

  describe('createPost', () => {
    it('should create a post and return 201 status', async () => {
      req.params = { id: 'user1' };
      req.body = {
        title: 'New Post',
        description: 'This is a new post',
      };

      const newPost = {
        id: '3',
        title: 'New Post',
        description: 'This is a new post',
        userId: 'user1',
      };

      postService.createPost.mockResolvedValue(newPost as PostModel);

      await postController.createPost(
        req as Request<GeneralParamsType, object, CreatePostBody>,
        res as Response,
      );

      expect(postService.createPost).toHaveBeenCalledWith('user1', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 when required fields are missing', async () => {
      req.params = { id: 'user1' };
      req.body = { title: 'New Post' };

      await postController.createPost(
        req as Request<GeneralParamsType, object, CreatePostBody>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title and description are required',
      });
      expect(postService.createPost).not.toHaveBeenCalled();
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { id: 'user1' };
      req.body = {
        title: 'New Post',
        description: 'This is a new post',
      };

      postService.createPost.mockRejectedValue(new Error('Database error'));

      await postController.createPost(
        req as Request<GeneralParamsType, object, CreatePostBody>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating post:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });

  describe('updatePostById', () => {
    it('should update a post and return 200 status', async () => {
      req.params = { id: '1' };
      req.body = {
        title: 'Updated Post',
        description: 'This is an updated post',
      };

      postService.fetchPostById.mockResolvedValue(mockSinglePost);
      postService.updatePost.mockResolvedValue([1]);

      await postController.updatePostById(
        req as Request<GeneralParamsType, object, UpdatePostByIdBody>,
        res as Response,
      );

      expect(postService.updatePost).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post updated successfully',
      });
    });

    it('should return 400 when required fields are missing', async () => {
      req.params = { id: '1' };
      req.body = {};

      postService.fetchPostById.mockResolvedValue(mockSinglePost);

      await postController.updatePostById(
        req as Request<GeneralParamsType, object, UpdatePostByIdBody>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Title or description is required',
      });
      expect(postService.updatePost).not.toHaveBeenCalled();
    });

    it('should return 404 when post is not found', async () => {
      req.params = { id: '999' };
      req.body = {
        title: 'Updated Post',
        description: 'This is an updated post',
      };

      postService.fetchPostById.mockResolvedValue(null);

      await postController.updatePostById(
        req as Request<GeneralParamsType, object, UpdatePostByIdBody>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });

    it('should handle errors and return 500 status', async () => {
      req.params = { id: '1' };
      req.body = {
        title: 'Updated Post',
        description: 'This is an updated post',
      };

      postService.fetchPostById.mockResolvedValue(mockSinglePost);
      postService.updatePost.mockRejectedValue(new Error('Database error'));

      await postController.updatePostById(
        req as Request<GeneralParamsType, object, UpdatePostByIdBody>,
        res as Response,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error updating post:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });

  describe('deletePostById', () => {
    it('should delete a post and return 200 status', async () => {
      req.params = { userId: 'user1', postId: '1' };
      postService.deletePostById.mockResolvedValue(1);

      await postController.deletePostById(
        req as Request<DeletePostParamsType>,
        res as Response,
      );

      expect(postService.deletePostById).toHaveBeenCalledWith('1', 'user1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Post deleted successfully',
      });
    });

    it('should return 404 when post is not found', async () => {
      req.params = { userId: 'user1', postId: '999' };
      postService.deletePostById.mockResolvedValue(0);

      await postController.deletePostById(
        req as Request<DeletePostParamsType>,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
  });

  describe('deleteAllPosts', () => {
    it('should delete all posts and return 200 status', async () => {
      postService.deleteAllPosts.mockResolvedValue(2);

      await postController.deleteAllPosts(req as Request, res as Response);

      expect(postService.deleteAllPosts).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All posts deleted successfully',
      });
    });

    it('should handle errors and return 500 status', async () => {
      postService.deleteAllPosts.mockRejectedValue(new Error('Database error'));

      await postController.deleteAllPosts(req as Request, res as Response);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting all posts:',
        expect.any(Error),
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: ERROR.COMMON });
    });
  });
});
