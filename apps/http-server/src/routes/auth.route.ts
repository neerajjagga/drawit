import express from 'express';
import { signupUser, signinUser } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/', signupUser);
authRouter.post('/', signinUser);

export default authRouter;