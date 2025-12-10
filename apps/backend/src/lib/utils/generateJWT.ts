import jwt, { Secret, SignOptions } from 'jsonwebtoken';

function generateJWT(payload: string | Buffer | object, expiration?: number) {
  const secret = process.env.SECRET_KEY as Secret;

  if (!secret) {
    throw new Error('SECRET_KEY is not defined');
  }

  const options: SignOptions = {};

  if (expiration !== undefined) {
    options.expiresIn = expiration;
  }

  return jwt.sign(payload, secret, options);
}

export default generateJWT;
