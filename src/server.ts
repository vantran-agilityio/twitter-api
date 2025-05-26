import 'module-alias/register';

import express from 'express';

import { commentRouter, authRouter, postRouter, userRouter } from '@routes';

import { initialize } from './auth';
import { config, sequelize } from './configs';
import swaggerDocs from './swagger';
import { initializeDependencies } from './container';
import { configureMiddlewares } from './middlewares';

export const app = express();

configureMiddlewares(app);

app.use(initialize());

async function initializeApp() {
  try {
    await sequelize.sync({ force: false });
    console.info('✅ Database synchronized successfully');

    const {
      userController,
      authController,
      postController,
      commentController,
    } = initializeDependencies();

    authRouter({ app, authController });
    userRouter({ app, userController });
    postRouter({ app, postController });
    commentRouter({ app, commentController });

    if (process.env.NODE_ENV !== 'test') {
      app.listen(config.port, () => {
        console.warn(`⚡️ Server running on port ${config.port}`);
      });
    }
    swaggerDocs(app);
  } catch (error) {
    console.error('❌ Error initializing application:', error);
    process.exit(1);
  }
}

initializeApp();
