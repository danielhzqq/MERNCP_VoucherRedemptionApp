import React from "react";
import { render, screen } from "@testing-library/react";

import CartitemhistoryEditDialogComponent from "../CartitemhistoryEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders cartitemhistory edit dialog", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <CartitemhistoryEditDialogComponent show={true} />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("cartitemhistory-edit-dialog-component")).toBeInTheDocument();
});
