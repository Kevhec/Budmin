import type { Request, Response } from 'express';
import { Budget, Page /* , User */ } from '../database/models';
import SequelizeConnection from '../database/config/SequelizeConnection';

const sequelize = SequelizeConnection.getInstance();

const createPage = async (req: Request, res: Response) => {
  const {
    name,
  } = req.body;

  try {
    const newPage = await sequelize.transaction(async (t) => {
      /* const user = await User.findByPk(req.user?.id); */
      const pageName = name;

      const page = await Page.create({
        name: pageName,
        userId: req.user?.id,
      }, { transaction: t });

      /* await user?.update({
        pagesCount: user.pagesCount + 1,
      }, { transaction: t }); */

      return page;
    });

    return res.status(201).json({ data: { page: newPage } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const getPage = async (req: Request, res: Response) => {
  const pageId = req.params.id;

  try {
    const page = await Page.findOne({
      where: {
        id: pageId,
        userId: req.user?.id,
      },
    });

    if (!page) {
      return res.status(404).json(`Page not found for specified id: ${pageId}`);
    }

    return res.status(200).json({ data: page });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
  return 0;
};

const getAllPages = async (req: Request, res: Response) => {
  const pages = await Page.findAll({
    where: {
      userId: req.user?.id,
    },
  });

  if (!pages.length) {
    return res.status(404).json('No pages where found');
  }

  return res.status(200).json({ data: pages });
};

const getPageBudget = async (req: Request, res: Response) => {
  const pageId = req.params.id;

  const pageWithBudget = await Page.findOne({
    where: {
      id: pageId,
      userId: req.user?.id,
    },
    include: Budget,
  });

  if (!pageWithBudget) {
    return res.status(404).json(`Page not found for specified id: ${pageId}`);
  }

  return res.status(200).json({ data: pageWithBudget });
};

const updatePage = async (req: Request, res: Response) => {
  const pageId = req.params.id;
  const reqBody = req.body;

  if (Object.keys(reqBody).length === 0) {
    return res.status(400).json({ message: 'Request body cannot be empty' });
  }

  try {
    const page = await Page.findByPk(pageId);

    if (!page) {
      return res.status(404).json(`Budget not found for specified id: ${pageId}`);
    }

    const updatedPage = await page.update(reqBody);

    return res.status(200).json({ data: updatedPage });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

const deletePage = async (req: Request, res: Response) => {
  const pageId = req.params.id;

  try {
    const deleteInformation = await sequelize.transaction(async (t) => {
      /*       const user = await User.findByPk(req.user?.id); */
      await Page.destroy({
        where: {
          id: pageId,
          userId: req.user?.id,
        },
        transaction: t,
      });

      return {
        message: 'Budget deleted successfully',
        deletedBudgetId: parseInt(pageId, 10),
      };
    });

    return res.status(200).json({ data: deleteInformation });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: ', error.message);
    }
    return res.status(500).json('Internal server error');
  }
};

export {
  createPage,
  getPage,
  getAllPages,
  getPageBudget,
  updatePage,
  deletePage,
};
