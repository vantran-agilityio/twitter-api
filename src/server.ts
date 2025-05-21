import express from 'express';

import { config } from './configs';

const app = express();

app.use(express.json());

app.listen(config.port, () => {
  console.log('⚡️ Server is running on port', config.port);
});
