const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER,
    port: process.env.DB_PORT || 5433,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER,
    port: process.env.DB_PORT || 5433,
    schema: process.env.DB_SCHEMA || 'budmin',
    ssl: true,
    dialectOptions: {
      ssl: {
        ca: process.env.DB_CA_CERT || fs.readFileSync('ca.pem').toString(),
        rejectUnauthorized: true,
      },
    },
  },
};
