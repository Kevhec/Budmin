import { Budget, Category, Transaction } from '@/src/database/models';
import { Transaction as TransactionType } from 'sequelize';
import type { CreateTransactionParams } from '../types';

async function createTransaction(
  {
    description,
    amount,
    startDate,
    type,
    budgetId,
    categoryId,
    userId,
  }: CreateTransactionParams,
  { transaction }: { transaction?: TransactionType } = {},
) {
  try {
    const generalCategory = await Category.findOne({
      where: {
        name: 'General',
        isDefault: true,
      },
      transaction,
    });

    const newTransaction = await Transaction.create({
      description,
      amount,
      date: startDate,
      type,
      budgetId,
      categoryId: categoryId || generalCategory?.id,
      userId,
    }, { transaction });

    const transactionWithCategory = await Transaction.findOne({
      where: { id: newTransaction.id },
      attributes: { exclude: ['categoryId', 'budgetId'] },
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'color', 'key'],
          as: 'category',
        },
        {
          identifier: 'budget',
          model: Budget,
          attributes: ['id', 'name', 'totalAmount', 'startDate', 'endDate'],
          as: 'budget',
        },
      ],
      transaction,
    });

    if (!transactionWithCategory) {
      throw new Error('Error while looking for newly created transaction');
    }

    return transactionWithCategory;
  } catch (error) {
    throw new Error('Error occurred while creating new Transaction');
  }
}

export default createTransaction;
