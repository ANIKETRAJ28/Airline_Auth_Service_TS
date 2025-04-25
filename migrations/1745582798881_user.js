/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // create role enum
  pgm.sql(`
    CREATE TYPE role AS ENUM ('admin', 'user');
  `);
  // Create users table
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(225) NOT NULL UNIQUE,
      password VARCHAR(225) NOT NULL,
      user_role role NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );`);
  // create index on email
  pgm.sql(`
    CREATE INDEX IF NOT EXISTS users_email_index ON users (email);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop index on email
  pgm.sql(`
    DROP INDEX IF EXISTS users_email_index;
  `);
  // drop users table
  pgm.sql(`
    DROP TABLE IF EXISTS users;
  `);
  // drop role enum
  pgm.sql(`
    DROP TYPE role;
  `);
};
