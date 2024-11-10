require('dotenv').config();

if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD || !process.env.DB_PORT) {
  console.error("Missing one or more required environment variables.");
  process.exit(1);
}

module.exports = {
  migrationsTable: 'pgmigrations',
  direction: 'up',
  log: console.log,
  pgConfig: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT, 10),
  },
};
