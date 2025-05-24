import express from 'express';

import { postService, commentService } from '@services';
import { commentRouter, authRouter, postRouter, userRouter } from '@routes';

import { initialize } from './auth';
import { config, sequelize } from './configs';
import swaggerDocs from './swagger';
import { initializeDependencies } from './container';

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  if (req.body) {
    delete req.body.id;
  }
  next();
});

app.use(initialize());

async function initializeApp() {
  try {
    await sequelize.sync({ force: false });
    console.info('Database synchronized successfully');

    const { userController, authController } = initializeDependencies();

    authRouter({ app, authController });
    userRouter({ app, userController });
    postRouter({ app, postService });
    commentRouter({ app, commentService });

    app.listen(config.port, () => {
      console.warn(`Server running on port ${config.port}`);
    });

    swaggerDocs(app);
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
}

initializeApp();
