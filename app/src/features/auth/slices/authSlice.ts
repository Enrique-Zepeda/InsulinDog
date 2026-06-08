import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";

import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword } from "@/features/auth/thunks";

import type { AuthUser } from "@/features/auth/types/auth.types";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingSession: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingSession: true,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },

    setAuthSession: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.isCheckingSession = false;
    },

    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.isCheckingSession = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.hasSession;
        state.successMessage = action.payload.message;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.hasSession;
        state.successMessage = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.successMessage = null;
      })

      .addMatcher(isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled), (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })

      .addMatcher(
        isAnyOf(
          registerUser.pending,
          loginUser.pending,
          forgotPassword.pending,
          resetPassword.pending,
          logoutUser.pending,
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.successMessage = null;
        },
      )

      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          forgotPassword.rejected,
          resetPassword.rejected,
          logoutUser.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload ?? "Ocurrió un error inesperado.";
        },
      );
  },
});

export const { clearAuthFeedback, setAuthSession, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
