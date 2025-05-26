import { PostService } from '@services';
import { PostRepository, UserRepository } from '@repositories';
import { Post, User, PostModel, UserModel } from '@models';
import { CreatePostBody, PostBaseBody } from '@types';
import { ERROR } from '@constants';

// Mock the repositories
jest.mock('@repositories', () => {
  return {
    PostRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn(),
      deleteAll: jest.fn(),
    })),
    UserRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
    })),
  };
});

describe('PostService', () => {
  let postRepository: jest.Mocked<PostRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let postService: PostService;
  let mockPost: PostModel;
  let mockPosts: PostModel[];
  let mockUser: UserModel;

  beforeEach(() => {
    mockPost = {
      id: '1',
      title: 'Test Post',
      description: 'This is a test post',
      userId: 'user1',
    } as PostModel;

    mockPosts = [
      mockPost,
      {
        id: '2',
        title: 'Another Test Post',
        description: 'This is another test post',
        userId: 'user2',
      } as PostModel,
    ];

    mockUser = {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
    } as UserModel;

    postRepository = new PostRepository(Post) as jest.Mocked<PostRepository>;
    userRepository = new UserRepository(User) as jest.Mocked<UserRepository>;
    postService = new PostService(postRepository, userRepository);
  });

  describe('fetchPosts', () => {
    it('should return all posts', async () => {
      postRepository.findAll.mockResolvedValue(mockPosts);

      const result = await postService.fetchPosts();

      expect(postRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no posts exist', async () => {
      postRepository.findAll.mockResolvedValue([]);

      const result = await postService.fetchPosts();

      expect(postRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      postRepository.findAll.mockRejectedValue(error);

      await expect(postService.fetchPosts()).rejects.toThrow('Database error');
      expect(postRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('fetchPostById', () => {
    it('should return a post when found', async () => {
      postRepository.findById.mockResolvedValue(mockPost);

      const result = await postService.fetchPostById('1');

      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPost);
    });

    it('should return null when post is not found', async () => {
      postRepository.findById.mockResolvedValue(null);

      const result = await postService.fetchPostById('999');

      expect(postRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(postService.fetchPostById('1')).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('createPost', () => {
    it('should create and return a new post when user exists', async () => {
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      userRepository.findById.mockResolvedValue(mockUser);
      postRepository.create.mockResolvedValue({
        id: '3',
        ...postData,
        userId: 'user1',
      } as PostModel);

      const result = await postService.createPost('user1', postData);

      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.create).toHaveBeenCalledWith('user1', postData);
      expect(result).toHaveProperty('id', '3');
      expect(result).toHaveProperty('title', 'New Post');
      expect(result).toHaveProperty('userId', 'user1');
    });

    it('should throw an error when user does not exist', async () => {
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(
        postService.createPost('nonexistent', postData),
      ).rejects.toThrow(ERROR.USER_NOT_FOUND);
      expect(userRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(postRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate errors from the user repository', async () => {
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      const error = new Error('Database error');
      userRepository.findById.mockRejectedValue(error);

      await expect(postService.createPost('user1', postData)).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate errors from the post repository', async () => {
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      userRepository.findById.mockResolvedValue(mockUser);
      const error = new Error('Database error');
      postRepository.create.mockRejectedValue(error);

      await expect(postService.createPost('user1', postData)).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.create).toHaveBeenCalledWith('user1', postData);
    });
  });

  describe('updatePost', () => {
    it('should update and return the number of affected rows when post exists', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.update.mockResolvedValue([1]);

      const result = await postService.updatePost('1', postData);

      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.update).toHaveBeenCalledWith('1', postData);
      expect(result).toEqual([1]);
    });

    it('should throw an error when post does not exist', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      postRepository.findById.mockResolvedValue(null);

      await expect(postService.updatePost('999', postData)).rejects.toThrow(
        'Post not found',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('999');
      expect(postRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate errors from the findById method', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(postService.updatePost('1', postData)).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.update).not.toHaveBeenCalled();
    });

    it('should propagate errors from the update method', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      postRepository.findById.mockResolvedValue(mockPost);
      const error = new Error('Database error');
      postRepository.update.mockRejectedValue(error);

      await expect(postService.updatePost('1', postData)).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.update).toHaveBeenCalledWith('1', postData);
    });
  });

  describe('deletePostById', () => {
    it('should delete a post and return number of affected rows when user and post exist', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      postRepository.findById.mockResolvedValue(mockPost);
      postRepository.deleteById.mockResolvedValue(1);

      const result = await postService.deletePostById('1', 'user1');

      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.deleteById).toHaveBeenCalledWith({
        postId: '1',
        userId: 'user1',
      });
      expect(result).toBe(1);
    });

    it('should throw an error when user does not exist', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        postService.deletePostById('1', 'nonexistent'),
      ).rejects.toThrow(ERROR.USER_NOT_FOUND);
      expect(userRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(postRepository.findById).not.toHaveBeenCalled();
      expect(postRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should throw an error when post does not exist', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      postRepository.findById.mockResolvedValue(null);

      await expect(postService.deletePostById('999', 'user1')).rejects.toThrow(
        'Post not found',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.findById).toHaveBeenCalledWith('999');
      expect(postRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should propagate errors from the user repository', async () => {
      const error = new Error('Database error');
      userRepository.findById.mockRejectedValue(error);

      await expect(postService.deletePostById('1', 'user1')).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.findById).not.toHaveBeenCalled();
      expect(postRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should propagate errors from the post repository findById method', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(postService.deletePostById('1', 'user1')).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.deleteById).not.toHaveBeenCalled();
    });

    it('should propagate errors from the post repository deleteById method', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      postRepository.findById.mockResolvedValue(mockPost);
      const error = new Error('Database error');
      postRepository.deleteById.mockRejectedValue(error);

      await expect(postService.deletePostById('1', 'user1')).rejects.toThrow(
        'Database error',
      );
      expect(userRepository.findById).toHaveBeenCalledWith('user1');
      expect(postRepository.findById).toHaveBeenCalledWith('1');
      expect(postRepository.deleteById).toHaveBeenCalledWith({
        postId: '1',
        userId: 'user1',
      });
    });
  });

  describe('deleteAllPosts', () => {
    it('should delete all posts and return number of affected rows', async () => {
      postRepository.deleteAll.mockResolvedValue(2);

      const result = await postService.deleteAllPosts();

      expect(postRepository.deleteAll).toHaveBeenCalled();
      expect(result).toBe(2);
    });

    it('should return 0 when no posts are deleted', async () => {
      postRepository.deleteAll.mockResolvedValue(0);

      const result = await postService.deleteAllPosts();

      expect(postRepository.deleteAll).toHaveBeenCalled();
      expect(result).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      postRepository.deleteAll.mockRejectedValue(error);

      await expect(postService.deleteAllPosts()).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.deleteAll).toHaveBeenCalled();
    });
  });
});
