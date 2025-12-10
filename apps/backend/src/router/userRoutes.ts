import { Router } from 'express';
import {
  verifyToken,
  getInfo,
  logIn, loginAsGuest, logOut, signUp,
} from '../controllers/user';
import saveUser from '../middleware/userAuth';
import authenticate from '../middleware/authenticate';
import validateSchema from '../middleware/validateSchema';
import { getTokenUUID } from '../database/schemas/general';
import { guestSchema, loginSchema, userSchema } from '../database/schemas/user';

const router: Router = Router();

// User creation route
router.get('/', authenticate, getInfo);
router.post('/signup', validateSchema(userSchema), saveUser, signUp);
router.post('/guest', validateSchema(guestSchema), loginAsGuest);
router.post('/logout', authenticate, logOut);
router.post('/login', validateSchema(loginSchema), logIn);
router.post('/verify/:token', validateSchema(getTokenUUID), verifyToken);

export default router;
