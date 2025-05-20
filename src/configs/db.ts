import { appConfig } from '@libs';
import { Options, Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  appConfig.database,
  appConfig.username,
  appConfig.password,
  appConfig.params as Options,
);
