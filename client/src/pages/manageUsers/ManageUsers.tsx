import { useState, useCallback } from 'react';
import { useSelectUser } from '../../app/services/features/auth';
import {
    useCountUserPagesQuery,
    useGetUsersQuery,
    useSubscribeToUsersQuery,
    useToggleBlockMutation,
    useToggleAdminsMutation,
    useDeleteUsersMutation,
} from '../../app/services/api';
import { useInformOfError } from '../../hooks';
import { usePagination } from '../../hooks/usePagination';
import PaginationUI from '../../components/pagination/PaginationUI';
import { useLocale } from '../../contexts/locale';
import { useThemeContext } from '../../contexts/theme';
import block from '../../assets/block.png';
import blockDark from '../../assets/block-dark.png';
import unblock from '../../assets/unblock.png';
import unblockDark from '../../assets/unblock-dark.png';
import admin from '../../assets/admin.png';
import adminDark from '../../assets/admin-dark.png';
import stripAdmin from '../../assets/stripAdmin.png';
import stripAdminDark from '../../assets/stripAdmin-dark.png';
import trash from '../../assets/deleteUser.png';
import trashDark from '../../assets/deleteUser-dark.png';
import { Container, Button, Row, Image, Spinner, ButtonToolbar } from 'react-bootstrap';
import UserTable from './UserTable';

function ManageUsers() {
    const authUser = useSelectUser();
    useSubscribeToUsersQuery(authUser._id!);

    const t = useLocale('manageUsers');
    const { theme } = useThemeContext();

    const { data: pages, ...countPagesUtils } = useCountUserPagesQuery();

    const { curPage } = usePagination(pages || 1);
    const {
        data: users = [],
        isLoading,
        isFetching,
        isError,
        error,
    } = useGetUsersQuery({ page: curPage }, { skip: !countPagesUtils.isSuccess });

    useInformOfError([
        { isError, error },
        { isError: countPagesUtils.isError, error: countPagesUtils.error },
    ]);

    const [selected, setSelected] = useState<string[]>([]);
    const handleSelectOne = useCallback(
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) setSelected([...selected, id]);
            else setSelected(selected.filter((selectedId) => selectedId !== id));
        },
        [selected]
    );
    const handleSelectAll = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) setSelected(users.map((user) => user._id));
            else setSelected([]);
        },
        [users]
    );

    const [toggleBlock, blockUtils] = useToggleBlockMutation();
    const [toggleAdmin, adminUtils] = useToggleAdminsMutation();
    const [deleteUsers, deleteUtils] = useDeleteUsersMutation();

    const allowChanges =
        !isFetching &&
        !blockUtils.isLoading &&
        !adminUtils.isLoading &&
        !deleteUtils.isLoading;

    const handleAllocatingRights = useCallback(
        async (action: 'block' | 'admin', grantRights: boolean) => {
            const idsForRequest = selected.filter((userId) => {
                const userToFilter = users.find((user) => user._id === userId);
                if (action === 'block') {
                    return grantRights
                        ? userToFilter?.status === 'blocked'
                        : userToFilter?.status !== 'blocked';
                } else {
                    return grantRights ? !userToFilter?.admin : userToFilter?.admin;
                }
            });
            if (!idsForRequest.length) {
                setSelected([]);
                return;
            }
            if (action === 'block')
                await toggleBlock({
                    action: grantRights ? 'unblock' : 'block',
                    userIds: idsForRequest,
                });
            else
                await toggleAdmin({
                    action: grantRights ? 'makeAdmin' : 'stripAdmin',
                    userIds: idsForRequest,
                });
            setSelected([]);
        },
        [selected, users, toggleAdmin, toggleBlock]
    );

    const handleDeleteUsers = useCallback(async () => {
        await deleteUsers(selected);
        setSelected([]);
    }, [selected, deleteUsers]);

    return (
        <Container className='mt-5'>
            <Row className='mb-3 '>
                <ButtonToolbar className='gap-2'>
                    <ButtonToolbar className='gap-2'>
                        <Button
                            disabled={!allowChanges}
                            onClick={() => handleAllocatingRights('block', false)}
                            variant='outline-primary'
                            className='d-flex justify-content-center align-items-center gap-1'
                        >
                            {blockUtils.isLoading &&
                            blockUtils.originalArgs?.action === 'block' ? (
                                <Spinner size='sm' />
                            ) : (
                                <Image src={theme === 'light' ? block : blockDark} />
                            )}
                            {t('block')}
                        </Button>
                        <Button
                            disabled={!allowChanges}
                            onClick={() => handleAllocatingRights('block', true)}
                            variant='outline-primary'
                            className='me-3 d-flex justify-content-center align-items-center gap-1'
                        >
                            {blockUtils.isLoading &&
                            blockUtils.originalArgs?.action === 'unblock' ? (
                                <Spinner size='sm' />
                            ) : (
                                <Image src={theme === 'light' ? unblock : unblockDark} />
                            )}
                        </Button>
                    </ButtonToolbar>
                    <ButtonToolbar className='gap-2'>
                        <Button
                            disabled={!allowChanges}
                            onClick={() => handleAllocatingRights('admin', true)}
                            variant='outline-primary'
                            className='d-flex justify-content-center align-items-center gap-1'
                        >
                            {adminUtils.isLoading &&
                            adminUtils.originalArgs?.action === 'makeAdmin' ? (
                                <Spinner size='sm' />
                            ) : (
                                <Image src={theme === 'light' ? admin : adminDark} />
                            )}
                            {t('admin')}
                        </Button>
                        <Button
                            disabled={!allowChanges}
                            onClick={() => handleAllocatingRights('admin', false)}
                            variant='outline-primary'
                            className='me-lg-3 d-flex justify-content-center align-items-center gap-1'
                        >
                            {adminUtils.isLoading &&
                            adminUtils.originalArgs?.action === 'stripAdmin' ? (
                                <Spinner size='sm' />
                            ) : (
                                <Image
                                    src={theme === 'light' ? stripAdmin : stripAdminDark}
                                />
                            )}
                        </Button>
                        <Button
                            disabled={!allowChanges}
                            onClick={handleDeleteUsers}
                            variant='danger'
                            className='me-lg-3 d-flex justify-content-center align-items-center gap-1'
                        >
                            {deleteUtils.isLoading ? (
                                <Spinner size='sm' />
                            ) : (
                                <Image src={theme === 'light' ? trash : trashDark} />
                            )}
                        </Button>
                    </ButtonToolbar>
                    {isFetching && (
                        <div className='d-none d-md-flex align-items-center'>
                            <Spinner />
                        </div>
                    )}
                </ButtonToolbar>
            </Row>
            <Row>
                {isLoading && (
                    <Container className='mt-5 d-flex justify-content-center align-items-center'>
                        <Spinner className='mt-5' />
                    </Container>
                )}
                {!isLoading && (
                    <UserTable
                        users={users}
                        selected={selected}
                        allowChanges={allowChanges}
                        handleSelectOne={handleSelectOne}
                        handleSelectAll={handleSelectAll}
                    />
                )}
            </Row>
            <Row>
                <Container className='d-flex justify-content-center'>
                    <PaginationUI pages={pages || 1} />
                </Container>
            </Row>
        </Container>
    );
}

export default ManageUsers;
