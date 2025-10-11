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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md transition-all duration-300 px-4">
        {/* Main Note Card */}
        <div
          className="relative w-full sm:w-[90%] md:w-[80%] lg:max-w-3xl max-h-[85vh] overflow-y-auto
          bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-10px_rgba(0,0,0,0.2)]
          p-8 sm:p-10 animate-fadeIn transition-all duration-300 ease-out"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              /* Hide Scrollbar for WebKit */
              ::-webkit-scrollbar {
                display: none;
              }

              /* Apple-style subtle appear animation */
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(10px) scale(0.98);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.35s ease-out forwards;
              }
            `}
          </style>

          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-200/60 pb-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-800 leading-snug font-[SF Pro Display,Inter,sans-serif]">
              {note.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-3xl font-light transition-all duration-200"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div
            className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[1.05rem] sm:text-[1.1rem] tracking-wide 
            font-[SF Pro Text,Inter,sans-serif] selection:bg-yellow-200/40"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></div>

          {/* Footer */}
          <div className="mt-10 border-t border-gray-200/60 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-sm text-gray-500 italic font-[SF Pro Text,Inter,sans-serif]">
              {note.updatedAt && note.updatedAt !== note.createdAt
                ? `Last edited on ${new Date(
                    note.updatedAt
                  ).toLocaleDateString()}`
                : `Created on ${new Date(note.createdAt).toLocaleDateString()}`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={onEdit}
                className="px-5 py-2 rounded-xl bg-white border border-gray-200/60 
                text-gray-800 hover:bg-gray-50 hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                transition-all duration-200 font-[SF Pro Text,Inter,sans-serif]"
              >
                Edit
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 
                transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.15)]
                font-[SF Pro Text,Inter,sans-serif]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md px-4">
          <div
            className="bg-white/95 backdrop-blur-2xl border border-gray-200/60 rounded-2xl shadow-2xl 
            p-8 w-full max-w-sm animate-fadeIn font-[SF Pro Text,Inter,sans-serif]"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Delete Note
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-xl bg-white border border-gray-200/60 
                text-gray-800 hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 
                transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
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
