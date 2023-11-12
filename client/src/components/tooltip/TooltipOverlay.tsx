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
    const renderTooltip = (props: object) => (
        <Tooltip id={id} {...props}>
            {tooltipMessage}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={placement}
            delay={{ show: 250, hide: 50 }}
            overlay={renderTooltip}
        >
            {children}
        </OverlayTrigger>
    );
}

export default TooltipOverlay;
