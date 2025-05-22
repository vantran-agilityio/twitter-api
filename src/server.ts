import express from 'express';

import { config, sequelize } from './configs';
import { userService, authService, postService } from '@services';
import { authRouter, postRouter, userRouter } from '@routes';
import { initialize } from 'auth';

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

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(config.port, () => {
      console.log(`⚡️ Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
