import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { IUser } from '../interface/user.interface';

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
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error in UserController: createUser:', error);
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
