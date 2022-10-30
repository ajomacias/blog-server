import { Router } from "express";
import { authController } from '.'

const authRoutes = Router()

authRoutes.post('/register', authController.register);
authRoutes.post('/logIn', authController.logIn);
authRoutes.get('/', authController.getUserByToken);

export { authRoutes }