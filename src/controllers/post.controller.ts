import { PostService } from '@services';
import { DeletePostParamsType, GeneralParamsType, PostBaseBody } from '@types';
import { Request, Response } from 'express';

export class PostController {
  private postService: PostService;

  constructor(postService: PostService) {
    this.postService = postService;

    this.getPosts = this.getPosts.bind(this);
    this.getPostById = this.getPostById.bind(this);
    this.createPost = this.createPost.bind(this);
    this.updatePostById = this.updatePostById.bind(this);
    this.deletePostById = this.deletePostById.bind(this);
    this.deleteAllPosts = this.deleteAllPosts.bind(this);
  }

  async getPosts(_: Request, res: Response) {
    try {
      const posts = await this.postService.fetchPosts();
      if (!posts || !posts.length) {
        res.status(404).json({ error: 'No posts found' });
        return;
      }

      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getPostById(req: Request<GeneralParamsType>, res: Response) {
    try {
      const { id } = req.params;

      const post = await this.postService.fetchPostById(id);
      if (!post) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createPost(
    req: Request<GeneralParamsType, object, PostBaseBody>,
    res: Response,
  ) {
    try {
      const { id: userId } = req.params;

      const postData = req.body;

      const newPost = await this.postService.createPost(userId, postData);
      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updatePostById(
    req: Request<GeneralParamsType, object, PostBaseBody>,
    res: Response,
  ) {
    try {
      const { id } = req.params;
      const postData = req.body;

      const updatedPost = await this.postService.updatePost(id, postData);
      if (!updatedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deletePostById(req: Request<DeletePostParamsType>, res: Response) {
    try {
      const { postId, userId } = req.params;

      const deletedPost = await this.postService.deletePostById(postId, userId);
      if (!deletedPost) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }

      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deleteAllPosts(_: Request, res: Response) {
    try {
      await this.postService.deleteAllPosts();
      res.status(200).json({ message: 'All posts deleted successfully' });
    } catch (error) {
      console.error('Error deleting all posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
