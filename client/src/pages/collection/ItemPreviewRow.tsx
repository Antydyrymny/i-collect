import { Button } from 'react-bootstrap';
import { ClientRoutes, ItemPreview } from '../../types';
import dayjs from 'dayjs';
import { DeleteButton } from '../../components';
import { useDeleteItemMutation } from '../../app/services/api';
import { useInformOfError } from '../../hooks';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../../contexts/locale';

type ItemPreviewProps = {
    item: ItemPreview;
    allowEdit: boolean;
    collectionId: string;
};

function ItemPreviewRow({ item, allowEdit, collectionId }: ItemPreviewProps) {
    const isValidDate = (dateString: Date | string) => {
        const parsedDate = dayjs(dateString);
        return parsedDate.isValid() ? parsedDate : false;
    };
    const formatDate = (date: dayjs.Dayjs) => date.format('HH:mm:ss, D MMM, YYYY');

    const [deleteItem, deleteOptions] = useDeleteItemMutation();

    const handleDelete = useCallback(() => {
        if (deleteOptions.isLoading) return;
        deleteItem({ itemToDeleteId: item._id, collectionId: collectionId });
    }, [collectionId, deleteItem, deleteOptions.isLoading, item._id]);

    useInformOfError({ isError: deleteOptions.isError, error: deleteOptions.error });

    const t = useLocale('collectionPage');

    return (
        <tr>
            <td>{item.name}</td>
            <td>
                {item.tags.slice(0, 3).map((tag, ind) => (
                    <span
                        key={ind}
                        className='badge border border-primary text-primary rounded-5 me-1'
                    >
                        {tag}
                    </span>
                ))}
                {!item.tags.length && '-'}
                {item.tags.length > 3 ? '...' : ''}
            </td>
            {item.fields.map((field, ind) => {
                const val = Object.values(field)[0];
                let displayVal;
                switch (typeof val) {
                    case 'boolean':
                        displayVal = val ? t('true') : t('false');
                        break;
                    case 'object': {
                        const parsedDate = isValidDate(val);
                        displayVal = parsedDate
                            ? formatDate(parsedDate)
                            : val.toISOString();
                        break;
                    }
                    case 'string': {
                        const parsedDate = isValidDate(val);
                        displayVal = parsedDate ? formatDate(parsedDate) : val;
                        break;
                    }
                    default:
                        displayVal = val;
                        break;
                }
                return <td key={ind}>{displayVal}</td>;
            })}
            {allowEdit && (
                <td>
                    <DeleteButton
                        handleDelete={handleDelete}
                        disabled={deleteOptions.isLoading}
                        isLoading={deleteOptions.isLoading}
                        tooltipMsg={t('deleteItem')}
                        outline
                        sm
                    />
                </td>
            )}
            <td className='text-center'>
                <Link to={ClientRoutes.ItemPath + item._id} className='text-nowrap'>
                    <Button size='sm' variant='outline-primary'>
                        {t('toItem')}
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

export default ItemPreviewRow;
