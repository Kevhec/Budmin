import { type CookieOptions, type Response } from 'express';

const setCookie = (res: Response, name: string, val: string, options: CookieOptions = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: isProduction ? 'none' : 'lax',
  };

  // Merge default options with provided options
  const cookieOptions = { ...defaultOptions, ...options };

  res.cookie(name, val, cookieOptions);
};

export default setCookie;
