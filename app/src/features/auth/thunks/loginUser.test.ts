import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { loginWithEmail } from "@/features/auth/services/authService";
import { getThunkErrorMessage } from "@/features/auth/utils/getThunkErrorMessage";

import { loginUser } from "./loginUser";

vi.mock("@/features/auth/services/authService", () => ({
  loginWithEmail: vi.fn(),
}));

vi.mock("@/features/auth/utils/getThunkErrorMessage", () => ({
  getThunkErrorMessage: vi.fn(),
}));

const mockedLoginWithEmail = vi.mocked(loginWithEmail);
const mockedGetThunkErrorMessage = vi.mocked(getThunkErrorMessage);

const createStore = () =>
  configureStore({
    reducer: () => ({}),
  });

describe("loginUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should return fulfilled action when login succeeds", async () => {
    const credentials = {
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
    };

    mockedLoginWithEmail.mockResolvedValue(serviceResponse);

    const store = createStore();

    const action = await store.dispatch(loginUser(credentials));

    expect(mockedLoginWithEmail).toHaveBeenCalledWith(credentials);

    if (!loginUser.fulfilled.match(action)) {
      throw new Error("Expected loginUser to be fulfilled");
    }

    expect(action.payload).toEqual(serviceResponse);
    expect(action.meta.requestStatus).toBe("fulfilled");
  });

  test("should return rejected action with formatted error when login fails", async () => {
    const credentials = {
      email: "user@example.com",
      password: "wrong-password",
    };

    const serviceError = new Error("Invalid login credentials");
    const formattedError = "Correo o contraseña incorrectos.";

    mockedLoginWithEmail.mockRejectedValue(serviceError);
    mockedGetThunkErrorMessage.mockReturnValue(formattedError);

    const store = createStore();

    const action = await store.dispatch(loginUser(credentials));

    expect(mockedLoginWithEmail).toHaveBeenCalledWith(credentials);

    expect(mockedGetThunkErrorMessage).toHaveBeenCalledWith(serviceError, "No se pudo iniciar sesión.");

    if (!loginUser.rejected.match(action)) {
      throw new Error("Expected loginUser to be rejected");
    }

    expect(action.payload).toBe(formattedError);
    expect(action.meta.requestStatus).toBe("rejected");
  });
});
