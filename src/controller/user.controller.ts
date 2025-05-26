import { CookieOptions, Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { IUser } from '../interface/user.interface';
import { createJWTtoken } from '../util/jwt.util';
import { NODE_ENV } from '../config/env.config';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      const user = await this.userService.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error in UserController: getUserById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      const user = await this.userService.getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error in UserController: getUserByEmail:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: Omit<IUser, 'id' | 'created_at' | 'updated_at'> = req.body;
      if (!userData.email || !userData.password || !userData.user_role) {
        res.status(400).json({ message: 'Email, password, and user role are required' });
        return;
      }
      const newUser = await this.userService.createUser(userData);
      const token = createJWTtoken(newUser);
      const domain = NODE_ENV === 'production' ? '*' : 'localhost'; // Adjust domain based on environment
      const httpOnly = NODE_ENV === 'production'; // Set httpOnly based on environment
      const secure = NODE_ENV === 'production'; // Set secure based on environment
      const sameSite = NODE_ENV === 'production' ? 'None' : 'lax'; // Adjust sameSite based on environment
      const options = {
        domain,
        maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
        httpOnly,
        secure,
        sameSite,
        path: '/',
      } as CookieOptions;
      res.cookie('JWT', token, options);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error in UserController: createUser:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const user = await this.userService.loginUser(email, password);
      const token = createJWTtoken(user);
      const domain = NODE_ENV === 'production' ? '*' : 'localhost'; // Adjust domain based on environment
      const httpOnly = NODE_ENV === 'production'; // Set httpOnly based on environment
      const secure = NODE_ENV === 'production'; // Set secure based on environment
      const sameSite = NODE_ENV === 'production' ? 'None' : 'lax'; // Adjust sameSite based on environment
      const options = {
        domain,
        maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
        httpOnly,
        secure,
        sameSite,
        path: '/',
      } as CookieOptions;
      res.cookie('JWT', token, options);
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error in UserController: loginUser:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('JWT');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error in UserController: logout:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async isUserAdmin(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      const isAdmin = await this.userService.isUserAdmin(userId);
      res.status(200).json({ isAdmin });
    } catch (error) {
      console.error('Error in UserController: isUserAdmin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
