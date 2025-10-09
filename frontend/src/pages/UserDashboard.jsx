import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import NoteEditor from "../components/NoteEditor";

function UserDashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    } else {
      const userNotes =
        JSON.parse(localStorage.getItem(`notes_${userInfo}`)) || [];
      setNotes(userNotes);
    }
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const saveNotesToLocalStorage = (currentNotes) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      localStorage.setItem(`notes_${userInfo}`, JSON.stringify(currentNotes));
    }
  };

  const handleSaveNote = (content) => {
    let updatedNotes;
    if (editingNote) {
      updatedNotes = notes.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              title: noteTitle,
              content: content,
              updatedAt: new Date().toISOString(),
            }
          : note
      );
      setEditingNote(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle || "New Note",
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedNotes = [...notes, newNote];
    }
    setNotes(updatedNotes);
    saveNotesToLocalStorage(updatedNotes);
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
    setShowViewModal(false);
    setShowEditor(true);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      saveNotesToLocalStorage(updatedNotes);
      setShowViewModal(false);
      setShowEditor(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      {/* Sidebar Toggle for small screens */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {showSidebar ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 w-16 md:w-20 bg-white shadow-xl flex flex-col items-center p-4 z-40 transition-transform duration-300 ease-in-out`}
      >
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 mb-6 flex flex-col items-center"
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
          </svg>
        </Link>

        {/* Create Note Button with Tooltip */}
        <div className="relative group mb-4">
          <button
            onClick={() => {
              setShowEditor(true);
              setEditingNote(null);
              setNoteTitle("");
              setSelectedNote(null);
            }}
            className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-black transition-transform transform hover:scale-110"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
            Create New Note
          </span>
        </div>

        {/* All Notes Button with Tooltip */}
        <div className="relative group">
          <button className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-full hover:bg-gray-100 transition-transform transform hover:scale-110">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 6h14v12H5V6z" />
            </svg>
          </button>
          <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 whitespace-nowrap">
            All Notes
          </span>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <div className="hidden md:block">
          <Header />
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
          </div>

          {!showEditor && !showViewModal && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg text-gray-700 mb-4">
                You don’t have any notes yet.
              </p>
              <button
                onClick={() => {
                  setShowEditor(true);
                  setEditingNote(null);
                  setNoteTitle("");
                  setSelectedNote(null);
                }}
                className="px-6 py-3 bg-black text-white rounded-lg shadow-md transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                ✍️ Create Your First Note
              </button>
            </div>
          )}

          {!showEditor && !showViewModal && notes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-lg cursor-pointer"
                  onClick={() => handleViewNote(note)}
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h2>
                  <div
                    className="text-gray-700 mb-4 flex-grow overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html:
                        note.content.substring(0, 150) +
                        (note.content.length > 150 ? "..." : ""),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Note Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-full md:max-w-2xl bg-white rounded-lg shadow-xl p-6">
            {/* Close Cross */}
            <button
              onClick={() => setShowEditor(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
             ❌
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingNote ? "Edit Note" : "Create New Note"}
            </h2>
            <input
              type="text"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full p-2 mb-4 text-xl font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative w-full max-w-full md:max-w-2xl bg-white rounded-lg shadow-xl p-6">
            {/* Close Cross */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ❌
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedNote.title}
            </h2>
            <div
              className="text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: selectedNote.content }}
            />
            <p className="text-sm text-gray-500 mb-4">
              {selectedNote.updatedAt &&
              selectedNote.updatedAt !== selectedNote.createdAt
                ? `Edited: ${new Date(
                    selectedNote.updatedAt
                  ).toLocaleDateString()}`
                : `Created: ${new Date(
                    selectedNote.createdAt
                  ).toLocaleDateString()}`}
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              {/* Edit button */}
              <button
                onClick={handleEditNoteFromView}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
                aria-label="Edit note"
              >
                ✎
              </button>

              {/* Delete button */}
              <button
                onClick={() => handleDeleteNote(selectedNote.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                aria-label="Delete note"
              >
                🗑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
