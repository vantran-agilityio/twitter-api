import { Post, User } from '@models';
import { Request, Response } from 'express';
import { DeletePostParamsType, GeneralParamsType } from './param';

export type PostDependencies = {
  postRepository?: typeof Post;
  userRepository?: typeof User;
};

export type PostBaseBody = {
  title: string;
  description: string;
};

export type CreatePostBody = PostBaseBody;

export type UpdatePostByIdBody = PostBaseBody;

// Fetch Posts
export type FetchPostsService = (req: Request, res: Response) => Promise<void>;
export type FetchPostByIdService = (
  req: Request<GeneralParamsType>,
  res: Response,
) => Promise<void>;

// Create Post
export type CreatePostService = (
  req: Request<GeneralParamsType, object, CreatePostBody>,
  res: Response,
) => Promise<void>;

// Update Post
export type UpdatePostByIdService = (
  req: Request<GeneralParamsType, object, UpdatePostByIdBody>,
  res: Response,
) => Promise<void>;

// Delete Post
export type DeleteAllPostsService = (
  req: Request,
  res: Response,
) => Promise<void>;
export type DeletePostByIdService = (
  req: Request<DeletePostParamsType>,
  res: Response,
) => Promise<void>;

export type PostService = {
  fetchPosts: FetchPostsService;
  fetchPostById: FetchPostByIdService;

  createPost: CreatePostService;

  updatePostById: UpdatePostByIdService;

  deleteAllPosts: DeleteAllPostsService;
  deletePostById: DeletePostByIdService;
};
