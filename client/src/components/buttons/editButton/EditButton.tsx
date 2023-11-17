import { Button, Image } from 'react-bootstrap';
import { useThemeContext } from '../../../contexts/theme';
import edit from '../../../assets/edit.png';
import editDark from '../../../assets/edit-dark.png';

type EditButtonProps = {
    editing: boolean;
    startEditing: () => void;
    cancelEdit: () => void;
    startEditMsg: string;
    cancelEditMsg: string;
};

function EditButton({
    editing,
    startEditing,
    startEditMsg,
    cancelEdit,
    cancelEditMsg,
}: EditButtonProps) {
    const { theme } = useThemeContext();

    return (
        <Button onClick={editing ? cancelEdit : startEditing} className='text-nowrap'>
            <Image src={theme === 'light' ? edit : editDark} className='me-2' />
            {editing ? cancelEditMsg : startEditMsg}
        </Button>
    );
}

export default EditButton;
