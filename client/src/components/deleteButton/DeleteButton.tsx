import { TooltipOverlay } from '..';
import { Button, Spinner, Image } from 'react-bootstrap';
import trash from '../../assets/deleteUser.png';
import trashDark from '../../assets/deleteUser-dark.png';
import { useThemeContext } from '../../contexts/theme';

type DeleteButtonOptions = {
    handleDelete: () => void;
    disabled: boolean;
    isLoading: boolean;
    tooltipMsg: string;
    outline?: boolean;
};
function DeleteButton({
    handleDelete,
    disabled,
    isLoading,
    tooltipMsg,
    outline = false,
}: DeleteButtonOptions) {
    const { theme } = useThemeContext();

    return (
        <TooltipOverlay id='delete' tooltipMessage={tooltipMsg}>
            <Button
                disabled={disabled}
                onClick={handleDelete}
                variant={outline ? 'outline-danger' : 'danger'}
                className='d-flex justify-content-center align-items-center'
            >
                {isLoading ? (
                    <Spinner size='sm' />
                ) : (
                    <Image src={theme === 'light' ? trash : trashDark} />
                )}
            </Button>
        </TooltipOverlay>
    );
}

export default DeleteButton;
