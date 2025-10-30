import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteViewModal from "../components/NoteViewModal";

describe("NoteViewModal component", () => {
  const note = {
    id: "1",
    title: "Test Note",
    content: "<p>This is the note content</p>",
    createdAt: "2025-10-01",
    updatedAt: "2025-10-02",
  };

  const onClose = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with a note", () => {
    render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText(/Last edited on/i)).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  test("calls onEdit when edit button is clicked", () => {
    render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalled();
  });

  test("shows delete confirmation when delete button is clicked", () => {
    render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete Note")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
  });

test("calls onDelete when confirming deletion", () => {
  render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);

  // Click the main Delete button to open the confirmation modal
  fireEvent.click(screen.getByText("Delete", { selector: "button" }));

  // Now specifically target the Delete button inside the confirmation modal
  const confirmDeleteButton = screen.getAllByText("Delete", { selector: "button" })[1];
  fireEvent.click(confirmDeleteButton);

  expect(onDelete).toHaveBeenCalledWith("1");
});


  test("hides delete confirmation when cancel button is clicked", () => {
    render(<NoteViewModal note={note} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByText("Delete")); // open confirm modal
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Delete Note")).not.toBeInTheDocument();
  });

  test("returns null if note is not provided", () => {
    const { container } = render(<NoteViewModal note={null} onClose={onClose} onEdit={onEdit} onDelete={onDelete} />);
    expect(container.firstChild).toBeNull();
  });
});
