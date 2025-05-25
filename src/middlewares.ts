import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

export const removeBodyId = (req: Request, _: Response, next: NextFunction) => {
  if (req.body) {
    delete req.body.id;
  }
  next();
};

export const configureMiddlewares = (app: express.Application): void => {
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(removeBodyId);

  app.use(
    cors({
      origin: [
        'http://localhost:10000',
        'https://twitter-api-ohjg.onrender.com/',
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );
};
