import { User } from '@models';
import { UserRepository } from '@repositories';
import { UserService } from '@services';
import { UserController } from '@controllers';

export function initializeDependencies() {
  const userRepository = new UserRepository(User);
  // const postRepository = new PostRepository();

  // Khởi tạo các service và truyền repository tương ứng
  const userService = new UserService(userRepository);
  // const postService = new PostService(postRepository);

  // Khởi tạo controller và truyền các service
  const userController = new UserController(userService);
  // const postController = new PostController(userService, postService);

  return { userController };
}
