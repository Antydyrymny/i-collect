import { useState, useEffect } from 'react';
import { useRegisterMutation } from '../../app/services/api';
import { isFetchError } from '../../types';
import { useLocale } from '../../contexts/locale';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Register() {
    const t = useLocale('register');

    const [register, { isLoading, isError, error }] = useRegisterMutation();
    const [registerState, setRegisterState] = useState({
        name: '',
        email: '',
        password: '',
    });

    const allowSubmit = !isLoading && registerState.email && registerState.password;

    function changeregisterState(param: 'name' | 'email' | 'password') {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setRegisterState((prevState) => ({ ...prevState, [param]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        toast.dismiss();
        await register(registerState);
    }

    useEffect(() => {
        if (isError) {
            toast.error(isFetchError(error) ? error.data : 'Unknown error has occurred');
        }

        return () => toast.dismiss();
    }, [error, isError]);

    return (
        <>
            <Card.Title className='fw-bold mb-2 text-uppercase '>
                {t('header')}
            </Card.Title>
            <Card.Subtitle className='mb-5'>{t('header-msg')}</Card.Subtitle>
            <div className='mb-3'>
                <Form onSubmit={allowSubmit ? handleSubmit : undefined}>
                    <Form.Group className='mb-3'>
                        <Form.Label className='text-center'>{t('name-label')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('name-placeholder')}
                            required
                            value={registerState.name}
                            onChange={changeregisterState('name')}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label className='text-center'>
                            {t('email-label')}
                        </Form.Label>
                        <Form.Control
                            type='email'
                            placeholder={t('email-placeholder')}
                            required
                            value={registerState.email}
                            onChange={changeregisterState('email')}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>{t('password-label')}</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder={t('password-placeholder')}
                            minLength={8}
                            required
                            value={registerState.password}
                            onChange={changeregisterState('password')}
                        />
                        <br />
                    </Form.Group>
                    <div className='d-grid mb-3'>
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
            </div>
        </>
    );
}

export default Register;
