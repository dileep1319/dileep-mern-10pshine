import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NoteEditor from "../components/NoteEditor";
import NoteList from "../components/NoteList";
import NoteViewModal from "../components/NoteViewModal";
import { useNotes } from "../hooks/useNotes";
import { SunMedium, MoonStar } from "lucide-react";

function UserDashboard({ darkMode, setDarkMode }) {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, searchNotes } =
    useNotes();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  // Lock scroll when editor is open
  useEffect(() => {
    document.body.style.overflow = showEditor ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showEditor]);

  // Always sync filtered notes with fetched notes
  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  // Save or update note
  const handleSaveNote = async ({ title, content }) => {
    try {
      let savedNote;
      if (editingNote) {
        savedNote = await updateNote(editingNote.id, title, content);
      } else {
        savedNote = await createNote(title, content);
      }
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

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/Dashboard");
  };
  useEffect(() => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) {
    navigate("/login");
    return;
  }

  const parsed = JSON.parse(userInfo);
  const token = parsed.token;
  if (token?.includes(".")) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.warn("Token expired, redirecting...");
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  }
}, [navigate]);


  // Live + backend search
  const handleSearch = async (query, isFinal) => {
    setSearchQuery(query);
    try {
      if (!query.trim()) {
        setFilteredNotes(notes);
        return;
      }

      if (isFinal) {
        // Backend full search
        const results = await searchNotes(query);
        setFilteredNotes(results);
      } else {
        // Local live search while typing
        const lower = query.toLowerCase();
        const filtered = notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lower) ||
            note.content.toLowerCase().includes(lower)
        );
        setFilteredNotes(filtered);
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden font-[Inter] transition-colors duration-500 ${
        darkMode
          ? "bg-black text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} onSearch={handleSearch} />

      {/* Sidebar Toggle for Mobile */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className={`md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg border shadow-sm backdrop-blur-md ${
          darkMode
            ? "bg-white/10 text-white border-gray-700"
            : "bg-white/70 text-gray-800 border-white/20"
        }`}
      >
        {showSidebar ? "✖" : "☰"}
      </button>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-16 left-0 md:top-0 h-[calc(100vh-4rem)] md:h-screen w-20 
          flex flex-col justify-between items-center py-6 border-r backdrop-blur-xl z-30 transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(0,0,0,0.05)]
          ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
          ${
            darkMode
              ? "bg-black/90 border-gray-800"
              : "bg-white/40 border-white/20"
          }`}
        >
          {/* Create Note */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                setShowEditor(true);
                setEditingNote(null);
                setSelectedNote(null);
              }}
              className={`relative group mb-6 w-12 h-12 flex items-center justify-center rounded-2xl border shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${
                darkMode
                  ? "bg-gray-900 border-gray-700 text-white hover:bg-gray-800"
                  : "bg-white/60 border-white/30 text-gray-700 hover:bg-white/80"
              }`}
            >
              <span className="text-2xl font-bold">+</span>
            </button>
          </div>

          {/* Theme + Logout */}
          <div className="flex flex-col items-center space-y-4 mb-16">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative group w-12 h-12 flex items-center justify-center rounded-xl border backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm ${
                darkMode
                  ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
                  : "bg-gradient-to-br from-white/80 to-gray-100 border-gray-200"
              }`}
            >
              {darkMode ? (
                <SunMedium className="w-5 h-5 text-amber-400" />
              ) : (
                <MoonStar className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="relative group w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 border border-red-500/60 shadow-sm hover:scale-110 active:scale-95 hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 sm:p-12 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-semibold tracking-tight">Notes</h1>
          </div>

          {/* Notes or Empty State */}
          {!showEditor && !showViewModal && (
            <>
              {filteredNotes.length > 0 ? (
                <NoteList
                  notes={filteredNotes}
                  onViewNote={handleViewNote}
                  darkMode={darkMode}
                  searchQuery={searchQuery}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-32">
                  {notes.length === 0 ? (
                    <>
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
                    </>
                  ) : (
                    <p className="text-gray-500 text-lg">
                      🔍 No matching notes found.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl px-4">
            <NoteEditor
              existingTitle={editingNote ? editingNote.title : ""}
              existingContent={editingNote ? editingNote.content : ""}
              onSave={handleSaveNote}
              onCancel={() => setShowEditor(false)}
            />
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNote && (
        <NoteViewModal
          note={selectedNote}
          onClose={() => setShowViewModal(false)}
          onEdit={handleEditNoteFromView}
          onDelete={handleDeleteNote}
          darkMode={darkMode}
        />
      )}

      {/* Floating Create Button (Mobile) */}
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
