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
            {item.fields.map(({ fieldType, fieldValue }, ind) => {
                const displayVal =
                    fieldType === 'boolean'
                        ? fieldValue
                            ? t('true')
                            : t('false')
                        : fieldType === 'date'
                        ? dayjs(fieldValue as Date | string).format(
                              'HH:mm:ss, D MMM, YYYY'
                          )
                        : fieldValue;

                return <td key={ind}>{displayVal as string | number}</td>;
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