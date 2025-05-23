import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

export function jwtMiddleware(req: Request, res: Response): void {
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
    res.status(200).json({ message: 'authorized', decodedToken });
  } catch (error) {
    console.error('Error in jwtMiddleware:', error);
    res.status(501).json({ message: 'unauthorized' });
  }
}
