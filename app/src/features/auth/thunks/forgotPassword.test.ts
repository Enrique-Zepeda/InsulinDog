import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { sendPasswordResetEmail } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";

import { forgotPassword } from "./forgotPassword";

vi.mock("@/features/auth/services/authService", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("@/features/auth/utils/getThunkErrorMessage", () => ({
  getThunkErrorMessage: vi.fn(),
}));

const mockedSendPasswordResetEmail = vi.mocked(sendPasswordResetEmail);
const mockedGetThunkErrorMessage = vi.mocked(getThunkErrorMessage);

const createStore = () =>
  configureStore({
    reducer: () => ({}),
  });

describe("forgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return fulfilled action when reset email is sent successfully", async () => {
    const credentials = {
      email: "user@example.com",
    };

    const serviceResponse = {
      message: "Revisa tu correo para restablecer tu contraseña.",
    };

    mockedSendPasswordResetEmail.mockResolvedValue(serviceResponse);

    const store = createStore();

    const action = await store.dispatch(forgotPassword(credentials));

    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith(credentials);

    expect(forgotPassword.fulfilled.match(action)).toBe(true);
    expect(action.payload).toEqual(serviceResponse);
  });

  test("should return rejected action when service fails", async () => {
    const credentials = {
      email: "user@example.com",
    };

    const serviceError = new Error("Supabase error");
    const formattedError = "No se pudo enviar el correo.";

    mockedSendPasswordResetEmail.mockRejectedValue(serviceError);
    mockedGetThunkErrorMessage.mockReturnValue(formattedError);

    const store = createStore();

    const action = await store.dispatch(forgotPassword(credentials));

    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith(credentials);

    expect(mockedGetThunkErrorMessage).toHaveBeenCalledWith(
      serviceError,
      "No se pudo enviar el correo de recuperación.",
    );

    if (!forgotPassword.rejected.match(action)) {
      throw new Error("Expected forgotPassword to be rejected");
    }

    expect(action.payload).toBe(formattedError);
    expect(action.meta.requestStatus).toBe("rejected");
  });
});
