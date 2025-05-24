import { User } from '@models';
import { UserRepository } from '@repositories';
import { AuthService, UserService } from '@services';
import { AuthController, UserController } from '@controllers';

export function initializeDependencies() {
  const userRepository = new UserRepository(User);
  // const postRepository = new PostRepository();

  // Khởi tạo các service và truyền repository tương ứng
  const userService = new UserService(userRepository);
  const authService = new AuthService(userRepository);

  // Khởi tạo controller và truyền các service
  const userController = new UserController(userService);
  const authController = new AuthController(authService);
  // const postController = new PostController(userService, postService);

  return { userController, authController };
}
