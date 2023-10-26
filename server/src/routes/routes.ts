import express from 'express';
import { login, register } from '../features/auth';
import { Routes } from '../types';

const router = express.Router();

router.post(Routes.Login, login);
router.post(Routes.Register, register);

export { router };
