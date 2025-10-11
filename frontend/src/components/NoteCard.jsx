import React from "react";

const NoteCard = ({ note, onViewNote }) => {
  // Extract preview text from HTML content
  const getPreviewText = (htmlContent) => {
    if (!htmlContent) return "No content";
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => onViewNote(note)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Note Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
        {note.title || "Untitled"}
      </h3>
      
      {/* Note Preview */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {getPreviewText(note.content)}
      </p>
      
      {/* Note Date */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {note.updatedAt && note.updatedAt !== note.createdAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : `Created ${formatDate(note.createdAt)}`
          }
        </span>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default NoteCard;
