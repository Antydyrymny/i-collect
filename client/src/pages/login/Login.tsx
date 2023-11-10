import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../../app/services/api';
import { useInformOfError } from '../../hooks';
import { useLocale } from '../../contexts/locale';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Login() {
    const t = useLocale('login');

    const [loginState, setLoginState] = useState({ email: '', password: '' });
    const [login, { isLoading, isError, error }] = useLoginMutation();

    useInformOfError({ isError, error });

    const allowSubmit = !isLoading && loginState.email && loginState.password;

    function changeLoginState(param: 'email' | 'password') {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setLoginState((prevState) => ({ ...prevState, [param]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        toast.dismiss();
        await login(loginState);
    }

    return (
        <>
            <Card.Title className='fw-bold mb-2 text-uppercase '>
                {t('header')}
            </Card.Title>
            <Card.Subtitle className=' mb-5'>{t('header-msg')}</Card.Subtitle>
            <div className='mb-3'>
                <Form onSubmit={allowSubmit ? handleSubmit : undefined}>
                    <Form.Group className='mb-3'>
                        <Form.Label className='text-center'>
                            {t('email-label')}
                        </Form.Label>
                        <Form.Control
                            type='email'
                            placeholder={t('email-placeholder')}
                            required
                            value={loginState.email}
                            onChange={changeLoginState('email')}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>{t('password-label')}</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder={t('password-placeholder')}
                            minLength={8}
                            required
                            value={loginState.password}
                            onChange={changeLoginState('password')}
                        />
                        <br />
                    </Form.Group>
                    <div className='d-grid'>
                        <Button
                            variant='primary'
                            type='submit'
                            className='d-flex justify-content-center align-items-center'
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner /> : t('btn')}
                        </Button>
                    </div>
                </Form>
                <div className='mt-3'>
                    <p className='mb-0  text-center'>
                        {t('signup-msg')}{' '}
                        <Link to={'/register'} className='text-primary fw-bold'>
                            {t('signup')}
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;
