import { object, string } from 'yup';
import { LoginRequest, RegisterRequest } from '../../types';

export const validateLogin = object({
    body: object<LoginRequest>().shape({
        email: string().email('Must be valid email').required('Incorrect email format'),
        password: string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Incorrect email format'),
    }),
});

export const validateRegister = object({
    body: object<RegisterRequest>().shape({
        name: string().required('Incorrect name format'),
        email: string().email('Must be valid email').required('Incorrect email format'),
        password: string()
            .min(8, 'Password must be at least 8 characters long')
            .required('Incorrect email format'),
    }),
});
