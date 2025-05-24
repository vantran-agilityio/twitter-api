import { Comment, Post, User } from '@models';
import {
  CommentRepository,
  PostRepository,
  UserRepository,
} from '@repositories';
import {
  AuthService,
  CommentService,
  PostService,
  UserService,
} from '@services';
import {
  AuthController,
  CommentController,
  PostController,
  UserController,
} from '@controllers';

export function initializeDependencies() {
  const userRepository = new UserRepository(User);
  const postRepository = new PostRepository(Post);
  const commentRepository = new CommentRepository(Comment);

  const userService = new UserService(userRepository);
  const authService = new AuthService(userRepository);
  const postService = new PostService(postRepository, userRepository);
  const commentService = new CommentService(commentRepository, postRepository);

  const userController = new UserController(userService);
  const authController = new AuthController(authService);
  const postController = new PostController(postService);
  const commentController = new CommentController(commentService);

  return { userController, authController, postController, commentController };
}
