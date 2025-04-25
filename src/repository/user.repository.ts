import { Pool, PoolClient } from 'pg';
import bcrypt from 'bcrypt';
import { getPool } from '../util/dbPool.util';
import { IUser } from '../interface/user.interface';
import { SALT } from '../config/env.config';

export class UserRepository {
  private pool: Pool = getPool();
  constructor() {}

  async getUserById(id: string): Promise<Omit<IUser, 'password'>> {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE id = $1`;
      const result = await client.query(query, [id]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    } catch (error) {
      console.log('Error in UserRepository: getUserById:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  getUserByEmail = async (email: string): Promise<Omit<IUser, 'password'>> => {
    const client: PoolClient = await this.pool.connect();
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await client.query(query, [email]);
      const user: IUser = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }
      return {
        id: user.id,
        email: user.email,
        user_role: user.user_role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    } catch (error) {
      console.log('Error in UserRepository: getUserByEmail:', error);
      throw error;
    } finally {
      client.release();
    }
  };

  async createUser(user: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<Omit<IUser, 'password'>> {
    const client: PoolClient = await this.pool.connect();
    try {
      const salt = await bcrypt.genSalt(+SALT);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      const query = `INSERT INTO users (email, password, user_role) VALUES ($1, $2, $3) RETURNING *`;
      const result = await client.query(query, [user.email, user.password, user.user_role]);
      const newUser: IUser = result.rows[0];
      return {
        id: newUser.id,
        email: newUser.email,
        user_role: newUser.user_role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
      };
    } catch (error) {
      console.log('Error in UserRepository: createUser:', error);
      throw error;
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
        throw new Error('User not found');
      }
      return user.user_role === 'admin';
    } catch (error) {
      console.log('Error in UserRepository: isUserAdmin:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
