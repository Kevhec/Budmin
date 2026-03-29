import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  Budget, Transaction, User,
  UserPreferences,
} from '../database/models';
import generateJWT from '../lib/utils/generateJWT';
import convert from '../lib/utils/convert';
import sanitizeObject from '../lib/utils/sanitizeObject';
import setCookie from '../lib/utils/setCookie';
import SequelizeConnection from '../database/config/SequelizeConnection';
import type {
  CreateUserRequestBody, TypedRequest,
} from '../lib/types';
import setSessionCookie from '../lib/utils/setSessionCookie';
import initiateEmailVerification from '../lib/utils/initiateEmailVerification';

const { JsonWebTokenError, verify } = jwt;

const sequelize = SequelizeConnection.getInstance();

const signUp = async (
  req: TypedRequest<CreateUserRequestBody>,
  res: Response,
) => {
  const {
    email,
    username,
    birthday,
    password,
    timezone,
  } = req.body;
  // TODO: Delete accounts that are not verified on a week, provide a warning message;

  try {
    // Generate salt to properly hash the password
    const salt = await bcrypt.genSalt(10);

    const data = {
      email,
      username,
      timezone,
      birthday: new Date(birthday),
      password: await bcrypt.hash(password, salt),
    };

    const newUser = await User.create(data);

    if (!newUser) {
      return res.status(409).json('Datos incorrectos');
    }

    await initiateEmailVerification(newUser);

    const plainUserObj = newUser.toJSON();

    // Sanitize user object in order to avoid sending sensitive data to frontend
    sanitizeObject(plainUserObj, ['password', 'token']);

    // Send user
    return res.status(201).json({
      data: {
        message: `User registered successfully, verification email sent to: ${email}`,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const resendVerificationEmail = async (req: TypedRequest<{ email: string }>, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json(`No user found with email ${email}`);
    }

    if (user.confirmed) {
      return res.status(409).json('User already verified');
    }

    await initiateEmailVerification(user);

    return res.status(200).json('Verification email sent');
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = await new Promise<JwtPayload>((resolve, reject) => {
      verify(token, process.env.SECRET_KEY || '', {
        issuer: 'budmin',
        audience: 'account-verification',
      }, (err, dec) => {
        if (err || typeof dec === 'string') reject(err);
        else resolve(dec!);
      });
    });

    const { userId } = decoded;

    if (!userId) {
      return res.status(401).json('Invalid or expired token');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json('Invalid or expired token');
    }

    await user.update({
      token: null,
      confirmed: true,
    });

    // Set user session right after successful verification
    setSessionCookie(res, user.id, true);

    const sanitizedUser = sanitizeObject(user.toJSON(), ['password', 'token', 'updatedAt']);

    return res.status(200).json({ data: sanitizedUser });
  } catch (error: unknown) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json('Invalid or expired token');
    }
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    // Find user by their email
    const user = await User.findOne({
      where: {
        email,
      },
      include: [{
        model: UserPreferences,
        as: 'preferences',
      }],
    });

    // If user is found, compare provided password with bcrypt
    if (!user) {
      return res.status(401).json('Authentication failed');
    }

    const isSame = await bcrypt.compare(password, user.password);

    // If it's a match, generate a jwt and send it through a session cookie
    if (!isSame) {
      return res.status(401).json('Authentication failed');
    }

    setSessionCookie(res, user.id, remember);

    const plainUserObj = user.toJSON();

    // Sanitize user object to send it to client for profiling purposes
    const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token', 'updatedAt']);

    // send user data
    return res.status(201).json({ data: sanitizedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const logOut = async (req: Request, res: Response) => {
  const { user } = req;

  try {
    // If user is a guest delete it's account so db is not overloaded with guest accounts
    if (user?.role === 'guest') {
      const t = await sequelize.transaction();
      const userInstance = await User.findByPk(user.id, { transaction: t });

      // TODO: Handle guest cron task and job deletion
      try {
        await Budget.destroy({
          where: {
            userId: user.id,
          },
          transaction: t,
        });

        await Transaction.destroy({
          where: {
            userId: user.id,
          },
          transaction: t,
        });

        await userInstance?.destroy({
          transaction: t,
        });

        await t.commit();
        res.clearCookie('jwt', { httpOnly: true });
        return res.status(200).json({ data: { message: 'Logged out successfully' } });
      } catch (error) {
        await t.rollback();
        return res.status(500).json('Internal server error during guest deletion');
      }
    }

    // If it's a normal user just clear the session cookie
    res.clearCookie('jwt', { httpOnly: true });
    return res.status(200).json({ data: { message: 'Logged out successfully' } });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const loginAsGuest = async (req: Request, res: Response) => {
  // Create a new user with guest role and provided username
  try {
    const newGuest = await User.create({
      ...req.body,
      role: 'guest',
    });

    // generate jwt for guest user with one week expiration in order to avoid
    // unused guest users in database
    const token = generateJWT({ id: newGuest.id }, { expiresIn: convert(7, 'day', 'second') });

    // set the same maxAge for cookies but in ms
    setCookie(res, 'jwt', token, {
      maxAge: convert(7, 'day', 'ms'),
    });

    const plainUserObj = newGuest.toJSON();

    const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token', 'email']);

    // Send user
    return res.status(201).json({ data: sanitizedUser });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error('Error: ', e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const getInfo = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(404).json('User not found.');
    }

    // Remove sensitive or unnecessary data from user object to use for profiling purposes
    const sanitizedUser = sanitizeObject(user, ['password', 'token', 'updatedAt']);

    return res.status(200).json({ data: sanitizedUser });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

export {
  signUp,
  verifyToken,
  resendVerificationEmail,
  logIn,
  logOut,
  loginAsGuest,
  getInfo,
};
