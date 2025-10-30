import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

// ✅ Silence console warnings/errors once — clean and safe
let warnSpy;
let errorSpy;

beforeAll(() => {
  warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});

// ✅ Mock navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock localStorage
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

// ✅ Mock atob for JWT decoding
global.atob = (str) => Buffer.from(str, "base64").toString("binary");

describe("Dashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("redirects to /user-dashboard if userInfo exists with valid non-JWT token", async () => {
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

  it("redirects to /login if JWT token is expired", async () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 60 };
    const fakeExpiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.sig`;

    window.localStorage.setItem("userInfo", JSON.stringify({ token: fakeExpiredToken }));

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects to /user-dashboard if JWT token is valid", async () => {
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const fakeValidToken = `header.${btoa(JSON.stringify(validPayload))}.sig`;

    window.localStorage.setItem("userInfo", JSON.stringify({ token: fakeValidToken }));

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user-dashboard");
    });
  });

  it("handles malformed token and logs out", async () => {
    const badToken = `header.${btoa("not-json")}.sig`;

    window.localStorage.setItem("userInfo", JSON.stringify({ token: badToken }));

    render(<Dashboard />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
