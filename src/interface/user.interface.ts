import { IUserRole } from '../types/user.type';

export interface IUserData {
  id: string;
  email: string;
  user_role: IUserRole;
}

export interface IUserResponse extends IUserData {
  created_at: Date;
  updated_at: Date;
}

export interface IUser extends IUserResponse {
  password: string | null;
  otp: string | null;
}
