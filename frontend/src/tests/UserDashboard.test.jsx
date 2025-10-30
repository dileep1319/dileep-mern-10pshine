import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";

// ✅ mock navigate before component import
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

import UserDashboard from "../pages/UserDashboard";

jest.mock("../hooks/useNotes");

// ✅ Mock Components
jest.mock("../components/Header", () => ({ onSearch }) => (
  <div>
    Mock Header
    <input
      placeholder="Search"
      onChange={(e) => onSearch(e.target.value, false)}
      onBlur={(e) => onSearch(e.target.value, true)}
    />
  </div>
));

jest.mock("../components/NoteEditor", () => ({ onSave, onCancel }) => (
  <div>
    <p>Mock Note Editor</p>
    <button onClick={() => onSave({ title: "New Note", content: "Test" })}>
      Save
    </button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));

jest.mock("../components/NoteList", () => ({ notes, onViewNote }) => (
  <div>
    <p>Mock Note List</p>
    {notes.map((note) => (
      <div
        key={note.id}
        data-testid="note-item"
        onClick={() => onViewNote(note)}
      >
        {note.title}
      </div>
    ))}
  </div>
));

jest.mock("../components/NoteViewModal", () => ({ note, onClose, onEdit, onDelete }) => (
  <div>
    <p>Viewing: {note.title}</p>
    <button onClick={onEdit}>Edit</button>
    <button onClick={() => onDelete(note.id)}>Delete</button>
    <button onClick={onClose}>Close</button>
  </div>
));

// ✅ Mock functions
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockSearch = jest.fn().mockResolvedValue([]);
const mockSetDarkMode = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  window.scrollTo = jest.fn();
  window.alert = jest.fn();
  localStorage.clear();
});

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("UserDashboard Component", () => {
  it("renders empty state when no notes exist", () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("opens editor when 'Create Your First Note' is clicked", () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    fireEvent.click(screen.getByText(/create your first note/i));
    expect(screen.getByText(/mock note editor/i)).toBeInTheDocument();
  });

  it("handles note creation successfully", async () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    mockCreate.mockResolvedValueOnce({ id: 1, title: "New Note", content: "Test" });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    fireEvent.click(screen.getByText(/create your first note/i));
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() =>
      expect(mockCreate).toHaveBeenCalledWith("New Note", "Test")
    );
  });

  it("handles viewing and editing a note", async () => {
    useNotes.mockReturnValue({
      notes: [{ id: 1, title: "Old Note", content: "Stuff" }],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    fireEvent.click(screen.getByTestId("note-item"));
    expect(screen.getByText(/viewing: old note/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/edit/i));
    expect(screen.getByText(/mock note editor/i)).toBeInTheDocument();
  });

  it("deletes a note successfully", async () => {
    useNotes.mockReturnValue({
      notes: [{ id: 5, title: "Temp Note", content: "Delete me" }],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    fireEvent.click(screen.getByTestId("note-item"));
    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(5));
  });

  it("toggles dark mode", () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    const buttons = screen.getAllByRole("button");
    const darkModeBtn = buttons[2];
    fireEvent.click(darkModeBtn);
    expect(mockSetDarkMode).toHaveBeenCalledWith(true);
  });

  it("toggles sidebar visibility", () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    const toggleBtn = screen.getByText("☰");
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toBe("✖");
  });

  it("handles logout and navigation", async () => {
    useNotes.mockReturnValue({
      notes: [],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );

    const logoutBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.className.includes("from-red-500"));

    fireEvent.click(logoutBtn);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/Dashboard"));
  });

  it("handles live and backend search", async () => {
    useNotes.mockReturnValue({
      notes: [
        { id: 1, title: "React", content: "JS library" },
        { id: 2, title: "Vue", content: "Cool stuff" },
      ],
      fetchNotes: jest.fn(),
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
      searchNotes: mockSearch,
    });

    renderWithRouter(
      <UserDashboard darkMode={false} setDarkMode={mockSetDarkMode} />
    );
    const input = screen.getByPlaceholderText("Search");

    fireEvent.change(input, { target: { value: "React" } });
    expect(mockSearch).not.toHaveBeenCalled();

    fireEvent.blur(input);
    await waitFor(() => expect(mockSearch).toHaveBeenCalledWith("React"));
  });
});
``
