import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { updatePassword } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";

import { resetPassword } from "./resetPassword";

vi.mock("@/features/auth/services/authService", () => ({
  updatePassword: vi.fn(),
}));

vi.mock("@/features/auth/utils/getThunkErrorMessage", () => ({
  getThunkErrorMessage: vi.fn(),
}));

const mockedUpdatePassword = vi.mocked(updatePassword);
const mockedGetThunkErrorMessage = vi.mocked(getThunkErrorMessage);

const createStore = () =>
  configureStore({
    reducer: () => ({}),
  });

describe("resetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return fulfilled action when password update succeeds", async () => {
    const credentials = {
      password: "newPassword123",
    };

    const serviceResponse = {
      message: "Contraseña actualizada correctamente.",
    };

    mockedUpdatePassword.mockResolvedValue(serviceResponse);

    const store = createStore();

    const action = await store.dispatch(resetPassword(credentials));

    expect(mockedUpdatePassword).toHaveBeenCalledOnce();
    expect(mockedUpdatePassword).toHaveBeenCalledWith(credentials);

    if (!resetPassword.fulfilled.match(action)) {
      throw new Error("Expected resetPassword to be fulfilled");
    }

    expect(action.payload).toEqual(serviceResponse);
    expect(action.meta.requestStatus).toBe("fulfilled");
  });

  test("should return rejected action with formatted error when password update fails", async () => {
    const credentials = {
      password: "newPassword123",
    };

    const serviceError = new Error("Supabase update password error");
    const formattedError = "No se pudo actualizar la contraseña.";

    mockedUpdatePassword.mockRejectedValue(serviceError);
    mockedGetThunkErrorMessage.mockReturnValue(formattedError);

    const store = createStore();

    const action = await store.dispatch(resetPassword(credentials));

    expect(mockedUpdatePassword).toHaveBeenCalledOnce();
    expect(mockedUpdatePassword).toHaveBeenCalledWith(credentials);

    expect(mockedGetThunkErrorMessage).toHaveBeenCalledWith(serviceError, "No se pudo actualizar la contraseña.");

    if (!resetPassword.rejected.match(action)) {
      throw new Error("Expected resetPassword to be rejected");
    }

    expect(action.payload).toBe(formattedError);
    expect(action.meta.requestStatus).toBe("rejected");
  });
});
