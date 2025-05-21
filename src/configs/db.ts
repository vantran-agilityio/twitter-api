import { Options, Sequelize } from 'sequelize';

import { appConfig } from '@libs';

export const sequelize = new Sequelize(
  appConfig.database,
  appConfig.username,
  appConfig.password,
  appConfig.params as Options,
);
