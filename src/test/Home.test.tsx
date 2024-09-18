import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

// Mock the react-router-dom's useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        name: "Test City",
        main: { temp: 20 },
      }),
  }),
) as jest.Mock;

describe("Home component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
  });

  it("displays default locations with temperatures", async () => {
    await waitFor(() => {
      expect(screen.getByText("Berlin")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /°C/i })).toHaveTextContent(
        expect.any(Number),
      );
    });
  });

  it("switches between metric and imperial units", async () => {
    const metricButton = screen.getByText("°C");
    const imperialButton = screen.getByText("°F");

    fireEvent.click(imperialButton);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /°F/i })).toHaveTextContent(
        expect.any(Number),
      );
    });

    fireEvent.click(metricButton);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /°C/i })).toHaveTextContent(
        expect.any(Number),
      );
    });
  });

  it("allows searching for a city", async () => {
    const input = screen.getByPlaceholderText("Enter a city");
    const searchButton = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "New York" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/weather/new york");
    });
  });

  it("displays current location", async () => {
    await waitFor(() => {
      expect(screen.getByText("Test City")).toBeInTheDocument();
    });
  });
});
