import { Post, PostModel } from '@models';
import { PostRepository } from '@repositories';
import { CreatePostBody, DeletePostParamsType, PostBaseBody } from '@types';

jest.mock('@models', () => {
  return {
    Post: {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
  };
});

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let mockPost: PostModel;
  let mockPosts: PostModel[];

  beforeEach(() => {
    jest.clearAllMocks();

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

    postRepository = new PostRepository(Post);
  });

  describe('findById', () => {
    it('should return a post when found', async () => {
      (Post.findByPk as jest.Mock).mockResolvedValue(mockPost);

      const result = await postRepository.findById('1');

      expect(Post.findByPk).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPost);
    });

    it('should return null when post is not found', async () => {
      (Post.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await postRepository.findById('999');

      expect(Post.findByPk).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('should propagate errors', async () => {
      const error = new Error('Database error');
      (Post.findByPk as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.findById('1')).rejects.toThrow(
        'Database error',
      );
      expect(Post.findByPk).toHaveBeenCalledWith('1');
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      (Post.findAll as jest.Mock).mockResolvedValue(mockPosts);

      const result = await postRepository.findAll();

      expect(Post.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no posts exist', async () => {
      (Post.findAll as jest.Mock).mockResolvedValue([]);

      const result = await postRepository.findAll();

      expect(Post.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors', async () => {
      const error = new Error('Database error');
      (Post.findAll as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.findAll()).rejects.toThrow('Database error');
      expect(Post.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      const userId = 'user1';
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      const newPost = {
        id: '3',
        ...postData,
        userId,
      } as PostModel;

      (Post.create as jest.Mock).mockResolvedValue(newPost);

      const result = await postRepository.create(userId, postData);

      expect(Post.create).toHaveBeenCalledWith({
        title: 'New Post',
        description: 'This is a new post',
        userId: 'user1',
      });
      expect(result).toEqual(newPost);
    });

    it('should propagate errors', async () => {
      const userId = 'user1';
      const postData: CreatePostBody = {
        title: 'New Post',
        description: 'This is a new post',
      };

      const error = new Error('Database error');
      (Post.create as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.create(userId, postData)).rejects.toThrow(
        'Database error',
      );
      expect(Post.create).toHaveBeenCalledWith({
        title: 'New Post',
        description: 'This is a new post',
        userId: 'user1',
      });
    });
  });

  describe('update', () => {
    it('should update and return the number of affected rows', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      (Post.update as jest.Mock).mockResolvedValue([1]);

      const result = await postRepository.update('1', postData);

      expect(Post.update).toHaveBeenCalledWith(
        { title: 'Updated Title', description: 'This post has been updated' },
        { where: { id: '1' } },
      );
      expect(result).toEqual([1]);
    });

    it('should return [0] when no post is updated', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      (Post.update as jest.Mock).mockResolvedValue([0]);

      const result = await postRepository.update('999', postData);

      expect(Post.update).toHaveBeenCalledWith(
        { title: 'Updated Title', description: 'This post has been updated' },
        { where: { id: '999' } },
      );
      expect(result).toEqual([0]);
    });

    it('should propagate errors', async () => {
      const postData: PostBaseBody = {
        title: 'Updated Title',
        description: 'This post has been updated',
      };

      const error = new Error('Database error');
      (Post.update as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.update('1', postData)).rejects.toThrow(
        'Database error',
      );
      expect(Post.update).toHaveBeenCalledWith(
        { title: 'Updated Title', description: 'This post has been updated' },
        { where: { id: '1' } },
      );
    });
  });

  describe('deleteById', () => {
    it('should delete a post and return number of affected rows', async () => {
      const params: DeletePostParamsType = {
        postId: '1',
        userId: 'user1',
      };

      (Post.destroy as jest.Mock).mockResolvedValue(1);

      const result = await postRepository.deleteById(params);

      expect(Post.destroy).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
      expect(result).toBe(1);
    });

    it('should return 0 when no post is deleted', async () => {
      const params: DeletePostParamsType = {
        postId: '999',
        userId: 'user1',
      };

      (Post.destroy as jest.Mock).mockResolvedValue(0);

      const result = await postRepository.deleteById(params);

      expect(Post.destroy).toHaveBeenCalledWith({
        where: { id: '999', userId: 'user1' },
      });
      expect(result).toBe(0);
    });

    it('should propagate errors', async () => {
      const params: DeletePostParamsType = {
        postId: '1',
        userId: 'user1',
      };

      const error = new Error('Database error');
      (Post.destroy as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.deleteById(params)).rejects.toThrow(
        'Database error',
      );
      expect(Post.destroy).toHaveBeenCalledWith({
        where: { id: '1', userId: 'user1' },
      });
    });
  });

  describe('deleteAll', () => {
    it('should delete all posts and return number of affected rows', async () => {
      (Post.destroy as jest.Mock).mockResolvedValue(2);

      const result = await postRepository.deleteAll();

      expect(Post.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
      expect(result).toBe(2);
    });

    it('should return 0 when no posts are deleted', async () => {
      (Post.destroy as jest.Mock).mockResolvedValue(0);

      const result = await postRepository.deleteAll();

      expect(Post.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
      expect(result).toBe(0);
    });

    it('should propagate errors', async () => {
      const error = new Error('Database error');
      (Post.destroy as jest.Mock).mockRejectedValue(error);

      await expect(postRepository.deleteAll()).rejects.toThrow(
        'Database error',
      );
      expect(Post.destroy).toHaveBeenCalledWith({
        where: {},
        truncate: true,
      });
    });
  });
});
