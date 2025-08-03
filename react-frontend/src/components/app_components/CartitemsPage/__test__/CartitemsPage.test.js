import React from "react";
import { render, screen } from "@testing-library/react";

import CartitemsPage from "../CartitemsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartitems page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartitemsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartitems-datatable")).toBeInTheDocument();
    expect(screen.getByRole("cartitems-add-button")).toBeInTheDocument();
});
