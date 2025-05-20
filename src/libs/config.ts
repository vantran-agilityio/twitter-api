export const appConfig = {
  database: 'twitter-db',
  username: '',
  password: '',
  params: {
    dialect: 'sqlite',
    storage: 'ntask.sqlite',
    define: {
      underscored: true,
    },
  },
  jwtSecret: 'Twitter-AP1', // secret key
  jwtSession: { session: false },
};
