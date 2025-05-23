import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitter API',
      description:
        'API endpoints for a social media services documented on swagger',
      contact: {
        name: 'Van Tran',
        email: 'van.tran@asnet.com.vn',
        url: 'https://github.com/vantran-agilityio/twitter-api',
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:10000',
        description: 'Local server',
      },
      {
        url: 'https://twitter-api-ohjg.onrender.com',
        description: 'Live server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },

  apis: [path.join(__dirname, 'routes/**/*.ts')],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: express.Application) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerDocs;
