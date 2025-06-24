import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { createEmailToken, createJWTtoken } from '../util/jwt.util';
import { IUserRole } from '../types/user.type';
import { emailOptions, options } from '../config/cookieOption.util';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new ApiError(400, 'User ID is required');
      }
      const user = await this.userService.getUserById(userId);
      apiHandler(res, 200, 'User fetched successfully', user);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = req.params.email;
      if (!email) {
        throw new ApiError(400, 'Email id is required');
      }
      const user = await this.userService.getUserByEmail(email);
      apiHandler(res, 200, 'User fetched successfully', user);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(400, 'Email id is required');
      }
      const userEmail = await this.userService.registerUser(email);
      const token = createEmailToken(userEmail);
      res.cookie('EMAIL', token, emailOptions);
      apiHandler(res, 201, 'User registered successfully', { email: userEmail });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const otp = req.body.otp;
      if (!otp) {
        throw new ApiError(400, 'OTP is required');
      }
      const email = req.email;
      if (!email) {
        throw new ApiError(401, 'Unauthenticated');
      }
      const user = await this.userService.verifyOtp(email, otp);
      res.clearCookie('EMAIL', emailOptions);
      res.cookie('JWT', createJWTtoken({ ...user }), options);
      apiHandler(res, 200, 'OTP verified successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body.email;
      const role: IUserRole = req.body.role;
      if (!email || !role) {
        throw new ApiError(400, 'Email and role is required');
      }
      const newUser = await this.userService.createUser(email, role);
      const token = createJWTtoken({ email: newUser.email, id: newUser.id, user_role: newUser.user_role });
      res.cookie('JWT', token, options);
      apiHandler(res, 201, 'User created successfully', newUser);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async loginViaPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }
      const user = await this.userService.loginViaPassword(email, password);
      const token = createJWTtoken({ email: user.email, id: user.id, user_role: user.user_role });
      res.cookie('JWT', token, options);
      apiHandler(res, 200, 'Login successful');
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async sendLoginOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        throw new ApiError(400, 'Email id is required');
      }
      await this.userService.sendLoginOTP(email);
      const token = createEmailToken(email);
      res.cookie('EMAIL', token, emailOptions);
      apiHandler(res, 200, 'OTP sent successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async loginViaOTP(req: Request, res: Response): Promise<void> {
    try {
      const email = req.email;
      if (!email) {
        throw new ApiError(401, 'Unauthenticated');
      }
      const { otp } = req.body;
      if (!otp) {
        throw new ApiError(400, 'OTP is required');
      }
      const user = await this.userService.loginViaOTP(email, otp);
      const token = createJWTtoken({ email: user.email, id: user.id, user_role: user.user_role });
      res.clearCookie('EMAIL', emailOptions);
      res.cookie('JWT', token, options);
      apiHandler(res, 200, 'Login successful');
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('JWT', options);
      apiHandler(res, 200, 'Logout successful');
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async isUserAdmin(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new ApiError(400, 'User id is required');
      }
      const isAdmin = await this.userService.isUserAdmin(userId);
      apiHandler(res, 200, 'User admin status fetched successfully', { isAdmin });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const id = req.user_id;
      if (id === undefined) {
        throw new ApiError(401, 'Unauthenticated');
      }
      const password = req.body.password;
      if (!password) {
        throw new ApiError(400, 'Password is required');
      }
      await this.userService.updateUserPassword(id, password);
      apiHandler(res, 200, 'Password updated successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
