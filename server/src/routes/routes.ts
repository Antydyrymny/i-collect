import express from 'express';
import { forwardErrors } from './forwardErrors';
import { login, register } from '../features/auth';
import { Routes } from '../types';

const router = express.Router();

router.post(Routes.Login, forwardErrors(login));
router.post(Routes.Register, forwardErrors(register));

export { router };
