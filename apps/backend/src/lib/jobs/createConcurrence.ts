import { Transaction } from 'sequelize';
import Concurrence from '@/src/database/models/concurrence';
import {
  TargetType,
  Target,
  type Concurrence as ConcurrenceType,
  UserAttributes,
} from '../types';
import parseConcurrenceObj from './parseConcurrenceObj';
import logger from '../utils/logger';

interface CreationParams {
  concurrence: ConcurrenceType,
  user: UserAttributes
  target: Target<TargetType>
}

async function createConcurrence(
  { concurrence, user, target }: CreationParams,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    logger.info({ target });
    const parsedConcurrenceObject = parseConcurrenceObj(concurrence);

    const newConcurrence = await Concurrence.create({
      ...parsedConcurrenceObject,
      userId: user.id,
      targetId: target.id,
      targetType: target.type,
    }, { transaction });

    return newConcurrence;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
    throw new Error('Error occurred while creating new Concurrence');
  }
}

export default createConcurrence;
