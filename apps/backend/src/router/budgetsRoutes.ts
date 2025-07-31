import { Router } from 'express';
import {
  createBudget,
  deleteBudget,
  getAllBudgets,
  getBudget,
  updateBudget,
  getBudgetTransactions,
  getBudgetBalance,
} from '../controllers/budget';
import authenticate from '../middleware/authenticate';
import { Budget, Page } from '../database/models';
import authorizeAccess from '../middleware/authorizeAccess';
import authorizeCreation from '../middleware/authorizeCreation';
import validateSchema from '../middleware/validateSchema';
import { createBudgetSchema, updateBudgetSchema } from '../database/schemas/budget';
import { getObjectByUUID } from '../database/schemas/general';

const router: Router = Router();

router.route('/')
  .post(
    validateSchema(createBudgetSchema),
    authenticate,
    authorizeCreation(Page, 'pageId'),
    createBudget,
  )
  .get(
    authenticate,
    getAllBudgets,
  );

router.get(
  '/balance',
  authenticate,
  getBudgetBalance,
);

router.route('/:id')
  .get(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Budget),
    getBudget,
  )
  .patch(
    validateSchema(updateBudgetSchema),
    authenticate,
    authorizeAccess(Budget),
    updateBudget,
  )
  .delete(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Budget),
    deleteBudget,
  );

router.get('/:id/transactions', authenticate, authorizeAccess(Budget), getBudgetTransactions);

export default router;
