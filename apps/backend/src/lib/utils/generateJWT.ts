import jwt, { Secret, SignOptions } from 'jsonwebtoken';

function generateJWT(
  payload: string | Buffer | object,
  options?: SignOptions,
) {
  const secret = process.env.SECRET_KEY as Secret;

  if (!secret) {
    throw new Error('SECRET_KEY is not defined');
  }

  return jwt.sign(payload, secret, options);
}

export default generateJWT;
