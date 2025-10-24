import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "../pages/Signup";
import API from "../utils/api";

// Mock the API module
jest.mock("../utils/api");

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Signup Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders signup form properly", () => {
    render(<Signup />, { wrapper: MemoryRouter });
    expect(screen.getByText(/create an account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits successfully and navigates to login", async () => {
    API.post.mockResolvedValueOnce({ data: {} });
    window.alert = jest.fn();

    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Registration Successful! Please log in."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays error message when signup fails", async () => {
    API.post.mockRejectedValueOnce({
      response: { data: { message: "Email already exists" } },
    });

    render(<Signup />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    );
  });
});