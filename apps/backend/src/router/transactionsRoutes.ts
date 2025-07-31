import { Router } from 'express';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getBalance,
  getTransaction,
  updateTransaction,
} from '../controllers/transaction';
import authenticate from '../middleware/authenticate';
import { Budget, Transaction } from '../database/models';
import authorizeCreation from '../middleware/authorizeCreation';
import authorizeAccess from '../middleware/authorizeAccess';
import validateSchema from '../middleware/validateSchema';
import { createTransactionSchema, getBalanceSchema, updateTransactionSchema } from '../database/schemas/transaction';
import { getObjectByUUID } from '../database/schemas/general';

const router: Router = Router();

router.route('/')
  .post(
    validateSchema(createTransactionSchema),
    authenticate,
    authorizeCreation(Budget, 'budgetId'),
    createTransaction,
  )
  .get(
    authenticate,
    getAllTransactions,
  );

router.route('/balance')
  .get(
    validateSchema(getBalanceSchema),
    authenticate,
    getBalance,
  );

router.route('/:id')
  .get(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Transaction),
    getTransaction,
  )
  .patch(
    validateSchema(updateTransactionSchema),
    authenticate,
    authorizeAccess(Transaction),
    updateTransaction,
  )
  .delete(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Transaction),
    deleteTransaction,
  );

export default router;
