import { useAppSelector } from '../../../storeHooks';
import { selectCurrentUser } from '.';

export const useSelectUser = () => useAppSelector(selectCurrentUser);
