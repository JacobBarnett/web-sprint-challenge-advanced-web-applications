// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import Spinner from "./Spinner";
import { queryByTestId, render } from "@testing-library/react";
import React from "react";

test("Spinner should show when on is true", () => {
  const { queryByTestId } = render(<Spinner on={true} />);

  expect(queryByTestId("spinner")).not.toBe(null);
});

test("Spinner should not show when on is false", () => {
  const { queryByTestId } = render(<Spinner on={false} />);

  expect(queryByTestId("spinner")).toBe(null);
});
