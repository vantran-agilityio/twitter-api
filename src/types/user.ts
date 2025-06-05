type UserBaseBody = {
  name: string;
  email: string;
};

export type UserBody = UserBaseBody & { id: string };

export type CreateUserBody = UserBaseBody & {
  password: string;
};

export type UpdateUserByIdBody = UserBaseBody;
export type UpdateMultipleUsersBody = {
  users: UserBody[];
};
