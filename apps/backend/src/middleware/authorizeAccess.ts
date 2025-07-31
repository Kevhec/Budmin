import type { Request, Response, NextFunction } from 'express';
import type { ModelStatic } from 'sequelize';
import type { Element } from '../../types/express';

function authorizeAccess(
  model: ModelStatic<Element>,
) {
  return (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const { id } = req.params;

      const element = await model.findOne({
        where: {
          id,
        },
      });

      if (!element) {
        return res.status(404).json('Resource not found');
      }

      if (element.userId !== user?.id) {
        return res.status(403).json('Forbidden: You do not have access to this resource');
      }

      req.element = element;

      return next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('ERROR: ', error.message);
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
}

export default authorizeAccess;
