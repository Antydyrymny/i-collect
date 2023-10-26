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
        clearAuth: () => {
            window.localStorage.removeItem(authStateKey);
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(
                    apiSlice.endpoints.login.matchFulfilled,
                    apiSlice.endpoints.register.matchFulfilled
                ),
                (_state, action) => {
                    setTypedStorageItem(authStateKey, action.payload);
                    return action.payload;
                }
            )
            .addMatcher(apiSlice.endpoints.getUsers.matchFulfilled, (state, action) => {
                const returnedCurrentUser = action.payload.find(
                    (user) => user._id === state._id
                );
                if (!returnedCurrentUser || returnedCurrentUser.status === 'blocked') {
                    window.localStorage.removeItem(authStateKey);
                    return initialState;
                } else if (!returnedCurrentUser.admin) {
                    const updatedUser = {
                        _id: returnedCurrentUser._id,
                        admin: false,
                        name: returnedCurrentUser.name,
                        token: state.token,
                    };
                    setTypedStorageItem(authStateKey, updatedUser);
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
                        setTypedStorageItem(authStateKey, updatedUser);
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
                        window.localStorage.removeItem(authStateKey);
                        return initialState;
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.deleteUsers.matchFulfilled,
                (state, action) => {
                    if (action.meta.arg.originalArgs.find((id) => id === state._id)) {
                        window.localStorage.removeItem(authStateKey);
                        return initialState;
                    }
                }
            );
    },
});

export default authSlice.reducer;

export const { storeAuth, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;
