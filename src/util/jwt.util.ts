import jwt from 'jsonwebtoken';
import { IUser } from '../interface/user.interface';

export function createJWTtoken(user: Omit<IUser, 'password'>): string {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
  return token;
}
