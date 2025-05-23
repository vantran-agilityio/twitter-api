import { Post, User } from '@models';
import {
  CreatePostService,
  DeleteAllPostsService,
  DeletePostByIdService,
  FetchPostByIdService,
  FetchPostsService,
  PostDependencies,
  PostService,
  UpdatePostByIdService,
} from '@types';

const fetchPosts =
  ({ postRepository = Post }: PostDependencies): FetchPostsService =>
  async (_req, res) => {
    try {
      const posts = await postRepository.findAll();

      if (!posts.length) {
        res.status(404).json({ message: 'No posts found' });
      }

      res.status(200).json(posts);
    } catch {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const fetchPostById =
  ({ postRepository = Post }: PostDependencies): FetchPostByIdService =>
  async (req, res) => {
    try {
      const { id } = req.params;

      const post = await postRepository.findByPk(id);

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createPost =
  ({
    postRepository = Post,
    userRepository = User,
  }: PostDependencies): CreatePostService =>
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const { id: userId } = req.params;

      if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
      }

      const user = await userRepository.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const newPost = await postRepository.create({
        title,
        description,
        userId,
      });

      res.status(201).json({ message: 'Post created successfully', newPost });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const updatePostById =
  ({ postRepository = Post }: PostDependencies): UpdatePostByIdService =>
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const post = await postRepository.findByPk(id);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
      }

      await postRepository.update({ title, description }, { where: { id } });

      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deletePostById =
  ({
    postRepository = Post,
    userRepository = User,
  }: PostDependencies): DeletePostByIdService =>
  async (req, res) => {
    try {
      const { userId, postId } = req.params;

      const user = await userRepository.findByPk(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const post = await postRepository.findByPk(postId);
      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      await postRepository.destroy({
        where: { id: postId, userId },
      });

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteMultiplePosts =
  ({ postRepository = Post }: PostDependencies): DeleteAllPostsService =>
  async (_req, res) => {
    try {
      await postRepository.destroy({ where: {} });

      res.status(200).json({ message: 'Posts deleted successfully' });
    } catch (error) {
      console.error('Error deleting posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const createService = ({
  postRepository = Post,
  userRepository = User,
}: PostDependencies): PostService => ({
  fetchPosts: fetchPosts({ postRepository }),
  fetchPostById: fetchPostById({ postRepository }),
  createPost: createPost({ postRepository, userRepository }),
  updatePostById: updatePostById({ postRepository }),
  deletePostById: deletePostById({ postRepository, userRepository }),
  deleteAllPosts: deleteMultiplePosts({ postRepository }),
});

export default createService({
  postRepository: Post,
  userRepository: User,
});
