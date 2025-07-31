/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';
import { Model, InferAttributes } from 'sequelize';
import User from '../src/database/models/user';

export interface Element extends Model {
  userId?: string
}

declare global {
  namespace Express {
    interface Request {
      user?: InferAttributes<User>;
      element?: Element;
      relatedElement?: any;
    }
  }
}
