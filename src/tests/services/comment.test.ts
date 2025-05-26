import { CommentService } from '@services';
import { CommentRepository, PostRepository } from '@repositories';
import { Comment, Post, CommentModel, PostModel } from '@models';
import { CommentBaseBody } from '@types';

jest.mock('@repositories', () => {
  return {
    CommentRepository: jest.fn().mockImplementation(() => ({
      fetchComments: jest.fn(),
      fetchCommentById: jest.fn(),
      createComment: jest.fn(),
      deleteCommentById: jest.fn(),
      deleteAllComments: jest.fn(),
    })),
    PostRepository: jest.fn().mockImplementation(() => ({
      findById: jest.fn(),
    })),
  };
});

describe('CommentService', () => {
  let commentRepository: jest.Mocked<CommentRepository>;
  let postRepository: jest.Mocked<PostRepository>;
  let commentService: CommentService;
  let mockComment: CommentModel;
  let mockComments: CommentModel[];
  let mockPost: PostModel;

  beforeEach(() => {
    mockComment = {
      id: '1',
      content: 'Test comment',
      postId: 'post1',
    } as CommentModel;

    mockComments = [
      mockComment,
      {
        id: '2',
        content: 'Another test comment',
        postId: 'post1',
      } as CommentModel,
    ];

    mockPost = {
      id: 'post1',
      title: 'Test Post',
      description: 'This is a test post',
      userId: 'user1',
    } as PostModel;

    commentRepository = new CommentRepository(
      Comment,
    ) as jest.Mocked<CommentRepository>;
    postRepository = new PostRepository(Post) as jest.Mocked<PostRepository>;
    commentService = new CommentService(commentRepository, postRepository);
  });

  describe('fetchComments', () => {
    it('should return all comments for a post', async () => {
      commentRepository.fetchComments.mockResolvedValue(mockComments);

      const result = await commentService.fetchComments('post1');

      expect(commentRepository.fetchComments).toHaveBeenCalledWith('post1');
      expect(result).toEqual(mockComments);
      expect(result.length).toBe(2);
    });

    it('should return an empty array when no comments exist', async () => {
      commentRepository.fetchComments.mockResolvedValue([]);

      const result = await commentService.fetchComments('post1');

      expect(commentRepository.fetchComments).toHaveBeenCalledWith('post1');
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      commentRepository.fetchComments.mockRejectedValue(error);

      await expect(commentService.fetchComments('post1')).rejects.toThrow(
        'Database error',
      );
      expect(commentRepository.fetchComments).toHaveBeenCalledWith('post1');
    });
  });

  describe('fetchCommentById', () => {
    it('should return a comment when found', async () => {
      commentRepository.fetchCommentById.mockResolvedValue(mockComment);

      const result = await commentService.fetchCommentById('1', 'post1');

      expect(commentRepository.fetchCommentById).toHaveBeenCalledWith(
        '1',
        'post1',
      );
      expect(result).toEqual(mockComment);
    });

    it('should return null when comment is not found', async () => {
      commentRepository.fetchCommentById.mockResolvedValue(null);

      const result = await commentService.fetchCommentById('999', 'post1');

      expect(commentRepository.fetchCommentById).toHaveBeenCalledWith(
        '999',
        'post1',
      );
      expect(result).toBeNull();
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      commentRepository.fetchCommentById.mockRejectedValue(error);

      await expect(
        commentService.fetchCommentById('1', 'post1'),
      ).rejects.toThrow('Database error');
      expect(commentRepository.fetchCommentById).toHaveBeenCalledWith(
        '1',
        'post1',
      );
    });
  });

  describe('createComment', () => {
    it('should create and return a new comment when post exists', async () => {
      const commentData: CommentBaseBody = {
        content: 'New comment',
      };

      postRepository.findById.mockResolvedValue(mockPost);
      commentRepository.createComment.mockResolvedValue({
        id: '3',
        ...commentData,
        postId: 'post1',
      } as CommentModel);

      const result = await commentService.createComment('post1', commentData);

      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.createComment).toHaveBeenCalledWith(
        'post1',
        commentData,
      );
      expect(result).toHaveProperty('id', '3');
      expect(result).toHaveProperty('content', 'New comment');
      expect(result).toHaveProperty('postId', 'post1');
    });

    it('should throw an error when post does not exist', async () => {
      const commentData: CommentBaseBody = {
        content: 'New comment',
      };

      postRepository.findById.mockResolvedValue(null);

      await expect(
        commentService.createComment('nonexistent', commentData),
      ).rejects.toThrow('Post not found');
      expect(postRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(commentRepository.createComment).not.toHaveBeenCalled();
    });

    it('should propagate errors from the post repository', async () => {
      const commentData: CommentBaseBody = {
        content: 'New comment',
      };

      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(
        commentService.createComment('post1', commentData),
      ).rejects.toThrow('Database error');
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.createComment).not.toHaveBeenCalled();
    });

    it('should propagate errors from the comment repository', async () => {
      const commentData: CommentBaseBody = {
        content: 'New comment',
      };

      postRepository.findById.mockResolvedValue(mockPost);
      const error = new Error('Database error');
      commentRepository.createComment.mockRejectedValue(error);

      await expect(
        commentService.createComment('post1', commentData),
      ).rejects.toThrow('Database error');
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.createComment).toHaveBeenCalledWith(
        'post1',
        commentData,
      );
    });
  });

  describe('deleteCommentById', () => {
    it('should delete a comment and return number of affected rows when post exists', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      commentRepository.deleteCommentById.mockResolvedValue(1);

      const result = await commentService.deleteCommentById('1', 'post1');

      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteCommentById).toHaveBeenCalledWith(
        '1',
        'post1',
      );
      expect(result).toBe(1);
    });

    it('should throw an error when post does not exist', async () => {
      postRepository.findById.mockResolvedValue(null);

      await expect(
        commentService.deleteCommentById('1', 'nonexistent'),
      ).rejects.toThrow('Post not found');
      expect(postRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(commentRepository.deleteCommentById).not.toHaveBeenCalled();
    });

    it('should return 0 when no comment is deleted', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      commentRepository.deleteCommentById.mockResolvedValue(0);

      const result = await commentService.deleteCommentById('999', 'post1');

      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteCommentById).toHaveBeenCalledWith(
        '999',
        'post1',
      );
      expect(result).toBe(0);
    });

    it('should propagate errors from the post repository', async () => {
      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(
        commentService.deleteCommentById('1', 'post1'),
      ).rejects.toThrow('Database error');
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteCommentById).not.toHaveBeenCalled();
    });

    it('should propagate errors from the comment repository', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      const error = new Error('Database error');
      commentRepository.deleteCommentById.mockRejectedValue(error);

      await expect(
        commentService.deleteCommentById('1', 'post1'),
      ).rejects.toThrow('Database error');
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteCommentById).toHaveBeenCalledWith(
        '1',
        'post1',
      );
    });
  });

  describe('deleteAllComments', () => {
    it('should delete all comments for a post and return number of affected rows when post exists', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      commentRepository.deleteAllComments.mockResolvedValue(2);

      const result = await commentService.deleteAllComments('post1');

      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteAllComments).toHaveBeenCalledWith('post1');
      expect(result).toBe(2);
    });

    it('should throw an error when post does not exist', async () => {
      postRepository.findById.mockResolvedValue(null);

      await expect(
        commentService.deleteAllComments('nonexistent'),
      ).rejects.toThrow('Post not found');
      expect(postRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(commentRepository.deleteAllComments).not.toHaveBeenCalled();
    });

    it('should return 0 when no comments are deleted', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      commentRepository.deleteAllComments.mockResolvedValue(0);

      const result = await commentService.deleteAllComments('post1');

      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteAllComments).toHaveBeenCalledWith('post1');
      expect(result).toBe(0);
    });

    it('should propagate errors from the post repository', async () => {
      const error = new Error('Database error');
      postRepository.findById.mockRejectedValue(error);

      await expect(commentService.deleteAllComments('post1')).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteAllComments).not.toHaveBeenCalled();
    });

    it('should propagate errors from the comment repository', async () => {
      postRepository.findById.mockResolvedValue(mockPost);
      const error = new Error('Database error');
      commentRepository.deleteAllComments.mockRejectedValue(error);

      await expect(commentService.deleteAllComments('post1')).rejects.toThrow(
        'Database error',
      );
      expect(postRepository.findById).toHaveBeenCalledWith('post1');
      expect(commentRepository.deleteAllComments).toHaveBeenCalledWith('post1');
    });
  });
});
