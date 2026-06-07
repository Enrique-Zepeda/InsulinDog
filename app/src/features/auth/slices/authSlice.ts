import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";

import {
  loginWithEmail,
  registerWithEmail,
  sendPasswordResetEmail,
  updatePassword,
  type AuthMessageResponse,
  type AuthUser,
  type ForgotPasswordCredentials,
  type LoginCredentials,
  type LoginResponse,
  type RegisterCredentials,
  type RegisterResponse,
  type UpdatePasswordCredentials,
} from "../services/authService";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  successMessage: null,
};

function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export const forgotPassword = createAsyncThunk<AuthMessageResponse, ForgotPasswordCredentials, { rejectValue: string }>(
  "auth/forgotPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      return await sendPasswordResetEmail(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "No se pudo enviar el correo de recuperación."));
    }
  },
);

export const resetPassword = createAsyncThunk<AuthMessageResponse, UpdatePasswordCredentials, { rejectValue: string }>(
  "auth/resetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      return await updatePassword(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "No se pudo actualizar la contraseña."));
    }
  },
);

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCredentials, { rejectValue: string }>(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await registerWithEmail(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "No se pudo crear la cuenta."));
    }
  },
);

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginWithEmail(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "No se pudo iniciar sesión."));
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthFeedback: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.hasSession;
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.hasSession;
        state.successMessage = null;
      })
      .addMatcher(isAnyOf(registerUser.pending, loginUser.pending), (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addMatcher(isAnyOf(registerUser.rejected, loginUser.rejected), (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Ocurrió un error inesperado.";
      })
      .addMatcher(
        isAnyOf(registerUser.pending, loginUser.pending, forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
          state.successMessage = null;
        },
      )
      .addMatcher(
        isAnyOf(registerUser.rejected, loginUser.rejected, forgotPassword.rejected, resetPassword.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload ?? "Ocurrió un error inesperado.";
        },
      )
      .addMatcher(isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled), (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      });
  },
});

export const { clearAuthFeedback } = authSlice.actions;

export default authSlice.reducer;
