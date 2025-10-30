import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPassword from "../pages/ForgotPassword";
import API from "../utils/api";

jest.mock("../utils/api");
const mockNavigate = jest.fn();

// mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ForgotPassword Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email input initially", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Code/i })).toBeInTheDocument();
  });

  it("handles successful code request and moves to step 2", async () => {
    API.post.mockResolvedValueOnce({ data: { message: "Code sent" } });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Code/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith(
        "/users/forgot-password",
        { email: "test@example.com" },
        { headers: { "Content-Type": "application/json" } }
      );
    });

    expect(screen.getByText("Code sent")).toBeInTheDocument();
    expect(screen.getByLabelText(/Verification Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
  });

  it("handles error when sending reset code fails", async () => {
    API.post.mockRejectedValueOnce({
      response: { data: { message: "Email not found" } },
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "fail@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Code/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
    });
  });

  it("handles generic error when sending reset code fails", async () => {
    API.post.mockRejectedValueOnce({});

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "fail@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Send Code/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to send reset code/i)).toBeInTheDocument();
    });
  });

  it("handles successful password reset and navigates to login", async () => {
    jest.useFakeTimers(); // 👈 enable fake timers here
    API.post
      .mockResolvedValueOnce({ data: { message: "Code sent" } }) // step 1
      .mockResolvedValueOnce({ data: { message: "Password reset successful" } }); // step 2

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Step 1
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Code/i }));

    await waitFor(() => screen.getByText(/Code sent/i));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Verification Code/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "newpass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenLastCalledWith(
        "/users/reset-password",
        {
          email: "test@example.com",
          code: "123456",
          newPassword: "newpass123",
        },
        { headers: { "Content-Type": "application/json" } }
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Password reset successful/i)).toBeInTheDocument();
    });

    // ⏰ use act() with fake timers to flush setTimeout
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
    jest.useRealTimers(); // ✅ cleanup
  });

  it("handles error during password reset", async () => {
    API.post
      .mockResolvedValueOnce({ data: { message: "Code sent" } }) // step 1
      .mockRejectedValueOnce({
        response: { data: { message: "Invalid code" } },
      }); // step 2

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    // Step 1
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send Code/i }));
    await waitFor(() => screen.getByText(/Code sent/i));

    // Step 2
    fireEvent.change(screen.getByLabelText(/Verification Code/i), {
      target: { value: "000000" },
    });
    fireEvent.change(screen.getByLabelText(/New Password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Reset Password/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid code/i)).toBeInTheDocument();
    });
  });
});
