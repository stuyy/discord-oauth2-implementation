import { Router } from 'express';
import { getDiscordUser } from '../../controllers/user';

const router = Router();

router.get('/profile', getDiscordUser);

export default router;
