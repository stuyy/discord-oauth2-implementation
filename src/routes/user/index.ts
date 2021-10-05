import { Router } from 'express';

const router = Router();

router.get('/profile', (req, res) => res.send('Hello'));

export default router;
