import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "../pages/UserProfile";

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserProfile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("redirects to /login if no userInfo in localStorage", () => {
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login if userInfo is invalid JSON", () => {
    localStorage.setItem("userInfo", "{invalid_json}");
    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders correctly when valid userInfo exists", async () => {
    const mockUser = { name: "Dilu", email: "dilu@example.com" };
    window.localStorage.getItem = jest.fn(() =>
      JSON.stringify(mockUser)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      );
    });

    // Wait for re-render after useEffect
    expect(await screen.findByText("Profile")).toBeInTheDocument();

    // ✅ Handle duplicate names safely
    const nameElements = screen.getAllByText("Dilu");
    expect(nameElements.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("dilu@example.com")).toBeInTheDocument();
  });

  it("renders correctly in dark mode", async () => {
    const mockUser = { name: "Alice", email: "alice@example.com" };
    window.localStorage.getItem = jest.fn(() =>
      JSON.stringify(mockUser)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProfile darkMode={true} />
        </MemoryRouter>
      );
    });

    const heading = await screen.findByText("Profile");
    // ✅ Locate outer container directly (min-h-screen class)
    const container = heading.closest("div[class*='min-h-screen']");
    expect(container?.className).toContain("bg-gradient-to-br");
  });

  it("back button navigates to previous page", async () => {
    const mockUser = { name: "Bob", email: "bob@example.com" };
    window.localStorage.getItem = jest.fn(() =>
      JSON.stringify(mockUser)
    );

    await act(async () => {
      render(
        <MemoryRouter>
          <UserProfile />
        </MemoryRouter>
      );
    });

    const backButton = await screen.findByRole("button");
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
