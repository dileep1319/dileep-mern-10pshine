import React from "react";
import NoteCard from "./NoteCard";

function NoteList({ notes, onViewNote, darkMode, searchQuery = "" }) {
  if (!notes.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
          You don’t have any notes yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onViewNote={onViewNote}
          darkMode={darkMode}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}

export default NoteList;
