import { Transaction } from '@/src/database/models';
import { fn, literal, Op } from 'sequelize';

interface Props {
  userId: string
  budgetId: string | string[]
}

interface BudgetBalance {
  budgetId: string
  totalIncome: number,
  totalExpense: number,
}

async function extractBudgetBalance({
  userId,
  budgetId,
}: Props): Promise<
  Record<string, {
    totalIncome: number;
    totalExpense: number;
  }> | null> {
  // This is made to ensure working only with an array of ids even if it's only one element
  const flatBudgetIdArray = [budgetId].flat();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
    budgetId: {
      [Op.in]: flatBudgetIdArray,
    },
  };

  try {
    const balance = await Transaction.findAll({
      where: whereClause,
      attributes: [
        'budgetId',
        [fn('SUM', literal('CASE WHEN "type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
      ],
      group: ['budgetId'],
    });

    if (!balance.length) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const balanceObject = balance.reduce((acc, transaction: any) => {
      const {
        budgetId: balanceBudgetId,
        totalExpense,
        totalIncome,
      } = transaction.get() as BudgetBalance;

      if (!acc[balanceBudgetId]) {
        acc[balanceBudgetId] = { totalExpense, totalIncome };
      }

      return acc;
    }, {} as Record<string, { totalIncome: number; totalExpense: number }>);

    return balanceObject;
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return null;
  }
}

export default extractBudgetBalance;
