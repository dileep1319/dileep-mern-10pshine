
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserDashboard from "../pages/UserDashboard";
import { useNotes } from "../hooks/useNotes";

// 🔹 Mock dependencies
jest.mock("../hooks/useNotes");
jest.mock("../components/Header", () => () => <div>Mock Header</div>);
jest.mock("../components/NoteEditor", () => ({ onSave, onCancel }) => (
  <div>
    <p>Mock Note Editor</p>
    <button onClick={() => onSave({ title: "New Note", content: "Test" })}>Save</button>
    <button onClick={onCancel}>Cancel</button>
  </div>
));
jest.mock("../components/NoteList", () => ({ notes, onViewNote }) => (
  <div>
    <p>Mock Note List</p>
    {notes.map((note) => (
      <div key={note.id} data-testid="note-item" onClick={() => onViewNote(note)}>
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

// 🔹 Shared mocks
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  // Default mock
  useNotes.mockReturnValue({
    notes: [],
    createNote: mockCreate,
    updateNote: mockUpdate,
    deleteNote: mockDelete,
  });
});

describe("UserDashboard", () => {
  it("renders empty state when no notes exist", () => {
    render(<UserDashboard />);
    expect(screen.getByText(/no notes yet/i)).toBeInTheDocument();
  });

  it("opens editor when 'Create Your First Note' button is clicked", () => {
    render(<UserDashboard />);
    fireEvent.click(screen.getByText(/create your first note/i));
    expect(screen.getByText(/mock note editor/i)).toBeInTheDocument();
  });

  it("handles note creation successfully", async () => {
    mockCreate.mockResolvedValueOnce({ id: 1, title: "New Note", content: "Test" });

    render(<UserDashboard />);
    fireEvent.click(screen.getByText(/create your first note/i));
    fireEvent.click(screen.getByText(/save/i));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith("New Note", "Test");
    });

    // After save, modal should show
    await waitFor(() => {
      expect(screen.getByText(/viewing: new note/i)).toBeInTheDocument();
    });
  });

  it("handles viewing and editing a note", async () => {
    useNotes.mockReturnValueOnce({
      notes: [{ id: 1, title: "Old Note", content: "Stuff" }],
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
    });

    render(<UserDashboard />);

    fireEvent.click(screen.getByTestId("note-item"));
    expect(screen.getByText(/viewing: old note/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/edit/i));
    expect(screen.getByText(/mock note editor/i)).toBeInTheDocument();
  });

  it("deletes note successfully from modal", async () => {
    useNotes.mockReturnValueOnce({
      notes: [{ id: 5, title: "Temp Note", content: "Delete me" }],
      createNote: mockCreate,
      updateNote: mockUpdate,
      deleteNote: mockDelete,
    });

    render(<UserDashboard />);
    fireEvent.click(screen.getByText(/temp note/i));
    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(5);
    });
  });
});
