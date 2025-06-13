import { Router } from 'express';
import { UserController } from '../../controller/user.controller';
import { authenticateEMAIL, authenticateJWT, verifyJWT } from '../../middleware/auth.middleware';
import { authorizeAdminRole } from '../../middleware/authorization.middleware';

export const userRouter = Router();
const userController = new UserController();

userRouter.get('/verify', verifyJWT);
userRouter.get('/logout', authenticateJWT, userController.logout.bind(userController));
userRouter.get('/id/:id', authenticateJWT, authorizeAdminRole, userController.getUserById.bind(userController));
userRouter.get(
  '/email/:email',
  authenticateJWT,
  authorizeAdminRole,
  userController.getUserByEmail.bind(userController),
);
userRouter.get('/:id/admin', authenticateJWT, authorizeAdminRole, userController.isUserAdmin.bind(userController));
userRouter.post('/login/otp', authenticateEMAIL, userController.loginViaOTP.bind(userController));
userRouter.post('/sendOtp', userController.sendLoginOTP.bind(userController));
userRouter.post('/login/password', userController.loginViaPassword.bind(userController));
userRouter.post('/register', userController.registerUser.bind(userController));
userRouter.post('/verifyOtp', authenticateEMAIL, userController.verifyOtp.bind(userController));
userRouter.put('/update/password', authenticateJWT, userController.updateUserPassword.bind(userController));
