// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';
import { IUserRole } from '../types/user.type';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      email?: string;
      user_role?: IUserRole;
    }
  }
}
