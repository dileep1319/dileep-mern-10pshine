import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage globally
beforeAll(() => {
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
});

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("redirects to /user-dashboard if userInfo exists", async () => {
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
    });
  });

  it("renders headline text", () => {
    render(<Dashboard />, { wrapper: MemoryRouter });
    expect(screen.getByText(/capture ideas/i)).toBeInTheDocument();
  });

  it("navigates to /login if not authenticated", async () => {
    render(<Dashboard />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText(/take notes/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("navigates to /user-dashboard when authenticated and Take Notes clicked", async () => {
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "xyz" }));

    render(<Dashboard />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText(/take notes/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
    });
  });
});