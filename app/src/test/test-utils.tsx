import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { store } from "@/app/store/store";

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  initialEntries?: string[];
};

export function renderWithProviders(
  ui: ReactElement,
  { initialEntries = ["/"], ...renderOptions }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { screen, waitFor, within } from "@testing-library/react";
