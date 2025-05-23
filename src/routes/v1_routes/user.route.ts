import { Router } from 'express';
import { UserController } from '../../controller/user.controller';
import { jwtMiddleware } from '../../middleware/auth.middleware';

export const userRouter = Router();
const userController = new UserController();

userRouter.get('/verify', jwtMiddleware);
userRouter.get('/logout', userController.logout.bind(userController));
userRouter.get('/id/:id', userController.getUserById.bind(userController));
userRouter.get('/email/:email', userController.getUserByEmail.bind(userController));
userRouter.get('/:id/admin', userController.isUserAdmin.bind(userController));
userRouter.post('/login', userController.loginUser.bind(userController));
userRouter.post('/', userController.createUser.bind(userController));
