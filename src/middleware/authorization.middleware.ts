import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../util/api.util';
import { errorHandler } from '../util/apiHandler.util';

export function authorizeAdminRole(req: Request, res: Response, next: NextFunction): void {
  try {
    const userRole = req.user_role;
    if (userRole === undefined || userRole === 'user') {
      throw new ApiError(401, 'Unauthorized');
    }
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}

export function authorizeSuperadminRole(req: Request, res: Response, next: NextFunction): void {
  try {
    const userRole = req.user_role;
    if (userRole === undefined || userRole !== 'superadmin') {
      throw new ApiError(401, 'Unauthorized');
    }
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}
