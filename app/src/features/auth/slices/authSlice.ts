import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  registerWithEmail,
  type AuthUser,
  type RegisterCredentials,
  type RegisterResponse,
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

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCredentials, { rejectValue: string }>(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await registerWithEmail(credentials);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("No se pudo crear la cuenta.");
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.hasSession;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "No se pudo crear la cuenta.";
      });
  },
});

export const { clearAuthFeedback } = authSlice.actions;

export default authSlice.reducer;
