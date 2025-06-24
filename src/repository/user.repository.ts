import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getPool } from '../util/dbPool.util';
import { IUser, IUserData } from '../interface/user.interface';
import { SALT, NODE_ENV } from '../config/env.config';
import { IUserRole } from '../types/user.type';
import { ApiError } from '../util/api.util';

export class UserRepository {
  private pool: Pool = getPool();
  constructor() {}

  async getUserById(id: string): Promise<IUserData> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE id = $1`;
      const result = await client.query(query, [id]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
      };
    } finally {
      client.release();
    }
  }

  getUserByEmail = async (email: string): Promise<IUserData> => {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await client.query(query, [email]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
      };
    } finally {
      client.release();
    }
  };

  async registerUser(email: string): Promise<string> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT * FROM user_auth WHERE email = $1`;
      let result = await client.query(query, [email]);
      const otp =
        NODE_ENV === 'development'
          ? '123456' // Use a fixed OTP for development
          : crypto.randomInt(100000, 999999).toString();
      if (result.rows.length > 0) {
        const user = result.rows[0];
        if (user.is_verified) {
          throw new ApiError(400, 'User already registered');
        }
        query = `UPDATE user_auth SET otp = $1 WHERE email = $2 RETURNING email`;
        result = await client.query(query, [otp, email]);
        const updatedUser = result.rows[0];
        return updatedUser.email;
      }
      // ! implement mailer to send OTP
      query = `INSERT INTO user_auth (email, otp) VALUES ($1, $2) RETURNING email`;
      result = await client.query(query, [email, otp]);
      const newUser = result.rows[0];
      return newUser.email;
    } finally {
      client.release();
    }
  }

  async verifyOtp(email: string, otp: string): Promise<IUserData> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT * FROM user_auth WHERE email = $1`;
      const result = await client.query(query, [email]);
      if (result.rows.length === 0) {
        throw new ApiError(404, 'User not found');
      }
      if (result.rows[0].is_verified) {
        throw new ApiError(400, 'User already exists');
      }
      const OTP = result.rows[0].otp;
      if (OTP !== otp) {
        throw new Error('Invalid OTP');
      }
      query = `
      UPDATE 
        user_auth 
      SET 
        is_verified = true
      WHERE
        email = $1;
      `;
      await client.query(query, [email]);
      const user = await this.createUser(email, 'user');
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
      };
    } finally {
      client.release();
    }
  }

  async createUser(email: string, role: IUserRole): Promise<IUserData> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT id FROM users WHERE email = $1`;
      let result = await client.query(query, [email]);
      if (result.rows.length > 0) {
        throw new ApiError(400, 'User already exists');
      }
      query = `INSERT INTO users (email, user_role) VALUES ($1, $2) RETURNING *`;
      result = await client.query(query, [email, role]);
      const newUser: IUser = result.rows[0];
      return {
        id: newUser.id,
        email: newUser.email,
        user_role: newUser.user_role,
      };
    } finally {
      client.release();
    }
  }

  async loginUserViaPassword(email: string, password: string): Promise<IUserData> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await client.query(query, [email]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      if (!user.password) {
        throw new ApiError(400, 'Password not set for this user');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Email id or password is incorrect');
      }
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
      };
    } finally {
      client.release();
    }
  }

  async sendLoginOTP(email: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await client.query(query, [email]);
      if (result.rows.length === 0) {
        throw new ApiError(404, 'User not found');
      }
      const otp =
        NODE_ENV === 'development'
          ? '123456' // Use a fixed OTP for development
          : crypto.randomInt(100000, 999999).toString();
      // ! implement mailer to send OTP
      const updateQuery = `UPDATE users SET otp = $1 WHERE email = $2`;
      await client.query(updateQuery, [otp, email]);
    } finally {
      client.release();
    }
  }

  async loginUserViaOTP(email: string, otp: string): Promise<IUserData> {
    const client: PoolClient = await this.pool.connect();
    try {
      let query = `SELECT * FROM users WHERE email = $1`;
      const result = await client.query(query, [email]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      if (!user.otp || user.otp !== otp) {
        throw new ApiError(401, 'Invalid OTP');
      }
      query = `UPDATE users SET otp = NULL WHERE id = $1`;
      await client.query(query, [user.id]);
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
      };
    } finally {
      client.release();
    }
  }

  async isUserAdmin(id: string): Promise<boolean> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT user_role FROM users WHERE id = $1`;
      const result = await client.query(query, [id]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new ApiError(404, 'User not found');
      }
      return user.user_role === 'admin';
    } catch (error) {
      console.log('Error in UserRepository: isUserAdmin:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateUserPassword(id: string, password: string): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      const salt = await bcrypt.genSalt(+SALT);
      const hashedPassword = await bcrypt.hash(password, salt);
      const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *`;
      await client.query(query, [hashedPassword, id]);
      return;
    } catch (error) {
      console.log('Error in UserRepository: updateUserPassword:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
