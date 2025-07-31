import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  getCategoriesMonthlyBalance,
  updateCategory,
} from '../controllers/category';
import authenticate from '../middleware/authenticate';
import { Category, Budget } from '../database/models';
import authorizeAccess from '../middleware/authorizeAccess';
import authorizeCreation from '../middleware/authorizeCreation';
import validateSchema from '../middleware/validateSchema';
import { getObjectByUUID } from '../database/schemas/general';
import { createCategorySchema, updateCategorySchema } from '../database/schemas/category';

const router: Router = Router();

router.route('/')
  .post(
    validateSchema(createCategorySchema),
    authenticate,
    authorizeCreation(Budget, 'budgetId'),
    createCategory,
  )
  .get(
    authenticate,
    getAllCategories,
  );

router.get(
  '/balance/',
  authenticate,
  getCategoriesMonthlyBalance,
);

router.route('/:id')
  .get(
    validateSchema(getObjectByUUID),
    authenticate,
    getCategory,
  )
  .patch(
    validateSchema(updateCategorySchema),
    authenticate,
    authorizeAccess(Category),
    updateCategory,
  )
  .delete(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Budget),
    deleteCategory,
  );

export default router;
