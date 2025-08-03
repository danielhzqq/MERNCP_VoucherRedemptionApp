import React from "react";
import { render, screen } from "@testing-library/react";

import ProfilesPage from "../ProfilesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders profiles page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ProfilesPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("profiles-datatable")).toBeInTheDocument();
  expect(screen.getByRole("profiles-add-button")).toBeInTheDocument();
});
