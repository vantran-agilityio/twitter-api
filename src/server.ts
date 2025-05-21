import express from 'express';
import { config, sequelize } from './configs';
import { userService } from '@services';
import { userRouter } from '@routes';

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  if (req.body) {
    delete req.body.id;
  }
  next();
});

userRouter({ app, userService });

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
