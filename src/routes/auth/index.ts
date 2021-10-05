import { Router } from 'express';
import {
  authDiscordRedirectController,
  getAuthenticatedUserController,
  revokeAccessTokenController,
} from '../../controllers/auth';

const router = Router();

router.get('/discord/redirect', authDiscordRedirectController);
router.get('/user', getAuthenticatedUserController);
router.get('/revoke', revokeAccessTokenController);

export default router;
