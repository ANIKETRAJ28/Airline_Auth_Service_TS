import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { createEmailToken, createJWTtoken } from '../util/jwt.util';
import { IUserRole } from '../types/user.type';
import { emailOptions, options } from '../config/cookieOption.util';

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

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      const userEmail = await this.userService.registerUser(email);
      const token = createEmailToken(userEmail);
      res.cookie('EMAIL', token, emailOptions);
      res.status(201).json({ email: userEmail });
    } catch (error) {
      console.error('Error in UserController: registerUser:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const otp = req.body.otp;
      if (!otp) {
        res.status(400).json({ message: 'OTP is required' });
        return;
      }
      const email = req.email;
      if (!email) {
        res.status(400).json({ message: 'Unathenticated' });
        return;
      }
      const user = await this.userService.verifyOtp(email, otp);
      res.clearCookie('EMAIL', emailOptions);
      res.cookie('JWT', createJWTtoken({ ...user }), options);
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error('Error in UserController: verifyOtp:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      const role: IUserRole = req.body.role;
      if (!email || !role) {
        res.status(400).json({ message: 'Email and role is required' });
        return;
      }
      const newUser = await this.userService.createUser(email, role);
      const token = createJWTtoken({ email: newUser.email, id: newUser.id, user_role: newUser.user_role });
      res.cookie('JWT', token, options);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error in UserController: createUser:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async loginViaPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const user = await this.userService.loginViaPassword(email, password);
      const token = createJWTtoken({ email: user.email, id: user.id, user_role: user.user_role });
      res.cookie('JWT', token, options);
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error in UserController: loginViaPassword:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async sendLoginOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }
      await this.userService.sendLoginOTP(email);
      const token = createEmailToken(email);
      res.cookie('EMAIL', token, emailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error in UserController: sendLoginOTP:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async loginViaOTP(req: Request, res: Response): Promise<void> {
    try {
      const email = req.email;
      if (!email) {
        res.status(400).json({ message: 'Unauthenticated' });
        return;
      }
      const { otp } = req.body;
      if (!otp) {
        res.status(400).json({ message: 'OTP is required' });
        return;
      }
      if (!email || !otp) {
        res.status(400).json({ message: 'Email and otp are required' });
        return;
      }
      const user = await this.userService.loginViaOTP(email, otp);
      const token = createJWTtoken({ email: user.email, id: user.id, user_role: user.user_role });
      res.clearCookie('EMAIL', emailOptions);
      res.cookie('JWT', token, options);
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error in UserController: loginViaPassword:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('JWT', options);
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

  async updateUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const id = req.id;
      if (id === undefined) {
        res.status(400).json({ message: 'Unauthenticated' });
        return;
      }
      const password = req.body.password;
      if (!password) {
        res.status(400).json({ message: 'Password is required' });
        return;
      }
      await this.userService.updateUserPassword(id, password);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in UserController: updateUserPassword:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
