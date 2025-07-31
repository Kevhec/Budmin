import jwt from 'jsonwebtoken';

function generateJWT(payload: string | Buffer | object, expiration?: string | number) {
  return jwt.sign(payload, process.env.SECRET_KEY || '', {
    expiresIn: expiration,
  });
}

export default generateJWT;
