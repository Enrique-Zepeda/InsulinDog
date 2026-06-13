import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { useLogout } from "@/features/auth/hooks/useLogout";

import { LogoutButton } from "./LogoutButton";

vi.mock("@/features/auth/hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

const mockedUseLogout = vi.mocked(useLogout);

describe("LogoutButton", () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseLogout.mockReturnValue({
      logout: logoutMock,
      isLoading: false,
    });
  });

  test("should render the default text", () => {
    render(<LogoutButton />);

    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  test("should call logout when clicked", async () => {
    const user = userEvent.setup();

    render(<LogoutButton />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  test("should render custom children", () => {
    render(<LogoutButton>Salir</LogoutButton>);

    expect(screen.getByRole("button", { name: /salir/i })).toBeInTheDocument();
  });

  test("should display loading text and disable the button while logging out", () => {
    mockedUseLogout.mockReturnValue({
      logout: logoutMock,
      isLoading: true,
    });

    render(<LogoutButton />);

    const button = screen.getByRole("button", {
      name: /cerrando sesión/i,
    });

    expect(button).toBeDisabled();
  });

  test("should be disabled when disabled prop is true", () => {
    render(<LogoutButton disabled />);

    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeDisabled();
  });

  test("should not call logout when disabled", async () => {
    const user = userEvent.setup();

    render(<LogoutButton disabled />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(logoutMock).not.toHaveBeenCalled();
  });
});
