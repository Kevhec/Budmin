import { Response } from 'express';
import { REMEMBER_ME_EXPIRATION_TIME_DAYS, SESSION_EXPIRATION_TIME_DAYS } from '../constants';
import convert from './convert';
import generateJWT from './generateJWT';
import setCookie from './setCookie';

function setSessionCookie(res: Response, userId: string, rememberMe?: boolean) {
  // Set different token expiration time if user wants to be remembered
  const expirationTime = rememberMe
    ? REMEMBER_ME_EXPIRATION_TIME_DAYS
    : SESSION_EXPIRATION_TIME_DAYS;

  const token = generateJWT({ id: userId }, { expiresIn: convert(expirationTime, 'day', 'second') });

  setCookie(res, 'jwt', token, {
    maxAge:
        process.env.NODE_ENV === 'development'
          ? 99999999999999
          : convert(expirationTime, 'day', 'ms'),
  });
}

export default setSessionCookie;
