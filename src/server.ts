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

// Initialize database before setting up routes
async function initializeApp() {
  try {
    // Ensure database is synced first
    await sequelize.sync({ force: false });
    console.info('Database synchronized successfully');

    // Register routes after database is ready
    authRouter({ app, authService });
    userRouter({ app, userService });
    postRouter({ app, postService });
    commentRouter({ app, commentService });

    // Start the server
    app.listen(config.port, () => {
      console.warn(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

// Start the application
initializeApp();
