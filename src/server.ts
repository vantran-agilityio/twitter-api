import express from 'express';

import { config, sequelize } from './configs';
import {
  userService,
  authService,
  postService,
  commentService,
} from '@services';
import { authRouter, postRouter, userRouter } from '@routes';
import { initialize } from 'auth';
import { commentRouter } from 'routes/comment.route';

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  if (req.body) {
    delete req.body.id;
  }
  next();
});

app.use(initialize());

authRouter({ app, authService });
userRouter({ app, userService });
postRouter({ app, postService });
commentRouter({ app, commentService });

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.info('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

// Call this before starting your server
syncDatabase().then(() => {
  app.listen(config.port, () => {
    console.warn(`Server running on port ${config.port}`);
  });
});
