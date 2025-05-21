import express from 'express';

import { config, sequelize } from './configs';
import { userService, authService } from '@services';
import { authRouter, userRouter } from '@routes';
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

userRouter({ app, userService });
authRouter({ app, authService });

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
