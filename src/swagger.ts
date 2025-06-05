import express from 'express';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

const swaggerDocs = (app: express.Application) => {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};

export default swaggerDocs;
