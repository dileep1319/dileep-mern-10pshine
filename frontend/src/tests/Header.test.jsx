import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock localStorage BEFORE importing Header
const user = { name: "John Doe", email: "john@example.com" };
beforeAll(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => JSON.stringify(user)),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });
});

import Header from "../components/Header";

describe("Header component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders login and signup links when no user in localStorage", () => {
    window.localStorage.getItem.mockReturnValue(null);
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  test("renders user profile button when user is in localStorage", () => {
    window.localStorage.getItem.mockReturnValue(JSON.stringify(user));
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const profileButton = screen.getByTitle("John Doe");
    expect(profileButton).toBeInTheDocument();
    expect(profileButton.textContent).toBe("J");

    fireEvent.click(profileButton);
    expect(mockedNavigate).toHaveBeenCalledWith("/profile");
  });

  test("renders default User if name is missing", () => {
    const noNameUser = { email: "user@example.com" };
    window.localStorage.getItem.mockReturnValue(JSON.stringify(noNameUser));

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const profileButton = screen.getByTitle("User");
    expect(profileButton).toBeInTheDocument();
    expect(profileButton.textContent).toBe("U");
  });
});


