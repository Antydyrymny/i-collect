import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import apiSlice from '../../api';
import { AuthState } from '../../../../types';
import { authStateKey } from '../../../../data/localStorageKeys';
import { setTypedStorageItem } from '../../../../utils/typesLocalStorage';

const initialState: AuthState = { _id: null, admin: null, name: null, token: null };

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        storeAuth: (_state, action: PayloadAction<AuthState>) => action.payload,
        clearAuth: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(
                    apiSlice.endpoints.login.matchFulfilled,
                    apiSlice.endpoints.relog.matchFulfilled,
                    apiSlice.endpoints.register.matchFulfilled
                ),
                (_state, action) => {
                    setTypedStorageItem(authStateKey, action.payload, 'sessionStorage');
                    return action.payload;
                }
            )
            .addMatcher(apiSlice.endpoints.logout.matchFulfilled, clearAuthHelper)
            .addMatcher(apiSlice.endpoints.getUsers.matchFulfilled, (state, action) => {
                const returnedCurrentUser = action.payload.find(
                    (user) => user._id === state._id
                );
                if (returnedCurrentUser && returnedCurrentUser.status === 'blocked') {
                    return clearAuthHelper();
                } else if (returnedCurrentUser && !returnedCurrentUser.admin) {
                    const updatedUser = {
                        _id: returnedCurrentUser._id,
                        admin: false,
                        name: returnedCurrentUser.name,
                        token: state.token,
                    };
                    setTypedStorageItem(authStateKey, updatedUser, 'sessionStorage');
                    return updatedUser;
                }
            })
            .addMatcher(
                apiSlice.endpoints.toggleAdmins.matchFulfilled,
                (state, action) => {
                    if (
                        action.meta.arg.originalArgs.action === 'stripAdmin' &&
                        action.meta.arg.originalArgs.userIds.find(
                            (id) => id === state._id
                        )
                    ) {
                        const updatedUser: AuthState = {
                            ...state,
                            admin: false,
                        };
                        setTypedStorageItem(authStateKey, updatedUser, 'sessionStorage');
                        return updatedUser;
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.toggleBlock.matchFulfilled,
                (state, action) => {
                    if (
                        action.meta.arg.originalArgs.action === 'block' &&
                        action.meta.arg.originalArgs.userIds.find(
                            (id) => id === state._id
                        )
                    ) {
                        return clearAuthHelper();
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.deleteUsers.matchFulfilled,
                (state, action) => {
                    if (action.meta.arg.originalArgs.find((id) => id === state._id)) {
                        return clearAuthHelper();
                    }
                }
            );
    },
});

function clearAuthHelper() {
    window.sessionStorage.removeItem(authStateKey);
    return initialState;
}

export default authSlice.reducer;

export const { storeAuth, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;
