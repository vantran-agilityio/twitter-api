export const appConfig = {
  database: 'twitter-db',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'twitter.sqlite',
    define: {
      underscored: true,
    },
  },
  jwtSecret: process.env.DATABASE_SECRET || 'Twitter-AP1',
  jwtSession: { session: false },
};

export const testConfig = {
  database: 'twitter_test',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'twitter.sqlite',
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Twitter-T3ST',
  jwtSession: { session: false },
};
