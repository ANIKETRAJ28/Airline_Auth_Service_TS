import jwt from 'jsonwebtoken';

import { NextFunction, Request, Response } from 'express';
import { IUserData } from '../interface/user.interface';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export function jwtMiddleware(req: Request, res: Response): IUserData | void {
  try {
    const jwtCookie = req.cookies['JWT'];
    if (!jwtCookie) {
      throw new ApiError(401, 'Unauthorized');
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken || typeof decodedToken === 'string' || !decodedToken.exp) {
      throw new ApiError(401, 'Unauthorized');
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      throw new ApiError(401, 'Unauthorized');
    }
    const tokenData = decodedToken as IUserData;
    return tokenData;
  } catch (error) {
    res.clearCookie('JWT');
    errorHandler(error, res);
  }
}

export function verifyJWT(req: Request, res: Response): void {
  try {
    const jwtData = jwtMiddleware(req, res) as IUserData;
    apiHandler(res, 200, 'Authorized', jwtData);
    return;
  } catch (error) {
    errorHandler(error, res);
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  try {
    const jwtData = jwtMiddleware(req, res) as IUserData;
    req.user_id = jwtData.id;
    req.email = jwtData.email;
    req.user_role = jwtData.user_role;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}

export function authenticateEMAIL(req: Request, res: Response, next: NextFunction): void {
  try {
    const jwtCookie = req.cookies['EMAIL'];
    if (!jwtCookie) {
      throw new ApiError(401, 'Unauthorized');
    }
    const decodedToken = jwt.decode(jwtCookie);
    if (!decodedToken || typeof decodedToken !== 'string') {
      throw new ApiError(501, 'Unauthorized');
    }
    req.email = decodedToken;
    next();
  } catch (error) {
    res.clearCookie('EMAIL');
    errorHandler(error, res);
  }
}
