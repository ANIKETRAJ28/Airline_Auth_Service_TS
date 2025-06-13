import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { IUserData } from '../interface/user.interface';

export function jwtMiddleware(req: Request, res: Response): IUserData | void {
  try {
    const jwtCookie = req.cookies['JWT'];
    if (!jwtCookie) {
      res.status(501).json({ message: 'unauthorized' });
      return;
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
      res.clearCookie('JWT');
      res.status(501).json({ message: 'unauthorized' });
      return;
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      res.clearCookie('JWT');
      res.status(501).json({ message: 'unauthorized' });
    }
    const tokenData = decodedToken as IUserData;
    return tokenData;
  } catch (error) {
    console.error('Error in jwtMiddleware:', error);
    res.status(501).json({ message: 'unauthorized' });
  }
}

export function verifyJWT(req: Request, res: Response): void {
  try {
    const jwtData = jwtMiddleware(req, res) as IUserData;
    res.status(200).json({ message: 'authorized', jwtData });
    return;
  } catch (error) {
    console.error('Error in verifyJWT:', error);
    res.status(501).json({ message: 'unauthorized' });
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    const jwtData = jwtMiddleware(req, res) as IUserData;
    req.id = jwtData.id;
    req.email = jwtData.email;
    req.user_role = jwtData.user_role;
    next();
  } catch (error) {
    console.error('Error in authenticateJWT:', error);
    res.status(501).json({ message: 'unauthorized' });
  }
}

export function authenticateEMAIL(req: Request, res: Response, next: NextFunction): void {
  try {
    const jwtCookie = req.cookies['EMAIL'];
    if (!jwtCookie) {
      res.status(501).json({ message: 'unauthorized' });
      return;
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken || typeof decodedToken !== 'string') {
      res.clearCookie('EMAIL');
      res.status(501).json({ message: 'unauthorized' });
      return;
    }
    req.email = decodedToken;
    next();
  } catch (error) {
    console.error('Error in authenticateEMAIL:', error);
    res.status(501).json({ message: 'unauthorized' });
  }
}
