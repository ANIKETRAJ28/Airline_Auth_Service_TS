import { CookieOptions } from 'express';
import { NODE_ENV } from './env.config';

const domain = NODE_ENV === 'production' ? '*' : 'localhost'; // Adjust domain based on environment
const httpOnly = NODE_ENV === 'production'; // Set httpOnly based on environment
const secure = NODE_ENV === 'production'; // Set secure based on environment
const sameSite = NODE_ENV === 'production' ? 'None' : 'lax'; // Adjust sameSite based on environment

export const options = {
  domain,
  maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
  httpOnly,
  secure,
  sameSite,
  path: '/',
} as CookieOptions;

export const emailOptions = {
  domain,
  httpOnly,
  secure,
  sameSite,
  path: '/',
} as CookieOptions;
