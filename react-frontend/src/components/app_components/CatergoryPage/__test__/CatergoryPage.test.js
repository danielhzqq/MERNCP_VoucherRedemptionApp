import React from "react";
import { render, screen } from "@testing-library/react";

import CatergoryPage from "../CatergoryPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders catergory page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CatergoryPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("catergory-datatable")).toBeInTheDocument();
    expect(screen.getByRole("catergory-add-button")).toBeInTheDocument();
});
