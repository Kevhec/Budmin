import type { Request, Response } from 'express';
import { fn, literal, Op } from 'sequelize';
import { Category, Transaction } from '../database/models';
import generateDateRange from '../lib/utils/generateDateRange';
import { cliTheme } from '../lib/utils';

// Create
async function createCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const {
    name,
    color,
    type,
  } = req.body;

  try {
    const newCategory = await Category.create({
      name,
      color,
      isDefault: false,
      userId: req.user?.id || '',
      type,
    });

    return res.status(201).json({ data: { category: newCategory } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Read
async function getAllCategories(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  try {
    const categories = await Category.findAll({
      where: {
        [Op.or]: [
          { isDefault: true },
          { userId: req.user?.id },
        ],
      },
    });

    if (!categories.length) {
      return res.status(404).json('No categories where found');
    }

    return res.status(200).json({ data: categories });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;

  try {
    const category = await Category.findOne({
      where: {
        id: categoryId,
        [Op.or]: [
          { isDefault: true },
          { userId: req.user?.id },
        ],
      },
    });

    if (!category) {
      return res.status(404).json(`Category not found for specified id: ${categoryId}`);
    }

    return res.status(200).json({ data: category });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

async function getCategoriesMonthlyBalance(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const userId = req.user?.id;

  const [start, end] = generateDateRange({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    userId,
    date: {
      [Op.between]: [start, end],
    },
  };

  try {
    const balance = await Transaction.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          where: {
            [Op.or]: [
              { isDefault: true },
              { userId },
            ],
          },
        },
      ],
      where: whereClause,
      attributes: [
        [fn('SUM', literal('CASE WHEN "Transaction"."type" = \'income\' THEN "amount" ELSE 0 END')), 'totalIncome'],
        [fn('SUM', literal('CASE WHEN "Transaction"."type" = \'expense\' THEN "amount" ELSE 0 END')), 'totalExpense'],
      ],
      group: ['categoryId', 'category.id'],
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
      console.log(`${cliTheme.serverWarn('ERROR at getCategoriesMonthlyBalance')}: ${error.message}`);
    }
    return res.status(500).json('Internal server error');
  }
}

// Update
async function updateCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;
  const reqBody = req.body;

  if (Object.keys(reqBody).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json(`Category not found for specified id: ${categoryId}`);
    }

    const updatedCategory = await category.update(reqBody);

    return res.status(200).json({ data: updatedCategory });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
}

// Delete
async function deleteCategory(
  req: Request,
  res: Response,
): Promise<Response | undefined> {
  const categoryId = req.params.id;

  try {
    await Category.destroy({
      where: {
        id: categoryId,
        userId: req.user?.id,
      },
    });

    return res.status(200).json({
      data: {
        message: 'Category deleted successfully',
        deletedCategoryId: parseInt(categoryId, 10),
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
  createCategory,
  getAllCategories,
  getCategory,
  getCategoriesMonthlyBalance,
  updateCategory,
  deleteCategory,
};
