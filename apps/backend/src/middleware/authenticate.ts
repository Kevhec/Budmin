import { type RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserPreferences } from '../database/models';

interface JWTPayload {
  id: string
}

const authenticate: RequestHandler = async (req, res, next) => {
  const sessionCookie = req.cookies.jwt;

  if (!sessionCookie) {
    return res.status(401).json('No token provided');
  }

  try {
    const decodedJWT = jwt.verify(sessionCookie, process.env.SECRET_KEY || '') as JWTPayload;
    const user = await User.findByPk(decodedJWT.id, {
      attributes: {
        exclude: ['password'],
      },
      include: [
        {
          model: UserPreferences,
          as: 'preferences',
        },
      ],
    });

    if (!user) {
      return res.status(401).json('User not found');
    }

    const userData = user.toJSON();

    req.user = userData;

    return next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(401).json('Invalid token');
  }
};

export default authenticate;
