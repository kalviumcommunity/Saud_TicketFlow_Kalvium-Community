import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';
import { validateLoginInput } from '../middleware/validate';

const router = Router();

router.post('/login', validateLoginInput, AuthController.login);
router.get('/me', authenticate, AuthController.me);

export default router;
