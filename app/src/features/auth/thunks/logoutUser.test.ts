import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { logoutWithSupabase } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";

import { logoutUser } from "./logoutUser";

vi.mock("@/features/auth/services/authService", () => ({
  logoutWithSupabase: vi.fn(),
}));

vi.mock("@/features/auth/utils/getThunkErrorMessage", () => ({
  getThunkErrorMessage: vi.fn(),
}));

const mockedLogoutWithSupabase = vi.mocked(logoutWithSupabase);
const mockedGetThunkErrorMessage = vi.mocked(getThunkErrorMessage);

const createStore = () =>
  configureStore({
    reducer: () => ({}),
  });

describe("logoutUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return fulfilled action when logout succeeds", async () => {
    const serviceResponse = {
      message: "Sesión cerrada correctamente.",
    };

    mockedLogoutWithSupabase.mockResolvedValue(serviceResponse);

    const store = createStore();

    const action = await store.dispatch(logoutUser());

    expect(mockedLogoutWithSupabase).toHaveBeenCalledOnce();

    if (!logoutUser.fulfilled.match(action)) {
      throw new Error("Expected logoutUser to be fulfilled");
    }

    expect(action.payload).toEqual(serviceResponse);
    expect(action.meta.requestStatus).toBe("fulfilled");
  });

  test("should return rejected action with formatted error when logout fails", async () => {
    const serviceError = new Error("Supabase logout error");
    const formattedError = "No se pudo cerrar sesión.";

    mockedLogoutWithSupabase.mockRejectedValue(serviceError);
    mockedGetThunkErrorMessage.mockReturnValue(formattedError);

    const store = createStore();

    const action = await store.dispatch(logoutUser());

    expect(mockedLogoutWithSupabase).toHaveBeenCalledOnce();

    expect(mockedGetThunkErrorMessage).toHaveBeenCalledWith(serviceError, "No se pudo cerrar sesión.");

    if (!logoutUser.rejected.match(action)) {
      throw new Error("Expected logoutUser to be rejected");
    }

    expect(action.payload).toBe(formattedError);
    expect(action.meta.requestStatus).toBe("rejected");
  });
});
