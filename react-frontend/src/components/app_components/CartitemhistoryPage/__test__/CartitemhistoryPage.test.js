import React from "react";
import { render, screen } from "@testing-library/react";

import CartitemhistoryPage from "../CartitemhistoryPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartitemhistory page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartitemhistoryPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartitemhistory-datatable")).toBeInTheDocument();
    expect(screen.getByRole("cartitemhistory-add-button")).toBeInTheDocument();
});
