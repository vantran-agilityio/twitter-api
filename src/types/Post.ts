import { Request, Response } from 'express';

import { GeneralParamsType } from './param';

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
