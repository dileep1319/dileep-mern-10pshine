import React, { useState } from "react";

function NoteViewModal({ note, onClose, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setShowConfirm(false);
  };

  if (!note) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        {/* Modal */}
        <div
  className="relative w-full sm:w-[90%] md:w-[85%] lg:max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mx-4 sm:mx-0"
>

          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">{note.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            className="text-gray-800 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></div>

          {/* Footer */}
          <div className="mt-8 border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-sm text-gray-500 italic">
              {note.updatedAt && note.updatedAt !== note.createdAt
                ? `Last edited on ${new Date(note.updatedAt).toLocaleDateString()}`
                : `Created on ${new Date(note.createdAt).toLocaleDateString()}`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Note
            </h3>
            <p className="text-gray-700 mb-5">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteViewModal;
