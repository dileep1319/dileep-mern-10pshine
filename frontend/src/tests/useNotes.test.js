import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useNotes } from "../hooks/useNotes";
import API from "../utils/api";
import { MemoryRouter } from "react-router-dom";

// Mock API
jest.mock("../utils/api");

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
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

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });

  jest.spyOn(window, "alert").mockImplementation(() => {});
});

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
});

describe("useNotes hook", () => {
  it("redirects to /login if no token", async () => {
    renderHook(() => useNotes(), { wrapper: MemoryRouter });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("fetches notes successfully when token exists", async () => {
    const notesData = [{ id: 1, title: "Note 1", content: "Content 1" }];
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: notesData });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(result.current.notes).toEqual(notesData);
    });
    expect(API.get).toHaveBeenCalledWith("/notes", { headers: { Authorization: "Bearer abc" } });
  });

  it("creates a note successfully", async () => {
    const note = { id: 2, title: "New Note", content: "New content" };
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [] });
    API.post.mockResolvedValueOnce({ data: { note } });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      const created = await result.current.createNote(note.title, note.content);
      expect(created).toEqual(note);
    });

    await waitFor(() => {
      expect(result.current.notes).toContain(note);
    });
  });

  it("updates a note successfully", async () => {
    const note = { id: 3, title: "Old Note", content: "Old content" };
    const updatedNote = { id: 3, title: "Updated Note", content: "Updated content" };
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [note] });
    API.put.mockResolvedValueOnce({ data: updatedNote });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      const updated = await result.current.updateNote(note.id, updatedNote.title, updatedNote.content);
      expect(updated).toEqual(updatedNote);
    });

    await waitFor(() => {
      expect(result.current.notes).toContainEqual(updatedNote);
    });
  });

  it("deletes a note successfully", async () => {
    const note = { id: 4, title: "Note to Delete", content: "Content" };
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [note] });
    API.delete.mockResolvedValueOnce({});

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      await result.current.deleteNote(note.id);
    });

    await waitFor(() => {
      expect(result.current.notes).not.toContain(note);
    });
  });

  it("alerts on createNote failure", async () => {
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [] });
    API.post.mockRejectedValueOnce({ response: { data: { message: "Fail" } } });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      await expect(result.current.createNote("Title", "Content")).rejects.toBeDefined();
      expect(window.alert).toHaveBeenCalledWith("Failed to create note");
    });
  });

  it("alerts on updateNote failure", async () => {
    const note = { id: 5, title: "Old", content: "Old" };
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [note] });
    API.put.mockRejectedValueOnce({ response: { data: { message: "Fail" } } });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      await expect(result.current.updateNote(note.id, "New", "New")).rejects.toBeDefined();
      expect(window.alert).toHaveBeenCalledWith("Failed to update note");
    });
  });

  it("alerts on deleteNote failure", async () => {
    const note = { id: 6, title: "Delete Fail", content: "Content" };
    window.localStorage.setItem("userInfo", JSON.stringify({ token: "abc" }));
    API.get.mockResolvedValueOnce({ data: [note] });
    API.delete.mockRejectedValueOnce({ response: { data: { message: "Fail" } } });

    const { result } = renderHook(() => useNotes(), { wrapper: MemoryRouter });

    await act(async () => {
      await result.current.deleteNote(note.id);
      expect(window.alert).toHaveBeenCalledWith("Failed to delete note");
    });
  });
});
