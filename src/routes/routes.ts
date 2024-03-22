import { Router } from 'express';
import userRouter from './userRoutes';
import bookRouter from './bookRoutes';

const router = Router();

router.use('/api', userRouter);
router.use('/api', bookRouter);

export default router;
