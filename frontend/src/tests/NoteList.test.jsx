import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteList from "../components/NoteList";

// Mock NoteCard so we can test NoteList without rendering full NoteCard details
jest.mock("../components/NoteCard", () => ({ note, onViewNote }) => (
  <div data-testid="note-card" onClick={() => onViewNote(note)}>
    {note.title}
  </div>
));

describe("NoteList component", () => {
  const notes = [
    { id: "1", title: "Note 1", content: "Content 1", createdAt: "2025-10-01", updatedAt: "2025-10-01" },
    { id: "2", title: "Note 2", content: "Content 2", createdAt: "2025-10-02", updatedAt: "2025-10-02" },
  ];

  test("renders empty state when no notes", () => {
    render(<NoteList notes={[]} onViewNote={() => {}} />);
    expect(screen.getByText("You don’t have any notes yet.")).toBeInTheDocument();
  });

  test("renders NoteCard components when notes exist", () => {
    render(<NoteList notes={notes} onViewNote={() => {}} />);
    const cards = screen.getAllByTestId("note-card");
    expect(cards).toHaveLength(notes.length);
    expect(cards[0]).toHaveTextContent("Note 1");
    expect(cards[1]).toHaveTextContent("Note 2");
  });

  test("calls onViewNote when a NoteCard is clicked", () => {
    const handleView = jest.fn();
    render(<NoteList notes={notes} onViewNote={handleView} />);
    const firstCard = screen.getAllByTestId("note-card")[0];
    fireEvent.click(firstCard);
    expect(handleView).toHaveBeenCalledWith(notes[0]);
  });
});
