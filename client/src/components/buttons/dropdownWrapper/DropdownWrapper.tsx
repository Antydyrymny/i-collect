import { TooltipOverlay } from '../..';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { nanoid } from '@reduxjs/toolkit';
import { MoreVertical } from 'lucide-react';
import styles from './dropdownWrapperStyles.module.scss';
import { useBreakpoints } from '../../../hooks';
import { Breakpoint } from '../../../types';

type DropdownWrapperProps = {
    children: JSX.Element;
    tooltipMessage: string;
    collapseOnBreakpoing: Breakpoint;
};

function DropdownWrapper({
    children,
    tooltipMessage,
    collapseOnBreakpoing,
}: DropdownWrapperProps) {
    const screenSize = useBreakpoints();
    const breakPointOrdering = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    const collapseInd = breakPointOrdering.findIndex((bp) => bp === collapseOnBreakpoing);
    const curBPInd = breakPointOrdering.findIndex((bp) => bp === screenSize);

    return curBPInd > collapseInd ? (
        <>{children}</>
    ) : (
        <TooltipOverlay id={'moreOptions' + nanoid()} tooltipMessage={tooltipMessage}>
            <DropdownButton
                autoClose='outside'
                variant='outline-secondary'
                className={styles.more}
                size='sm'
                title={<MoreVertical size={21} />}
            >
                <Dropdown.Item as={'div'} className='d-flex border-0'>
                    {children}
                </Dropdown.Item>
            </DropdownButton>
        </TooltipOverlay>
    );
}

export default DropdownWrapper;
