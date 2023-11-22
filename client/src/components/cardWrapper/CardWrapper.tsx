import { Card } from 'react-bootstrap';
import { useBreakpoints } from '../../hooks';

function CardWrapper({
    children,
    classes,
}: {
    children: React.ReactNode;
    classes?: string;
}) {
    const screenSize = useBreakpoints();

    return screenSize !== 'xs' && screenSize !== 'sm' ? (
        <Card style={{ borderRadius: '0.5rem' }}>
            <Card.Body
                className={`${classes} p-3 bg-body-tertiary`}
                style={{ borderRadius: '0.5rem' }}
            >
                {children}
            </Card.Body>
        </Card>
    ) : (
        <>{children}</>
    );
}

export default CardWrapper;
