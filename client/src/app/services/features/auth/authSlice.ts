import { createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import apiSlice from '../../api';
import { AuthState, RefreshResponse } from '../../../../types';

const initialState: AuthState = {
    _id: null,
    admin: null,
    name: null,
    token: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateJWT: (state, action: PayloadAction<RefreshResponse>) => ({
            ...state,
            token: action.payload.token,
        }),
        clearAuth: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                isAnyOf(
                    apiSlice.endpoints.login.matchFulfilled,
                    apiSlice.endpoints.register.matchFulfilled
                ),
                (_state, action) => {
                    return action.payload;
                }
            )
            .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (_state, action) => {
                if (action.meta.arg.originalArgs !== 'statusOffline') return initialState;
            })
            .addMatcher(apiSlice.endpoints.getUsers.matchFulfilled, (state, action) => {
                const returnedCurrentUser = action.payload.find(
                    (user) => user._id === state._id
                );
                if (returnedCurrentUser && returnedCurrentUser.status === 'blocked') {
                    return initialState;
                } else if (returnedCurrentUser && !returnedCurrentUser.admin) {
                    const updatedUser: AuthState = {
                        _id: returnedCurrentUser._id,
                        admin: false,
                        name: returnedCurrentUser.name,
                        token: state.token,
                        refreshToken: state.refreshToken,
                    };
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
                        return initialState;
                    }
                }
            )
            .addMatcher(
                apiSlice.endpoints.deleteUsers.matchFulfilled,
                (state, action) => {
                    if (action.meta.arg.originalArgs.find((id) => id === state._id)) {
                        return initialState;
                    }
                }
            );
    },
});

export default authSlice.reducer;

export const { updateJWT, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth;
