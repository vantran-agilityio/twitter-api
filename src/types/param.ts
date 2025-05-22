export type GeneralParamsType = {
  id: string;
};

export type DeletePostParamsType = {
  userId: string;
  postId: string;
};

export type FetchCommentParamsType = {
  postId: string;
  commentId: string;
};
