import { Card } from 'react-bootstrap';

function CardWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Card style={{ borderRadius: '0.5rem' }}>
            <Card.Body
                className='p-3 bg-body-tertiary'
                style={{ borderRadius: '0.5rem' }}
            >
                {children}
            </Card.Body>
        </Card>
    );
}

export default CardWrapper;
