import { Image, ToggleButton } from 'react-bootstrap';
import { useThemeContext } from '../../../contexts/theme';
import edit from '../../../assets/edit.png';
import editDark from '../../../assets/edit-dark.png';
import { TooltipOverlay } from '../..';
import { nanoid } from '@reduxjs/toolkit';
import { memo } from 'react';

type EditButtonProps = {
    editing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    startEditMsg: string;
    cancelEditMsg: string;
    sm?: boolean;
};

const Wrapper = memo(function Wrapper({
    children,
    id,
    sm,
    tooltipMessage,
}: {
    children: JSX.Element;
    id: string;
    sm: boolean;
    tooltipMessage: string;
}) {
    return sm ? (
        <TooltipOverlay id={id} tooltipMessage={tooltipMessage}>
            {children}
        </TooltipOverlay>
    ) : (
        <div id={'tooltip' + id}>{children}</div>
    );
});

const EditButton = memo(function EditButton({
    editing,
    onChange,
    startEditMsg,
    cancelEditMsg,
    sm = false,
}: EditButtonProps) {
    const { theme } = useThemeContext();
    const textContent = editing ? cancelEditMsg : startEditMsg;

    const id = 'editButton' + nanoid();
    return (
        <Wrapper id={id} tooltipMessage={textContent} sm={sm}>
            <ToggleButton
                id={id}
                type='checkbox'
                value={'1'}
                checked={editing}
                onChange={onChange}
                size={sm ? 'sm' : undefined}
                className='text-nowrap d-flex align-items-center justify-content-center gap-2'
                variant='outline-primary'
            >
                <Image src={theme === 'light' ? edit : editDark} />
                {!sm && <span>{textContent}</span>}
            </ToggleButton>
        </Wrapper>
    );
});

export default EditButton;
