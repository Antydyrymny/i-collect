import { OverlayTrigger, Tooltip } from 'react-bootstrap';

type TooltipProps = {
    id: string;
    tooltipMessage: string;
    children: JSX.Element;
    placement?: 'top' | 'bottom' | 'left' | 'right';
};

function TooltipOverlay({
    children,
    id,
    tooltipMessage,
    placement = 'top',
}: TooltipProps) {
    return (
        <OverlayTrigger
            placement={placement}
            delay={{ show: 250, hide: 50 }}
            overlay={<Tooltip id={id}>{tooltipMessage}</Tooltip>}
        >
            {children}
        </OverlayTrigger>
    );
}

export default TooltipOverlay;
