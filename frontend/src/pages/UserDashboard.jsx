import React, { useState } from "react";
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
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSaveNote = async (content) => {
    if (editingNote) await updateNote(editingNote.id, noteTitle, content);
    else await createNote(noteTitle, content);
    setNoteTitle("");
    setShowEditor(false);
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setShowViewModal(true);
  };

  const handleEditNoteFromView = () => {
    setEditingNote(selectedNote);
    setNoteTitle(selectedNote.title);
    setShowEditor(true);
    setShowViewModal(false);
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    setShowViewModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-inter relative">
      <Header />

      {/* Sidebar Toggle (Mobile) */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-900 text-white shadow-md"
      >
        {showSidebar ? "✖" : "☰"}
      </button>

      <div className="flex flex-1">
        {/* Modern Sidebar */}
        <aside
          className={`fixed md:static top-16 left-0 h-[calc(100vh-4rem)] transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-20 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg flex flex-col items-center py-6 z-30 transition-all duration-300 ease-in-out`}
        >
          {/* Create Note */}
          <button
            onClick={() => {
              setShowEditor(true);
              setEditingNote(null);
              setNoteTitle("");
              setSelectedNote(null);
            }}
            className="relative group mb-6 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl shadow-md hover:shadow-xl hover:scale-110 transition-all duration-200"
          >
            <span className="text-3xl">+</span>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
              New Note
            </span>
          </button>

          {/* All Notes */}
          <button
            className="relative group w-12 h-12 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-2xl hover:scale-105 transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zM5 6h14v12H5V6z" />
            </svg>
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
              All Notes
            </span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-10 overflow-auto mt-4 md:mt-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
          </div>

          {/* Empty State */}
          {!showEditor && !showViewModal && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-lg text-gray-600 mb-4">
                You don’t have any notes yet.
              </p>
              <button
                onClick={() => {
                  setShowEditor(true);
                  setEditingNote(null);
                  setNoteTitle("");
                  setSelectedNote(null);
                }}
                className="px-6 py-3 bg-black text-white rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition-all"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setShowEditor(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-lg"
            >
              ✖
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {editingNote ? "Edit Note" : "Create New Note"}
            </h2>
            <input
              type="text"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full p-3 mb-4 text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            <NoteEditor
              existingContent={editingNote ? editingNote.content : ""}
              onSave={handleSaveNote}
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

      {/* Floating Create Button (Mobile) */}
      <button
        onClick={() => {
          setShowEditor(true);
          setEditingNote(null);
          setNoteTitle("");
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
