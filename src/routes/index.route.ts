import { Router } from 'express';
import { userRouter } from './v1_routes/user.route';

export const router = Router();

router.use('/user', userRouter);
