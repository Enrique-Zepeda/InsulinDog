import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { PATHS } from "@/app/router/paths";

import { useLogout } from "./useLogout";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  logoutUser: vi.fn(),
  unwrap: vi.fn(),

  authState: {
    isLoading: false,
  },
}));

vi.mock("@/app/store/hooks", () => ({
  useAppDispatch: () => mocks.dispatch,

  useAppSelector: (selector: (state: { auth: typeof mocks.authState }) => unknown) =>
    selector({
      auth: mocks.authState,
    }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("@/features/auth/thunks", () => ({
  logoutUser: mocks.logoutUser,
}));

describe("useLogout", () => {
  const logoutAction = {
    type: "auth/logoutUser",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.authState.isLoading = false;

    mocks.logoutUser.mockReturnValue(logoutAction);
    mocks.unwrap.mockResolvedValue(undefined);

    mocks.dispatch.mockImplementation((action) => {
      if (action === logoutAction) {
        return {
          unwrap: mocks.unwrap,
        };
      }

      return action;
    });
  });

  test("should return isLoading from Redux", () => {
    mocks.authState.isLoading = true;

    const { result } = renderHook(() => useLogout());

    expect(result.current.isLoading).toBe(true);
  });

  test("should dispatch logoutUser and navigate to login after success", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(mocks.logoutUser).toHaveBeenCalledOnce();

    expect(mocks.dispatch).toHaveBeenCalledWith(logoutAction);

    expect(mocks.unwrap).toHaveBeenCalledOnce();

    expect(mocks.navigate).toHaveBeenCalledWith(PATHS.LOGIN, {
      replace: true,
    });
  });

  test("should not navigate when logout fails", async () => {
    mocks.unwrap.mockRejectedValue(new Error("No se pudo cerrar sesión."));

    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(mocks.logoutUser).toHaveBeenCalledOnce();
    expect(mocks.dispatch).toHaveBeenCalledWith(logoutAction);
    expect(mocks.unwrap).toHaveBeenCalledOnce();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
