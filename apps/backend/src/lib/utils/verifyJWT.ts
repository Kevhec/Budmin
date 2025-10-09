import jwt, { JwtPayload } from 'jsonwebtoken';

type VerificationError = 'expired' | 'invalid';
interface TokenData {
  error?: VerificationError
  data: JwtPayload,
  meta: {
    iat?: number
    exp?: number
  }
}

function verifyJWT(token: string) {
  const returnObject: TokenData = {
    error: undefined,
    data: {},
    meta: {},
  };

  const decodedToken = jwt.decode(token) as { iat?: number };

  if (decodedToken && decodedToken.iat) {
    returnObject.meta.iat = decodedToken.iat;
  }

  jwt.verify(token, process.env.SECRET_KEY || '', (err, decoded) => {
    if (!err) {
      if (decoded && typeof decoded !== 'string') {
        returnObject.data = decoded;
      }
      return;
    }

    if (err.name === 'TokenExpiredError') {
      returnObject.error = 'expired';
    } else if (err.name === 'JsonWebTokenError') {
      returnObject.error = 'invalid';
    }
  });

  return returnObject;
}

export default verifyJWT;
