import express from 'express';
import validate from './validate';
import forwardErrors from './forwardErrors';
import { login, register, validateLogin, validateRegister } from '../features/auth';
import { Routes } from '../types';

const router = express.Router();

router.post(Routes.Login, validate(validateLogin), forwardErrors(login));
router.post(Routes.Register, validate(validateRegister), forwardErrors(register));

export { router };
