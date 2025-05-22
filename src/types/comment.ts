import { Comment, Post } from '@models';
import { Request, Response } from 'express';
import { FetchCommentParamsType, GeneralParamsType } from './param';

export type CommentDependencies = {
  commentRepository?: typeof Comment;
  postRepository?: typeof Post;
};

export type CommentBaseBody = {
  content: string;
};

export type CreateCommentBody = CommentBaseBody;

// Fetch Comments
export type FetchCommentsService = (
  req: Request,
  res: Response,
) => Promise<void>;
export type FetchCommentByIdService = (
  req: Request<FetchCommentParamsType>,
  res: Response,
) => Promise<void>;

// Create Comment
export type CreateCommentService = (
  req: Request<GeneralParamsType, object, CreateCommentBody>,
  res: Response,
) => Promise<void>;

// Delete Comment
export type DeleteAllCommentsService = (
  req: Request,
  res: Response,
) => Promise<void>;
export type DeleteCommentByIdService = (
  req: Request,
  res: Response,
) => Promise<void>;

export type CommentService = {
  fetchComments: FetchCommentsService;
  fetchCommentById: FetchCommentByIdService;

  createComment: CreateCommentService;

  deleteAllComments: DeleteAllCommentsService;
  deleteCommentById: DeleteCommentByIdService;
};
