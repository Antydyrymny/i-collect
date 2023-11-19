import { Button, Image } from 'react-bootstrap';
import { useThemeContext } from '../../../contexts/theme';
import edit from '../../../assets/edit.png';
import editDark from '../../../assets/edit-dark.png';
import { TooltipOverlay } from '../..';
import { nanoid } from '@reduxjs/toolkit';

type EditButtonProps = {
    editing: boolean;
    startEditing: () => void;
    cancelEdit: () => void;
    startEditMsg: string;
    cancelEditMsg: string;
    sm?: boolean;
    outline?: boolean;
};

function EditButton({
    editing,
    startEditing,
    startEditMsg,
    cancelEdit,
    cancelEditMsg,
    sm = false,
    outline = false,
}: EditButtonProps) {
    const { theme } = useThemeContext();
    const textContent = editing ? cancelEditMsg : startEditMsg;

    const Wrapper = ({ children }: { children: JSX.Element }) =>
        sm ? (
            <TooltipOverlay id={'editButton' + nanoid()} tooltipMessage={textContent}>
                {children}
            </TooltipOverlay>
        ) : (
            <>{children}</>
        );
    return (
        <Wrapper>
            <Button
                onClick={editing ? cancelEdit : startEditing}
                size={sm ? 'sm' : undefined}
                className='text-nowrap d-flex align-items-center justify-content-center gap-2'
                variant={outline ? 'outline-primary' : 'primary'}
            >
                <Image src={theme === 'light' ? edit : editDark} />
                {!sm && <span>{textContent}</span>}
            </Button>
        </Wrapper>
    );
}

export default EditButton;
