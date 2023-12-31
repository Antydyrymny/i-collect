import { Spinner, Stack } from 'react-bootstrap';

function MainSpinner() {
    return (
        <Stack
            className='d-flex justify-content-center align-items-center'
            style={{ minHeight: 'calc(100vh - 10.5rem)' }}
        >
            <Spinner />
        </Stack>
    );
}

export default MainSpinner;
