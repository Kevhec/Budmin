import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { diffMinutes } from '@formkit/tempo';
import {
  Budget, Transaction, User,
  UserPreferences,
} from '../database/models';
import generateJWT from '../lib/utils/generateJWT';
import convert from '../lib/utils/convert';
import { REMEMBER_ME_EXPIRATION_TIME_DAYS, SESSION_EXPIRATION_TIME_DAYS } from '../lib/constants';
import verificationEmail from '../lib/utils/verificationEmail';
import sanitizeObject from '../lib/utils/sanitizeObject';
import setCookie from '../lib/utils/setCookie';
import SequelizeConnection from '../database/config/SequelizeConnection';
import type {
  CreateUserRequestBody, ResponseObject, TokenVerificationCodes, TypedRequest,
} from '../lib/types';
import maskEmail from '../lib/utils/maskEmail';
import { verifyJWT } from '../lib/utils';
import logger from '../lib/utils/logger';

const sequelize = SequelizeConnection.getInstance();
const isProduction = process.env.NODE_ENV === 'production';
const NUMERIC_TOKEN_EXPIRATION_TIME = 20;
const TEXT_BASED_TOKEN_EXPIRATION_TIME = `${NUMERIC_TOKEN_EXPIRATION_TIME}s`;

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

    // Apply a hashing process to the password
    const data = {
      email,
      username,
      timezone,
      birthday: new Date(birthday),
      password: await bcrypt.hash(password, salt),
    };

    // Create a new user,
    const newUser = await User.create(data);
    const newPreferences = await UserPreferences.create();

    // If user is successfully created, generate a jwt using env secret key
    // and send it through a cookie to the client
    if (!newUser) {
      return res.status(409).json('Datos incorrectos');
    }

    const confirmationToke = generateJWT(
      { userId: newUser.get('id') },
      { expiresIn: TEXT_BASED_TOKEN_EXPIRATION_TIME, issuer: 'budmin', audience: 'email-verification' },
    );

    await newUser.update({ token: confirmationToke });

    // Testing email delivered@resend.dev
    await verificationEmail(isProduction ? newUser.email : 'delivered@resend.dev', confirmationToke || '');

    const plainUserObj = newUser.toJSON();
    const plainPreferences = sanitizeObject(newPreferences.toJSON(), ['userId']);
    plainUserObj.preferences = plainPreferences;

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
      logger.error(e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const { error, data, meta } = verifyJWT(token);
    const { userId } = data || {};
    logger.info({
      userId, error, meta, data,
    });
    const responseObject: ResponseObject<TokenVerificationCodes> & {
      maskedEmail?: string, token?: string
    } = {
      status: 'success', code: 'success', message: 'User verified successfully.',
    };

    const isTokenInvalid = !meta || error === 'invalid';

    const user = await (userId
      ? User.findByPk(userId)
      : User.findOne({ where: { token } })
    );

    if (isTokenInvalid || !user) {
      responseObject.status = 'error';
      responseObject.code = 'invalid_token';
      responseObject.message = 'Invalid token';

      return res.status(401).json(responseObject);
    }

    if (error === 'expired') {
      responseObject.status = 'error';
      responseObject.code = 'expired_token';
      responseObject.message = 'Expired token';
      responseObject.maskedEmail = maskEmail(user.get('email'));
      responseObject.token = generateJWT(
        { userId: user.get('id') },
        { audience: 'email-verification', issuer: 'budmin', expiresIn: TEXT_BASED_TOKEN_EXPIRATION_TIME },
      );
      return res.status(410).json(responseObject);
    }

    await user.update({
      token: null,
      confirmed: true,
    });

    // TODO: Standardize responses with upper "responseObject" format
    return res.status(200).json(responseObject);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const resendVerificationEmail = async (
  req: TypedRequest<{ token: string }>,
  res: Response,
) => {
  const { token } = req.params;

  try {
    const { error, data, meta } = verifyJWT(token);
    const responseObject: ResponseObject<TokenVerificationCodes> & {
      maskedEmail?: string, token?: string, timeToRetry?: number
    } = {
      status: 'success', code: 'success', message: 'User verified successfully.',
    };

    const { userId } = data || {};

    const isTokenInvalid = !meta || error === 'invalid';

    /*     if (isTokenValid && meta.iat) {
      const issueDate = new Date(meta.iat * 1000);
      const today = new Date();

      const minutesDiff = diffMinutes(today, issueDate, 'floor');
      logger.info(minutesDiff);

      if (minutesDiff < NUMERIC_TOKEN_EXPIRATION_TIME) {
        const timeUntilRetry = minutesDiff - NUMERIC_TOKEN_EXPIRATION_TIME;

        responseObject.status = 'error';
        responseObject.code = 'rate_limited';
        responseObject.message = `Cannot request another email yet, try again in ${timeUntilRetry} minutes`;
        responseObject.timeToRetry = timeUntilRetry;

        return res.status(401).json(responseObject);
      }
    } */

    const user = await (userId
      ? User.findByPk(userId)
      : User.findOne({ where: { token } })
    );

    if (isTokenInvalid || !user) {
      responseObject.status = 'error';
      responseObject.code = 'invalid_token';
      responseObject.message = 'Invalid token';

      return res.status(401).json(responseObject);
    }

    if (error === 'expired') {
      responseObject.status = 'error';
      responseObject.code = 'expired_token';
      responseObject.message = 'Expired token';
      responseObject.maskedEmail = maskEmail(user.get('email'));
      responseObject.token = generateJWT(
        { userId: user.get('id') },
        { audience: 'email-verification', issuer: 'budmin', expiresIn: TEXT_BASED_TOKEN_EXPIRATION_TIME },
      );

      await user.update({ token: responseObject.token });
      await verificationEmail(isProduction ? user.get('email') : 'delivered@resend.dev', responseObject.token || '');
      return res.status(401).json(responseObject);
    }

    return res.status(200).json(responseObject);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body;

    // Set different token expiration time if user wants to be remembered
    const expirationTime = remember
      ? REMEMBER_ME_EXPIRATION_TIME_DAYS
      : SESSION_EXPIRATION_TIME_DAYS;

    // Find user by their email
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // If user is found, compare provided password with bcrypt
    if (!user) {
      return res.status(401).json('Authentication failed');
    }

    const isSame = await bcrypt.compare(password, user.password);

    // If it's a match, generate a jwt and send it through a session cookie
    if (isSame) {
      const token = generateJWT({ id: user?.id }, { expiresIn: convert(expirationTime, 'day', 'second') });

      setCookie(res, 'jwt', token, {
        maxAge:
          process.env.NODE_ENV === 'development'
            ? 99999999999999
            : convert(expirationTime, 'day', 'ms'),
      });

      const plainUserObj = user.toJSON();

      // Sanitize user object to send it to client for profiling purposes
      const sanitizedUser = sanitizeObject(plainUserObj, ['password', 'token', 'updatedAt']);

      // send user data
      return res.status(201).json({ data: sanitizedUser });
    }
    return res.status(401).json('Authentication failed');
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
