import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { registerWithEmail } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";

import { registerUser } from "./registerUser";

vi.mock("@/features/auth/services/authService", () => ({
  registerWithEmail: vi.fn(),
}));

vi.mock("@/features/auth/utils/getThunkErrorMessage", () => ({
  getThunkErrorMessage: vi.fn(),
}));

const mockedRegisterWithEmail = vi.mocked(registerWithEmail);
const mockedGetThunkErrorMessage = vi.mocked(getThunkErrorMessage);

const createStore = () =>
  configureStore({
    reducer: () => ({}),
  });

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return fulfilled action when registration succeeds", async () => {
    const credentials = {
      name: "User",
      email: "user@example.com",
      password: "123456",
    };

    const serviceResponse = {
      user: {
        id: "user-1",
        email: "user@example.com",
        name: "User",
      },
      hasSession: true,
      message: "Cuenta creada correctamente.",
    };

    mockedRegisterWithEmail.mockResolvedValue(serviceResponse);

    const store = createStore();

    const action = await store.dispatch(registerUser(credentials));

    expect(mockedRegisterWithEmail).toHaveBeenCalledOnce();
    expect(mockedRegisterWithEmail).toHaveBeenCalledWith(credentials);

    if (!registerUser.fulfilled.match(action)) {
      throw new Error("Expected registerUser to be fulfilled");
    }

    expect(action.payload).toEqual(serviceResponse);
    expect(action.meta.requestStatus).toBe("fulfilled");
  });

  test("should return rejected action with formatted error when registration fails", async () => {
    const credentials = {
      name: "User",
      email: "user@example.com",
      password: "123456",
    };

    const serviceError = new Error("Email rate limit exceeded");

    const formattedError = "Supabase bloqueó temporalmente el envío de correos.";

    mockedRegisterWithEmail.mockRejectedValue(serviceError);
    mockedGetThunkErrorMessage.mockReturnValue(formattedError);

    const store = createStore();

    const action = await store.dispatch(registerUser(credentials));

    expect(mockedRegisterWithEmail).toHaveBeenCalledOnce();
    expect(mockedRegisterWithEmail).toHaveBeenCalledWith(credentials);

    expect(mockedGetThunkErrorMessage).toHaveBeenCalledWith(serviceError, "No se pudo crear la cuenta.");

    if (!registerUser.rejected.match(action)) {
      throw new Error("Expected registerUser to be rejected");
    }

    expect(action.payload).toBe(formattedError);
    expect(action.meta.requestStatus).toBe("rejected");
  });
});
