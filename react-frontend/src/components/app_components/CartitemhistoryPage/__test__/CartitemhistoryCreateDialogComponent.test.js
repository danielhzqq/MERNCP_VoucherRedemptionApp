import React from "react";
import { render, screen } from "@testing-library/react";

import CartitemhistoryCreateDialogComponent from "../CartitemhistoryCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartitemhistory create dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartitemhistoryCreateDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartitemhistory-create-dialog-component")).toBeInTheDocument();
});
