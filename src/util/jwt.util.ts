import jwt from 'jsonwebtoken';
import { IUserData } from '../interface/user.interface';

export function createJWTtoken(user: IUserData): string {
  const token = jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
  return token;
}

export function createEmailToken(email: string): string {
  const token = jwt.sign(email, process.env.JWT_SECRET as string);
  return token;
}
