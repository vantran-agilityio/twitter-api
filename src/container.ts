import { Post, User } from '@models';
import { PostRepository, UserRepository } from '@repositories';
import { AuthService, PostService, UserService } from '@services';
import { AuthController, PostController, UserController } from '@controllers';

export function initializeDependencies() {
  const userRepository = new UserRepository(User);
  const postRepository = new PostRepository(Post);

  const userService = new UserService(userRepository);
  const authService = new AuthService(userRepository);
  const postService = new PostService(postRepository, userRepository);

  const userController = new UserController(userService);
  const authController = new AuthController(authService);
  const postController = new PostController(postService);

  return { userController, authController, postController };
}
