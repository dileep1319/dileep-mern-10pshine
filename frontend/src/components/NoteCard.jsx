import React from "react";

function NoteCard({ note, onViewNote }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-lg cursor-pointer"
      onClick={() => onViewNote(note)}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h2>
      <div
        className="text-gray-700 mb-4 flex-grow overflow-hidden"
        dangerouslySetInnerHTML={{
          __html:
            note.content.substring(0, 150) +
            (note.content.length > 150 ? "..." : ""),
        }}
      />
    </div>
  );
}

export default NoteCard;
