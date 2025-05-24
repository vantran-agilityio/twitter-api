import { PostRepository, UserRepository } from '@repositories';
import { CreatePostBody, PostBaseBody } from '@types';

export class PostService {
  private postRepository: PostRepository;
  private userRepository: UserRepository;

  constructor(postRepository: PostRepository, userRepository: UserRepository) {
    this.postRepository = postRepository;
    this.userRepository = userRepository;
  }

  async fetchPosts() {
    return this.postRepository.findAll();
  }

  async fetchPostById(id: string) {
    return this.postRepository.findById(id);
  }

  async createPost(userId: string, postData: CreatePostBody) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.postRepository.create(userId, postData);
  }

  async updatePost(id: string, postData: PostBaseBody) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new Error('Post not found');
    }

    return this.postRepository.update(id, postData);
  }

  async deletePostById(postId: string, userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    return this.postRepository.deleteById({ postId, userId });
  }

  async deleteAllPosts() {
    return this.postRepository.deleteAll();
  }
}
