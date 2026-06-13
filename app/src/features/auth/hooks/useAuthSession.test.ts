import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { clearAuthState, setAuthSession } from "@/features/auth/slices/authSlice";

import { useAuthSession } from "./useAuthSession";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
  unsubscribe: vi.fn(),
  mapUser: vi.fn(),
}));

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => mocks.dispatch,
}));

vi.mock("@/shared/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mocks.getSession,
      onAuthStateChange: mocks.onAuthStateChange,
    },
  },
}));

vi.mock("@/features/auth/mappers/authMapper", () => ({
  mapSupabaseUserToAuthUser: mocks.mapUser,
}));

type AuthStateChangeCallback = (event: string, session: { user: unknown } | null) => void;

describe("useAuthSession", () => {
  let authStateChangeCallback: AuthStateChangeCallback;

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getSession.mockResolvedValue({
      data: {
        session: null,
      },
      error: null,
    });

    mocks.onAuthStateChange.mockImplementation((callback: AuthStateChangeCallback) => {
      authStateChangeCallback = callback;

      return {
        data: {
          subscription: {
            unsubscribe: mocks.unsubscribe,
          },
        },
      };
    });
  });

  test("should load and dispatch the current authenticated user", async () => {
    const supabaseUser = {
      id: "supabase-user-1",
      email: "user@example.com",
    };

    const authUser = {
      id: "supabase-user-1",
      email: "user@example.com",
      name: "user",
    };

    mocks.getSession.mockResolvedValue({
      data: {
        session: {
          user: supabaseUser,
        },
      },
      error: null,
    });

    mocks.mapUser.mockReturnValue(authUser);

    renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(mocks.mapUser).toHaveBeenCalledWith(supabaseUser);
    });

    expect(mocks.dispatch).toHaveBeenCalledWith(setAuthSession(authUser));
  });

  test("should dispatch a null session when there is no authenticated user", async () => {
    renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalledWith(setAuthSession(null));
    });

    expect(mocks.mapUser).not.toHaveBeenCalled();
  });

  test("should clear auth state when getSession returns an error", async () => {
    mocks.getSession.mockResolvedValue({
      data: {
        session: null,
      },
      error: new Error("Could not load session"),
    });

    renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalledWith(clearAuthState());
    });

    expect(mocks.mapUser).not.toHaveBeenCalled();
  });

  test("should update auth state when Supabase reports a signed-in user", async () => {
    const supabaseUser = {
      id: "supabase-user-1",
      email: "user@example.com",
    };

    const authUser = {
      id: "supabase-user-1",
      email: "user@example.com",
      name: "user",
    };

    mocks.mapUser.mockReturnValue(authUser);

    renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(mocks.onAuthStateChange).toHaveBeenCalledOnce();
    });

    mocks.dispatch.mockClear();

    act(() => {
      authStateChangeCallback("SIGNED_IN", {
        user: supabaseUser,
      });
    });

    expect(mocks.mapUser).toHaveBeenCalledWith(supabaseUser);
    expect(mocks.dispatch).toHaveBeenCalledWith(setAuthSession(authUser));
  });

  test("should clear the session when Supabase reports a signed-out user", async () => {
    renderHook(() => useAuthSession());

    await waitFor(() => {
      expect(mocks.onAuthStateChange).toHaveBeenCalledOnce();
    });

    mocks.dispatch.mockClear();

    act(() => {
      authStateChangeCallback("SIGNED_OUT", null);
    });

    expect(mocks.dispatch).toHaveBeenCalledWith(setAuthSession(null));
  });

  test("should unsubscribe from auth changes when the hook unmounts", () => {
    const { unmount } = renderHook(() => useAuthSession());

    expect(mocks.onAuthStateChange).toHaveBeenCalledOnce();

    unmount();

    expect(mocks.unsubscribe).toHaveBeenCalledOnce();
  });
});
