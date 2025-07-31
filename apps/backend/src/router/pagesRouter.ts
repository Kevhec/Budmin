import { Router } from 'express';
import {
  createPage, deletePage, getAllPages, getPage, getPageBudget, updatePage,
} from '../controllers/page';
import validateSchema from '../middleware/validateSchema';
import authenticate from '../middleware/authenticate';
import { Page } from '../database/models';
import { createPageSchema, updatePageSchema } from '../database/schemas/page';
import authorizeAccess from '../middleware/authorizeAccess';
import { getObjectByUUID } from '../database/schemas/general';

const router: Router = Router();

router.route('/')
  .post(
    validateSchema(createPageSchema),
    authenticate,
    createPage,
  )
  .get(
    authenticate,
    getAllPages,
  );

router.route('/:id')
  .get(
    validateSchema(getObjectByUUID),
    authenticate,
    getPage,
  )
  .patch(
    validateSchema(updatePageSchema),
    authenticate,
    authorizeAccess(Page),
    updatePage,
  )
  .delete(
    validateSchema(getObjectByUUID),
    authenticate,
    authorizeAccess(Page),
    deletePage,
  );

router.get('/:id/budget', authenticate, authorizeAccess(Page), getPageBudget);

export default router;
