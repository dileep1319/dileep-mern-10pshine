import React from "react";

const NoteCard = ({ note, onViewNote, darkMode, searchQuery }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Highlight matched search query (works for HTML)
  const highlightHTML = (html, query) => {
    if (!query) return html;
    const regex = new RegExp(`(${query})`, "gi");
    return html.replace(
      regex,
      (match) =>
        `<mark style="background-color:${
          darkMode ? "#b58900" : "#fff176"
        };border-radius:4px;padding:0 2px;">${match}</mark>`
    );
  };

  // ✅ Render content directly (keep lists, bold, underline)
  const previewHTML = highlightHTML(note.content || "<p>No content</p>", searchQuery);

  return (
    <div
      onClick={() => onViewNote(note)}
      className={`rounded-xl border p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
        darkMode
          ? "bg-gray-900/90 border-gray-800 text-gray-100 hover:bg-gray-800"
          : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
      } hover:shadow-lg`}
    >
      <h3 className="text-lg font-semibold mb-3 line-clamp-2">
        <span
          dangerouslySetInnerHTML={{
            __html: highlightHTML(note.title || "Untitled", searchQuery),
          }}
        />
      </h3>

      {/* ✅ Only show short preview */}
      <div
        className={`note-preview text-sm mb-4 line-clamp-3 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
        dangerouslySetInnerHTML={{ __html: previewHTML }}
      ></div>

      <div
        className={`flex items-center justify-between text-xs ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        <span>
          {note.updatedAt && note.updatedAt !== note.createdAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : `Created ${formatDate(note.createdAt)}`}
        </span>
        <div
          className={`w-2 h-2 rounded-full ${
            darkMode ? "bg-gray-600" : "bg-gray-300"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default NoteCard;
