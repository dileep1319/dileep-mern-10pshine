import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Setup mock localStorage
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
  jest.useFakeTimers(); // for debounce
});

afterAll(() => {
  jest.useRealTimers();
});

describe("Header Component", () => {
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

  test("renders default User avatar when name missing", () => {
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

  test("calls onSearch with debounce when typing", () => {
    const onSearchMock = jest.fn();
    window.localStorage.getItem.mockReturnValue(JSON.stringify(user));

    render(
      <MemoryRouter>
        <Header onSearch={onSearchMock} />
      </MemoryRouter>
    );

    const input = screen.getAllByPlaceholderText("Search notes...")[0];
    fireEvent.change(input, { target: { value: "hello" } });

    // Debounce delay
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(onSearchMock).toHaveBeenCalledWith("hello", false);
  });

  test("calls onSearch immediately on Enter key", () => {
    const onSearchMock = jest.fn();
    window.localStorage.getItem.mockReturnValue(JSON.stringify(user));

    render(
      <MemoryRouter>
        <Header onSearch={onSearchMock} />
      </MemoryRouter>
    );

    const input = screen.getAllByPlaceholderText("Search notes...")[0];
    fireEvent.change(input, { target: { value: "quick search" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onSearchMock).toHaveBeenCalledWith("quick search", true);
  });

  test("renders correctly in dark mode", () => {
    window.localStorage.getItem.mockReturnValue(JSON.stringify(user));

    render(
      <MemoryRouter>
        <Header darkMode={true} />
      </MemoryRouter>
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("bg-black/80");
  });
});
