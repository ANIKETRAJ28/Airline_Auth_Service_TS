import { NextFunction, Request, Response } from 'express';

export function authorizeAdminRole(req: Request, res: Response, next: NextFunction): void {
  try {
    const userRole = req.user_role;
    if (userRole === undefined || userRole === 'user') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }
    next();
  } catch (error) {
    console.error('Error in checkAdminRole middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export function authorizeSuperadminRole(req: Request, res: Response, next: NextFunction): void {
  try {
    const userRole = req.user_role;
    if (userRole === undefined || userRole !== 'superadmin') {
      res.status(403).json({ message: 'Forbidden: Superadmin access required' });
      return;
    }
    next();
  } catch (error) {
    console.error('Error in checkSuperadminRole middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
