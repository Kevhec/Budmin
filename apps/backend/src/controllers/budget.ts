import { response, type Request, type Response } from 'express';
import {
  DatabaseError, fn, InferAttributes, literal, Op,
  Sequelize,
} from 'sequelize';
import { format } from '@formkit/tempo';
import {
  Budget, Category, CronTask, Transaction,
} from '../database/models';
import generateDateRange from '../lib/utils/generateDateRange';
import {
  createBudget as createBudgetJob,
} from '../lib/jobs';
import {
  JobTypes,
  TargetType,
  type CreateBudgetRequestBody,
  type TypedRequest,
} from '../lib/types';
import { generateLinksMetadata, sanitizeObject } from '../lib/utils';
import extractBudgetBalance from '../lib/jobs/extractBudgetBalance';
import Concurrence from '../database/models/concurrence';
import upsertConcurrence from '../lib/cron_manager/upsertConcurrence';
import prepareJobData from '../lib/cron_manager/prepareJobData';

// Create
async function createBudget(
  req: TypedRequest<CreateBudgetRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const {
    name,
    totalAmount,
    startDate,
    endDate,
    concurrence,
  } = req.body;

  const {
    user,
  } = req;

  try {
    const startDateObj = new Date(startDate);
    let jobData;

    if (concurrence && user) {
      jobData = prepareJobData(user, concurrence, startDateObj);
    }

    // If recurrence is provided, overwrite endDateObj to
    // nextExecutionDate instead of normal non concurrent budgets end date.
    const endDateObj = jobData?.nextExecutionDate || new Date(endDate);

    const newBudget = await createBudgetJob({
      name,
      totalAmount,
      startDate: startDateObj,
      endDate: endDateObj,
      userId: user?.id || '',
    });

    if (jobData && user) {
      const {
        cronExpression,
        concurrenceEndDate,
        nextExecutionDate,
        timezone,
      } = jobData;

      await upsertConcurrence({
        user,
        cronExpression,
        concurrence,
        timezone,
        nextExecutionDate,
        startDate: startDateObj,
        endDate: concurrenceEndDate,
        jobName: JobTypes.CREATE_BUDGET,
        jobArgs: {
          name,
          totalAmount,
        },
        target: {
          id: newBudget.id,
          type: TargetType.BUDGET,
        },
      });
    }

    const sanitizedBudget = sanitizeObject(newBudget.toJSON(), ['userId']);

    return res.status(201).json({ data: { budget: sanitizedBudget } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllBudgets(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    offset, limit, month, balance,
  } = req.query;
  const userId = req.user?.id || '' as string;

  // Convert to string to ensure types
  let strOffset;
  let strLimit;
  let strMonth;

  if (offset) strOffset = String(offset);

  if (limit) strLimit = String(limit);

  if (month) strMonth = String(month || format(new Date(), 'YYYY-MM'));

  const intOffset = parseInt(strOffset || '0', 10);
  const intLimit = parseInt(strLimit || '', 10);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
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
    const { count, rows } = await Budget.findAndCountAll({
      where: whereClause,
      offset: intOffset,
      limit: intLimit || undefined,
      include: [
        {
          model: Concurrence,
          as: 'budgetConcurrence',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'userId', 'id', 'budgetId'],
          },
        },
      ],
      attributes: {
        exclude: ['userId'],
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "transactions" AS "transactions"
              WHERE "transactions"."budgetId" = "Budget"."id"
            )`),
            'transactionsCount',
          ],
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    if (!rows.length) {
      const notFoundMessage = 'No budgets found';
      return res.status(404).json(notFoundMessage);
    }

    let budgetsToReturn;

    if (balance) {
      const budgetsIds = rows.map((budget) => budget.id) as string[];

      const budgetsBalance = await extractBudgetBalance({ userId, budgetId: budgetsIds });

      budgetsToReturn = rows.map((budget) => ({
        ...budget.get(),
        balance: budgetsBalance ? budgetsBalance[budget.id] : { totalIncome: 0, totalExpense: 0 },
      }));
    } else {
      budgetsToReturn = rows.map((item) => item.get());
    }

    const responseObject: {
      data: InferAttributes<Budget, { omit: never }>[]
      meta?: any
      links?: any
    } = {
      data: budgetsToReturn,
    };

    // TODO: Replicate this for any paginated endpoint, consider a function
    const { meta, links } = generateLinksMetadata({
      count, rows, offset: intOffset, limit: intLimit,
    });

    responseObject.meta = meta;

    if (strOffset && strLimit) {
      responseObject.links = links;
    }

    return res.status(200).json(responseObject);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    const budget = await Budget.findOne({
      where: {
        id: budgetId,
        userId: req.user?.id,
      },
      attributes: {
        exclude: ['userId'],
      },
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    const sanitizedBudget = sanitizeObject(budget.toJSON(), ['userId']);

    return res.status(200).json({ data: sanitizedBudget });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getBudgetTransactions(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const budgetId = req.params.id;

    const { rows, count } = await Transaction.findAndCountAll({
      where: {
        budgetId,
        userId: req.user?.id,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: { exclude: ['userId'] },
        },
      ],
      attributes: { exclude: ['userId', 'categoryId'] },
    });

    if (count === 0) {
      return res.status(404).json(`There are not transactions associated to budget ${budgetId}`);
    }

    const responseObject: {
      data: InferAttributes<Transaction, { omit: never }>[]
      meta?: any
      links?: any
    } = {
      data: rows.map((transaction) => transaction.get()),
    };

    const { meta } = generateLinksMetadata({
      count, rows, offset: 0, limit: 0,
    });

    responseObject.meta = meta;

    return res.status(200).json(responseObject);
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getBudgetBalance(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const userId = req.user?.id;
  const { from, to } = req.query;

  let strFrom;
  let strTo;

  if (from) strFrom = String(from);
  if (to) strTo = String(to);

  const [start, end] = generateDateRange({ fromDate: strFrom, toDate: strTo });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
    createdAt: {
      [Op.between]: [start, end],
    },
  };

  try {
    const balance = await Transaction.findAll({
      include: [
        {
          model: Budget,
          as: 'budget',
          where: {
            userId,
          },
        },
      ],
      where: whereClause,
      attributes: [
        [fn('SUM', literal('CASE WHEN "type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
      ],
      group: ['budgetId', 'budget.id'],
    });

    if (!balance.length) {
      return res.status(404).json('No balance found');
    }

    return res.status(200).json({
      data: {
        month: start?.getMonth(),
        balance,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateBudget(
  req: TypedRequest<CreateBudgetRequestBody>,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;
  const reqBody = req.body;

  try {
    const budget = await Budget.findByPk(budgetId, {
      include: [
        {
          model: Concurrence,
          as: 'budgetConcurrence',
        },
        {
          model: CronTask,
          as: 'budgetCronTask',
        },
      ],
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for specified id: ${budgetId}`);
    }

    const {
      name,
      totalAmount,
      startDate,
      endDate,
      concurrence,
    } = reqBody;

    const {
      user,
    } = req;

    const prevBudgetData = budget.get();
    const {
      startDate: prevStartDate,
      endDate: prevEndDate,
      budgetConcurrence: prevConcurrence,
      budgetCronTask: prevCronTask,
    } = prevBudgetData;

    const startDateObj = startDate ? new Date(startDate) : prevStartDate;
    let endDateObj = endDate ? new Date(endDate) : prevEndDate;

    let jobData;

    if (concurrence && user) {
      jobData = prepareJobData(user, concurrence, startDateObj);
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
        concurrence,
        endDate: concurrenceEndDate,
        cronExpression,
        timezone,
        startDate: startDateObj,
        jobName: JobTypes.CREATE_BUDGET,
        jobArgs: {
          name,
          totalAmount,
        },
        nextExecutionDate,
        prevConcurrenceId: updatedConcurrenceId,
        prevCronTaskId: updatedCronTaskId,
        target: {
          id: budget.id,
          type: TargetType.BUDGET,
        },
      });

      endDateObj = nextExecutionDate;
    }

    const updatedBudget = await budget.update({
      name,
      totalAmount,
      startDate: startDateObj,
      endDate: endDateObj,
    });

    const sanitizedBudget = sanitizeObject(updatedBudget.toJSON(), ['cronTaskId']);

    return res.status(200).json({ data: sanitizedBudget });
  } catch (error: unknown) {
    if (error instanceof DatabaseError) {
      const sequelizeError = error as { parent?: { code?: string, detail?: string } };

      if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
        if (sequelizeError.parent && sequelizeError.parent.code === '23503') {
          return res.status(409).json(sequelizeError.parent.detail);
        }
      }
    }
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteBudget(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const budgetId = req.params.id;

  try {
    const budget = await Budget.findOne({
      where: {
        id: budgetId,
        userId: req.user?.id,
      },
    });

    if (!budget) {
      return res.status(404).json(`Budget not found for id: ${budgetId}`);
    }

    await budget?.destroy();

    return res.status(200).json({
      data: {
        message: 'Budget deleted successfully',
        deletedBudgetId: parseInt(budgetId, 10),
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

export {
  createBudget,
  getAllBudgets,
  getBudget,
  getBudgetBalance,
  updateBudget,
  deleteBudget,
  getBudgetTransactions,
};
