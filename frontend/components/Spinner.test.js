// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Spinner from "./Spinner";

describe("Spinner component", () => {
  test("renders when `on` is true", () => {
    render(<Spinner on={true} />);
    const spinner = document.getElementById("spinner");
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText(/Please wait/i)).toBeInTheDocument();
  });

  test("does not render when `on` is false", () => {
    render(<Spinner on={false} />);
    const spinner = document.getElementById("spinner");
    expect(spinner).not.toBeInTheDocument();
  });
});
