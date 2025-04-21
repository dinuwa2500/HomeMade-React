import { Router } from 'express';
import {
  loginUser,
  logoutUser,
  registerUserController,
  userAvatarController,
  UserDetailsUpdate,
  verifyEmailController,
} from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();

userRouter.post('/register', registerUserController);
userRouter.post('/verifyemail', verifyEmailController);
userRouter.post('/login', loginUser);
userRouter.get('/logout', auth, logoutUser);
userRouter.put('/avatar', auth, upload.array('avatar'), userAvatarController);
userRouter.put('/:id', auth, UserDetailsUpdate);

export default userRouter;
