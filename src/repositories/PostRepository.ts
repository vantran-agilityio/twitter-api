import { Post } from '@models';
import { CreatePostBody, DeletePostParamsType, PostBaseBody } from '@types';

export class PostRepository {
  private post: typeof Post;

  constructor(post: typeof Post) {
    this.post = post;
  }

  async findById(id: string) {
    return this.post.findByPk(id);
  }

  async findAll() {
    return this.post.findAll();
  }
  async create(userId: string, { title, description }: CreatePostBody) {
    return this.post.create({ title, description, userId });
  }

  async update(id: string, { title, description }: PostBaseBody) {
    return this.post.update(
      { title, description },
      {
        where: { id },
      },
    );
  }

  async deleteById({ postId, userId }: DeletePostParamsType) {
    return this.post.destroy({
      where: { id: postId, userId },
    });
  }

  async deleteAll() {
    return this.post.destroy({
      where: {},
      truncate: true,
    });
  }
}
