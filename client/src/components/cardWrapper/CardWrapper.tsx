import { Card } from 'react-bootstrap';

function CardWrapper({
    children,
    classes,
}: {
    children: React.ReactNode;
    classes?: string;
}) {
    return (
        <Card style={{ borderRadius: '0.5rem' }}>
            <Card.Body
                className={`${classes} p-3 bg-body-tertiary`}
                style={{ borderRadius: '0.5rem' }}
            >
                {children}
            </Card.Body>
        </Card>
    );
}

export default CardWrapper;
