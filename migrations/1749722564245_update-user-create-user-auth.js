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
  // update user table set password as nullable
  pgm.sql(`
    ALTER TABLE users 
    ALTER COLUMN password 
    DROP NOT NULL;
  `);
  // update user table add column otp
  pgm.sql(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS 
    otp CHAR(6) DEFAULT NULL;
  `);
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS
    user_auth (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(225) NOT NULL UNIQUE,
      otp CHAR(6) DEFAULT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // drop user_auth table
  pgm.sql(`
    DROP TABLE IF EXISTS user_auth;
  `);
  // drop otp column from users table
  pgm.sql(`
    ALTER TABLE users 
    DROP COLUMN IF EXISTS otp;
  `);
  // update user table set password as not nullable
  pgm.sql(`
    ALTER TABLE users 
    ALTER COLUMN password 
    SET NOT NULL;
  `);
};
