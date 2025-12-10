import Concurrence from '@/src/database/models/concurrence';
import { Transaction } from 'sequelize';
import {
  TargetType,
  Target,
  type Concurrence as ConcurrenceType,
  UserAttributes,
} from '../types';
import parseConcurrenceObj from './parseConcurrenceObj';

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
    console.log({ target });
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
      console.log(error.message);
    }
    throw new Error('Error occurred while creating new Concurrence');
  }
}

export default createConcurrence;
