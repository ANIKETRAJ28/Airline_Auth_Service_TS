import { IUserRole } from '../types/user.type';

export interface IUser {
  id: string;
  email: string;
  password: string;
  user_role: IUserRole;
  created_at: Date;
  updated_at: Date;
}
