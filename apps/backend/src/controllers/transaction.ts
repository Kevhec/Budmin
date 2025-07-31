import type { Request, Response } from 'express';
import {
  DatabaseError, fn, literal, Op,
} from 'sequelize';
import { Budget, Category, Transaction } from '../database/models';
import generateLinksMetadata from '../lib/utils/generateLinksMetadata';
import generateDateRange from '../lib/utils/generateDateRange';
import {
  TargetType,
  JobTypes,
  type BalanceData,
  type BalanceResponse,
  type CreateTransactionRequestBody,
  type MonthData,
  type TypedRequest,
} from '../lib/types';
import { parseIncludes, sanitizeObject } from '../lib/utils';
import {
  createTransaction as createTransactionJob,
} from '../lib/jobs';
import Concurrence from '../database/models/concurrence';
import upsertConcurrence from '../lib/cron_manager/upsertConcurrence';
import CronTask from '../database/models/cronTask';
import prepareJobData from '../lib/cron_manager/prepareJobData';
import SequelizeConnection from '../database/config/SequelizeConnection';
import { stopCronTask } from '../lib/cron_manager/taskScheduler';
import deleteCronTask from '../lib/cron_manager/deleteCronTask';
import deleteConcurrence from '../lib/cron_manager/deleteConcurrence';
import renameObjectKey from '../lib/utils/renameObjectKey';

const sequelize = SequelizeConnection.getInstance();

// Create
async function createTransaction(
  req: TypedRequest<CreateTransactionRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const {
    description,
    amount,
    startDate,
    type,
    categoryId,
    budgetId,
    concurrence,
  } = req.body;

  const {
    user,
  } = req;

  const transaction = await sequelize.transaction();
  try {
    const dateObject = new Date(startDate);
    let jobData;

    if (concurrence && user) {
      jobData = prepareJobData(user, concurrence, dateObject);
    }

    const newTransaction = await createTransactionJob({
      description,
      amount,
      startDate: dateObject,
      type,
      budgetId,
      categoryId,
      userId: req.user?.id || '',
    }, { transaction });

    if (jobData && user) {
      const {
        cronExpression,
        concurrenceEndDate,
        nextExecutionDate,
        timezone,
      } = jobData;

      await upsertConcurrence({
        user,
        target: {
          id: newTransaction.id,
          type: TargetType.TRANSACTION,
        },
        jobName: JobTypes.CREATE_TRANSACTION,
        jobArgs: {
          description,
          amount,
          startDate,
          type,
          categoryId,
          budgetId: budgetId || '',
        },
        concurrence,
        endDate: concurrenceEndDate,
        startDate: dateObject,
        cronExpression,
        timezone,
        nextExecutionDate,
        startDateOnly: true,
      }, { transaction });
    }

    if (!newTransaction) {
      return res.status(500).json('There was an error creating the new transaction');
    }

    await transaction.commit();

    const sanitizedTransaction = sanitizeObject(newTransaction.toJSON(), ['cronTaskId']);

    return res.status(201).json({ data: { transaction: sanitizedTransaction } });
  } catch (error: unknown) {
    await transaction.rollback();

    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
    }

    console.log(error);

    return res.status(500).json('Internal server error');
  }
}

// Read
async function getAllTransactions(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;
  const {
    offset, limit, month, include,
  } = req.query;

  const includes = parseIncludes(String(include), {
    models: [
      {
        identifier: 'budget',
        model: Budget,
        attributes: ['id', 'name', 'totalAmount', 'startDate', 'endDate'],
        as: 'budget',
      },
      {
        identifier: 'category',
        model: Category,
        attributes: ['id', 'name', 'color', 'key'],
        as: 'category',
      },
      {
        identifier: 'concurrence',
        model: Concurrence,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId', 'id'],
        },
        as: 'transactionConcurrence',
      },
    ],
  });

  // Convert to string to ensure types
  let strOffset;
  let strLimit;
  let strMonth;

  if (offset) strOffset = String(offset);

  if (limit) strLimit = String(limit);

  if (month) strMonth = String(month);

  // offset conversion from data type assigned by req.query into integer
  const intOffset = parseInt(strOffset || '', 10);
  const intLimit = parseInt(strLimit || '', 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId: req.user?.id,
  };

  if (month) {
    // If month is provided use it for filtering, formatted as YYYY-MM
    const dateRange = generateDateRange({ fromDate: strMonth });

    if (dateRange) {
      const [start, end] = dateRange;

      whereClause.createdAt = {
        [Op.between]: [start, end],
      };
    }
  }

  try {
    // Order is established by created at date in desc order so newer
    // transactions are shown first
    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      offset: intOffset,
      limit: intLimit,
      include: includes ? includes.includedModels : [],
      attributes: {
        exclude: includes ? includes.includedIdentifiers : [],
      },
      order: [['createdAt', 'DESC']],
    });

    if (!rows.length) {
      const noIdMessage = 'No expenses found';
      const withIdMessage = `Expense not found for specified id: ${transactionId}`;
      return res.status(404).json(transactionId ? withIdMessage : noIdMessage);
    }

    // This function implements an approach to JSON-API standard for pagination
    const { meta, links } = generateLinksMetadata({
      count, rows, offset: intOffset, limit: intLimit,
    });

    const concurrenceRenamedRows = rows.map((transaction) => {
      console.log({ transaction: transaction.toJSON() });
      const renamedTransaction = renameObjectKey(transaction.toJSON(), 'transactionConcurrence', 'concurrence');
      return renamedTransaction;
    });

    return res.status(200).json({
      data: concurrenceRenamedRows,
      meta,
      links,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
        userId: req.user?.id,
      },
    });

    if (!transaction) {
      return res.status(404).json(`Expense not found for specified id: ${transactionId}`);
    }

    return res.status(200).json({ data: transaction });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getBalance(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const { from, to } = req.query;

  let strFrom;
  let strTo;

  if (from) strFrom = String(from);
  if (to) strTo = String(to);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId: req.user?.id,
  };

  const dateRange = generateDateRange({ fromDate: strFrom, toDate: strTo, untilToday: !strTo });

  if (dateRange) {
    const [start, end] = dateRange;

    whereClause.createdAt = {
      [Op.between]: [start, end],
    };
  }

  try {
    const balanceResponse = await Transaction.findAll({
      where: whereClause,
      attributes: [
        [fn('EXTRACT', literal('YEAR from "date"')), 'year'],
        [fn('EXTRACT', literal('MONTH from "date"')), 'month'],
        [fn('SUM', literal('CASE WHEN "type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
        [fn('SUM', literal(
          `CASE
            WHEN "type" = 'income' THEN "amount"
            WHEN "type" = 'expense' THEN - "amount"
          END`,
        )), 'balance'],
      ],
      group: [
        fn('EXTRACT', literal('YEAR from "date"')),
        fn('EXTRACT', literal('MONTH from "date"')),
      ],
      order: [
        [fn('EXTRACT', literal('YEAR from "date"')), 'ASC'],
        [fn('EXTRACT', literal('MONTH from "date"')), 'ASC'],
      ],
    });

    if (!balanceResponse.length) {
      const notFoundMessage = 'No balance found';
      return res.status(404).json(notFoundMessage);
    }

    const formattedRes: BalanceData = {};

    balanceResponse.forEach((item) => {
      const {
        year, month, totalIncome, totalExpense, balance,
      } = item.dataValues as unknown as BalanceResponse;

      const monthData: MonthData = {
        totalIncome,
        totalExpense,
        balance,
      };

      formattedRes[year] ||= {};

      formattedRes[year][month] = monthData;
    });

    return res.status(200).json({
      data: formattedRes,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateTransaction(
  req: TypedRequest<CreateTransactionRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;
  const reqBody = req.body;
  const { include } = req.query;

  const t = await sequelize.transaction();

  try {
    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        {
          model: Concurrence,
          as: 'transactionConcurrence',
        },
        {
          model: CronTask,
          as: 'transactionCronTask',
        },
      ],
      transaction: t,
    });

    if (!transaction) {
      return res.status(404).json(`Transaction not found for specified id: ${transactionId}`);
    }

    const {
      description,
      amount,
      startDate,
      type,
      categoryId,
      budgetId,
      concurrence,
    } = reqBody;

    const {
      user,
    } = req;

    const transactionPrevData = transaction.get();
    const {
      date: prevDate,
      transactionConcurrence: prevConcurrence,
      transactionCronTask: prevCronTask,
    } = transactionPrevData;

    const dateObject = startDate ? new Date(startDate) : prevDate;

    let jobData;

    if (concurrence && user) {
      jobData = prepareJobData(user, concurrence, dateObject);
    }

    const updatedConcurrenceId = concurrence ? prevConcurrence?.id : null;
    const updatedCronTaskId = concurrence ? prevCronTask?.id : null;

    if (jobData && user) {
      const {
        concurrenceEndDate,
        cronExpression,
        nextExecutionDate,
        timezone,
      } = jobData;

      await upsertConcurrence({
        user,
        startDate: dateObject,
        startDateOnly: true,
        concurrence,
        jobName: JobTypes.CREATE_TRANSACTION,
        jobArgs: {
          description,
          amount,
          startDate,
          type,
          categoryId,
          budgetId: budgetId || '',
        },
        target: {
          id: transaction.id,
          type: TargetType.TRANSACTION,
        },
        endDate: concurrenceEndDate,
        cronExpression,
        nextExecutionDate,
        timezone,
        prevConcurrenceId: updatedConcurrenceId,
        prevCronTaskId: updatedCronTaskId,
      }, { transaction: t });
    }

    if (!concurrence && updatedConcurrenceId && updatedCronTaskId) {
      await deleteConcurrence(updatedConcurrenceId, { transaction: t });
      await deleteCronTask(updatedCronTaskId, { transaction: t });
    }

    await transaction.update({
      description,
      amount,
      type,
      categoryId,
      budgetId,
      date: dateObject,
    }, { transaction: t });

    const includes = parseIncludes(String(include), {
      models: [
        {
          identifier: 'budget',
          model: Budget,
          attributes: ['id', 'name', 'totalAmount', 'startDate', 'endDate'],
          as: 'budget',
        },
        {
          identifier: 'category',
          model: Category,
          attributes: ['id', 'name', 'color', 'key'],
          as: 'category',
        },
        {
          identifier: 'concurrence',
          model: Concurrence,
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'id'],
          },
          as: 'transactionConcurrence',
        },
      ],
    });

    const fullTransaction = await transaction.reload({
      include: includes ? includes.includedModels : [],
      attributes: {
        exclude: includes ? includes.includedIdentifiers : [],
      },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({ data: fullTransaction });
  } catch (error: unknown) {
    await t.rollback();
    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
    } else if (error instanceof Error) {
      console.log('Errorrrrr: ', error);
    }
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteTransaction(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const transactionId = req.params.id;

  const t = await sequelize.transaction();

  try {
    const transaction = await Transaction.findByPk(transactionId, {
      include: [
        {
          model: CronTask,
          as: 'transactionCronTask',
        },
        {
          model: Concurrence,
          as: 'transactionConcurrence',
        },
      ],
      transaction: t,
    });

    const currentTask = transaction?.transactionCronTask;
    const currentConcurrence = transaction?.transactionConcurrence;

    if (currentTask) {
      const taskId = currentTask.id;
      stopCronTask(taskId, { transaction: t });
      await deleteCronTask(taskId, { transaction: t });
    }

    if (currentConcurrence) {
      const concurrenceId = currentConcurrence.id;
      await deleteConcurrence(concurrenceId, { transaction: t });
    }

    await Transaction.destroy({
      where: {
        id: transactionId,
        userId: req.user?.id,
      },
      transaction: t,
    });

    await t.commit();

    return res.status(200).json({
      data: {
        message: 'Transaction deleted successfully',
        deletedTransactionId: transactionId,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    await t.rollback();
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

export {
  createTransaction,
  getAllTransactions,
  getTransaction,
  getBalance,
  updateTransaction,
  deleteTransaction,
};
