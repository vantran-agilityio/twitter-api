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
  jwtSecret: process.env.DATABASE_SECRET || 'Twitter-AP1', // secret key
  jwtSession: { session: false },
};
