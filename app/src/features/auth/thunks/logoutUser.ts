import { createAsyncThunk } from "@reduxjs/toolkit";

import { logoutWithSupabase } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";
import type { AuthMessageResponse } from "../types/auth.types";

export const logoutUser = createAsyncThunk<AuthMessageResponse, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      return await logoutWithSupabase();
    } catch (error) {
      return rejectWithValue(getThunkErrorMessage(error, "No se pudo cerrar sesión."));
    }
  },
);
