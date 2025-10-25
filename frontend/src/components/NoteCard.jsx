import React from "react";

const NoteCard = ({ note, onViewNote, darkMode, searchQuery }) => {
  const getPreviewText = (htmlContent) => {
    if (!htmlContent) return "No content";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Highlight matched words
  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className={`px-1 rounded ${
            darkMode
              ? "bg-yellow-600/60 text-white"
              : "bg-yellow-200 text-gray-900"
          }`}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const preview = getPreviewText(note.content);

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
        {highlightText(note.title || "Untitled", searchQuery)}
      </h3>

      <p
        className={`text-sm mb-4 line-clamp-3 ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {highlightText(preview, searchQuery)}
      </p>

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
