import express from 'express';
import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import passport, { InitializeOptions } from 'passport';

import { User } from '@models';
import { appConfig } from '@libs';

type Handler = express.Handler;

interface JwtPayload {
  id: string;
  email?: string;
}

interface AuthModule {
  initialize: (options?: InitializeOptions) => Handler;
  authenticate: () => Handler;
}

const auth = (): AuthModule => {
  const params: StrategyOptions = {
    secretOrKey: appConfig.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(
    params,
    (payload: JwtPayload, done: VerifiedCallback) => {
      User.findByPk(payload.id)
        .then((user) => {
          if (user) {
            return done(null, {
              id: user.id,
            });
          }
          return done(null, false);
        })
        .catch((error) => done(error, null));
    },
  );

  passport.use(strategy);

  return {
    initialize: (options?: InitializeOptions) => passport.initialize(options),
    authenticate: () => passport.authenticate('jwt', appConfig.jwtSession),
  };
};

const authModule = auth();

export const initialize = authModule.initialize;
export const authenticate = authModule.authenticate;
