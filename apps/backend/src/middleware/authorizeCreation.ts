import type { Request, Response, NextFunction } from 'express';
import { Model, type ModelStatic } from 'sequelize';

interface ProtectedModel extends Model {
  userId?: string
}

function authorizeCreation(
  relatedModel?: ModelStatic<ProtectedModel>,
  relatedIdField?: string,
) {
  return (async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      const relatedId = req.body[relatedIdField || ''];

      if (relatedId) {
        const relatedElement = await relatedModel?.findByPk(relatedId);

        if (!relatedElement) {
          return res.status(404).json('Resource not found');
        }

        if (user?.id !== relatedElement.userId) {
          return res.status(403).json('Forbidden: You can not create in this resource');
        }

        req.relatedElement = relatedElement;
      }

      return next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('ERROR: ', error.message);
      }
      return res.status(401).json('Invalid token');
    }
  });
}

export default authorizeCreation;
