// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.host || '192.168.0.33',
      user: process.env.user || 'apsisdev',
      password: process.env.password || 'Apsisdev@123',
      database: process.env.database || 'fin_erp',
    },
    migrations: {
      directory: __dirname + '/src/migrations',
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
