import { describe, expect, test } from "vitest";

import authReducer, { clearAuthFeedback, clearAuthState, setAuthSession } from "./authSlice";

import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword } from "@/features/auth/thunks";

import type { AuthUser } from "@/features/auth/types/auth.types";

const createAuthUser = (): AuthUser =>
  ({
    id: "user-1",
    email: "edgar@example.com",
  }) as AuthUser;

const getInitialState = () => authReducer(undefined, { type: "@@INIT" });

type AuthState = ReturnType<typeof getInitialState>;

const createState = (overrides: Partial<AuthState> = {}): AuthState => ({
  ...getInitialState(),
  ...overrides,
});

describe("authSlice", () => {
  test("should return the initial state", () => {
    expect(getInitialState()).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingSession: true,
      error: null,
      successMessage: null,
    });
  });

  test("should clear auth feedback", () => {
    const state = createState({
      error: "Error anterior",
      successMessage: "Operación exitosa",
    });

    const nextState = authReducer(state, clearAuthFeedback());

    expect(nextState.error).toBeNull();
    expect(nextState.successMessage).toBeNull();
  });

  test("should set auth session when user exists", () => {
    const user = createAuthUser();

    const nextState = authReducer(undefined, setAuthSession(user));

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.isCheckingSession).toBe(false);
  });

  test("should clear auth session when user is null", () => {
    const state = createState({
      user: createAuthUser(),
      isAuthenticated: true,
      isCheckingSession: true,
    });

    const nextState = authReducer(state, setAuthSession(null));

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isCheckingSession).toBe(false);
  });

  test("should clear auth state", () => {
    const state = createState({
      user: createAuthUser(),
      isAuthenticated: true,
      isLoading: true,
      isCheckingSession: true,
      error: "Error",
      successMessage: "Success",
    });

    const nextState = authReducer(state, clearAuthState());

    expect(nextState).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingSession: false,
      error: null,
      successMessage: null,
    });
  });

  test("should handle registerUser.fulfilled", () => {
    const user = createAuthUser();

    const nextState = authReducer(createState({ isLoading: true }), {
      type: registerUser.fulfilled.type,
      payload: {
        user,
        hasSession: true,
        message: "Registro exitoso.",
      },
    });

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.successMessage).toBe("Registro exitoso.");
  });

  test("should handle loginUser.fulfilled", () => {
    const user = createAuthUser();

    const nextState = authReducer(
      createState({
        isLoading: true,
        successMessage: "Mensaje anterior",
      }),
      {
        type: loginUser.fulfilled.type,
        payload: {
          user,
          hasSession: true,
        },
      },
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.successMessage).toBeNull();
  });

  test("should handle logoutUser.fulfilled", () => {
    const state = createState({
      user: createAuthUser(),
      isAuthenticated: true,
      isLoading: true,
      isCheckingSession: false,
      error: "Error anterior",
      successMessage: "Mensaje anterior",
    });

    const nextState = authReducer(state, {
      type: logoutUser.fulfilled.type,
    });

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.successMessage).toBeNull();
  });

  test("should handle forgotPassword.fulfilled and resetPassword.fulfilled", () => {
    const fulfilledActions = [forgotPassword.fulfilled.type, resetPassword.fulfilled.type];

    for (const type of fulfilledActions) {
      const nextState = authReducer(
        createState({
          isLoading: true,
          error: "Error anterior",
        }),
        {
          type,
          payload: {
            message: "Operación completada.",
          },
        },
      );

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBeNull();
      expect(nextState.successMessage).toBe("Operación completada.");
    }
  });

  test("should handle pending auth actions", () => {
    const pendingActions = [
      registerUser.pending.type,
      loginUser.pending.type,
      forgotPassword.pending.type,
      resetPassword.pending.type,
      logoutUser.pending.type,
    ];

    for (const type of pendingActions) {
      const nextState = authReducer(
        createState({
          isLoading: false,
          error: "Error anterior",
          successMessage: "Mensaje anterior",
        }),
        { type },
      );

      expect(nextState.isLoading).toBe(true);
      expect(nextState.error).toBeNull();
      expect(nextState.successMessage).toBeNull();
    }
  });

  test("should handle rejected auth actions with payload error", () => {
    const rejectedActions = [
      registerUser.rejected.type,
      loginUser.rejected.type,
      forgotPassword.rejected.type,
      resetPassword.rejected.type,
      logoutUser.rejected.type,
    ];

    for (const type of rejectedActions) {
      const nextState = authReducer(
        createState({
          isLoading: true,
        }),
        {
          type,
          payload: "Credenciales inválidas.",
        },
      );

      expect(nextState.isLoading).toBe(false);
      expect(nextState.error).toBe("Credenciales inválidas.");
    }
  });

  test("should handle rejected auth actions without payload error", () => {
    const nextState = authReducer(
      createState({
        isLoading: true,
      }),
      {
        type: loginUser.rejected.type,
      },
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe("Ocurrió un error inesperado.");
  });
});
