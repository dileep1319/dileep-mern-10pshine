import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../components/NoteCard";

describe("NoteCard component", () => {
  const note = {
    id: "1",
    title: "Test Note",
    content: "<p>This is a test note content with some <strong>HTML</strong> tags.</p>",
    createdAt: "2025-10-01T10:00:00Z",
    updatedAt: "2025-10-02T12:00:00Z",
  };

  test("renders note title", () => {
    render(<NoteCard note={note} onViewNote={() => {}} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  test("renders 'Untitled' if title is missing", () => {
    const noTitleNote = { ...note, title: "" };
    render(<NoteCard note={noTitleNote} onViewNote={() => {}} />);
    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  test("renders preview text from HTML content", () => {
    render(<NoteCard note={note} onViewNote={() => {}} />);
    expect(screen.getByText(/This is a test note content/i)).toBeInTheDocument();
  });

  test("renders 'No content' if content is missing", () => {
    const emptyContentNote = { ...note, content: "" };
    render(<NoteCard note={emptyContentNote} onViewNote={() => {}} />);
    expect(screen.getByText("No content")).toBeInTheDocument();
  });

  test("formats createdAt and updatedAt correctly", () => {
    render(<NoteCard note={note} onViewNote={() => {}} />);
    expect(screen.getByText(/Updated Oct 2, 2025/i)).toBeInTheDocument();

    const createdNote = { ...note, updatedAt: note.createdAt };
    render(<NoteCard note={createdNote} onViewNote={() => {}} />);
    expect(screen.getByText(/Created Oct 1, 2025/i)).toBeInTheDocument();
  });

  test("calls onViewNote when clicked", () => {
    const handleView = jest.fn();
    render(<NoteCard note={note} onViewNote={handleView} />);
    const card = screen.getByText("Test Note").closest("div");
    fireEvent.click(card);
    expect(handleView).toHaveBeenCalledWith(note);
  });
});
