import {Router} from 'express';
import { userController } from './'

const userRoutes = Router();

userRoutes.get('', userController.getUsers);
userRoutes.get('/:id',userController.getUser);

export { userRoutes };