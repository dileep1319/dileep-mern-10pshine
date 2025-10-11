import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import NoteEditor from "../components/NoteEditor";
import NoteList from "../components/NoteList";
import NoteViewModal from "../components/NoteViewModal";
import { useNotes } from "../hooks/useNotes";

function UserDashboard() {
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Handle scroll position when editor opens
  useEffect(() => {
    if (showEditor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEditor]);

const handleSaveNote = async (content) => {
  try {
    // Extract title from content (first line or first header)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const firstElement = tempDiv.firstElementChild;
    let title = "Untitled";
    
    if (firstElement) {
      if (firstElement.tagName === 'H1' || firstElement.tagName === 'H2' || firstElement.tagName === 'H3') {
        title = firstElement.textContent.trim() || "Untitled";
      } else {
        const textContent = firstElement.textContent.trim();
        if (textContent) {
          title = textContent.length > 50 ? textContent.substring(0, 50) + "..." : textContent;
        }
      }
    }
    
    let savedNote;
    if (editingNote) {
      savedNote = await updateNote(editingNote.id, title, content);
    } else {
      savedNote = await createNote(title, content);
    }

    // Automatically open the saved note in view mode
    setSelectedNote(savedNote);
    setShowEditor(false);
    setShowViewModal(true);
    setEditingNote(null);
  } catch (error) {
    console.error("Error saving note:", error);
    alert("Failed to save note — see console for details");
  }
};



  const handleViewNote = (note) => {
    setSelectedNote(note);
    setShowViewModal(true);
  };

  const handleEditNoteFromView = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditingNote(selectedNote);
    setShowEditor(true);
    setShowViewModal(false);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setShowViewModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-[Inter]">
      <Header />

      {/* Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white/70 text-gray-800 shadow-sm backdrop-blur-md border border-white/20"
      >
        {showSidebar ? "✖" : "☰"}
      </button>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-16 left-0 h-[calc(100vh-4rem)] transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-20 bg-white/40 backdrop-blur-xl border-r border-white/20 flex flex-col items-center py-6 z-30 transition-all duration-300 ease-in-out`}
        >
          {/* Create Note */}
          <button
            onClick={() => {
              setShowEditor(true);
              setEditingNote(null);
              setSelectedNote(null);
            }}
            className="relative group mb-6 w-12 h-12 flex items-center justify-center bg-white/60 border border-white/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 hover:scale-105 transition-all duration-200"
          >
            <span className="text-2xl text-gray-700 font-bold">+</span>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-lg border border-white/30 shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
              New Note
            </span>
          </button>

          {/* All Notes */}
          <button className="relative group w-12 h-12 flex items-center justify-center bg-white/60 border border-white/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/80 hover:scale-105 transition-all duration-200 mb-6">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 text-xs px-3 py-1 rounded-lg border border-white/30 shadow-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
              All Notes
            </span>
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 sm:p-12 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-800">
              Notes
            </h1>
          </div>

          {/* Empty State */}
          {!showEditor && !showViewModal && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-gray-500 mb-6 text-lg">
                No notes yet — start creating.
              </p>
              <button
                onClick={() => {
                  setShowEditor(true);
                  setEditingNote(null);
                  setSelectedNote(null);
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                ✍️ Create Your First Note
              </button>
            </div>
          )}

          {/* Notes List */}
          {!showEditor && !showViewModal && notes.length > 0 && (
            <NoteList notes={notes} onViewNote={handleViewNote} />
          )}
        </main>
      </div>

      {/* Note Editor Modal */}
{showEditor && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="w-full max-w-3xl px-4">
      <NoteEditor
        existingContent={editingNote ? editingNote.content : ""}
        onSave={handleSaveNote}
        onCancel={() => setShowEditor(false)}
      />
    </div>
  </div>
)}
      {/* View Note Modal */}
      {showViewModal && selectedNote && (
        <NoteViewModal
          note={selectedNote}
          onClose={() => setShowViewModal(false)}
          onEdit={handleEditNoteFromView}
          onDelete={handleDeleteNote}
        />
      )}

      {/* Floating Create Button */}
      <button
        onClick={() => {
          setShowEditor(true);
          setEditingNote(null);
          setSelectedNote(null);
        }}
        className="md:hidden fixed bottom-6 right-6 bg-gray-900 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:scale-110 transition-transform"
      >
        +
      </button>
    </div>
  );
}

export default UserDashboard;
