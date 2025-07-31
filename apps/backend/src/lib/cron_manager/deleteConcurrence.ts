import { Concurrence } from '@/src/database/models';
import { Transaction } from 'sequelize';

async function deleteConcurrence(
  concurrenceId: string,
  { transaction }: { transaction?: Transaction } = {},
) {
  try {
    await Concurrence.destroy({
      where: {
        id: concurrenceId,
      },
      transaction,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error while deleting concurrence with id ${concurrenceId}. Details: ${error.message}`);
    }
  }
}

export default deleteConcurrence;
