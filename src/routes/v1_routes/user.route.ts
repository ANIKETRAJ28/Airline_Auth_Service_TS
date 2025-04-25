import { Router } from 'express';
import { UserController } from '../../controller/user.controller';

export const userRouter = Router();
const userController = new UserController();

userRouter.get('/id/:id', userController.getUserById.bind(userController));
userRouter.get('/email/:email', userController.getUserByEmail.bind(userController));
userRouter.get('/:id/admin', userController.isUserAdmin.bind(userController));
userRouter.post('/', userController.createUser.bind(userController));
