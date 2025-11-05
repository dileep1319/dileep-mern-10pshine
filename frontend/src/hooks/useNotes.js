import { useEffect, useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const getToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo?.token) {
      navigate("/login");
      return null;
    }
    return userInfo.token;
  };

  //Fetch all notes (optionally with ?search=)
  const fetchNotes = async (search = "") => {
    const token = getToken();
    if (!token) return;

    try {
      const endpoint = search
        ? `/notes?search=${encodeURIComponent(search)}`
        : "/notes";

      const { data } = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(data);
      return data;
    } catch (error) {
      console.error(
        "Failed to fetch notes:",
        error.response?.data?.message || error
      );
      return [];
    }
  };

  // Dedicated backend search (uses /notes/search?query=)
  const searchNotes = async (query) => {
    const token = getToken();
    if (!token) return [];
    try {
      const { data } = await API.get(
        `/notes/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      console.error(
        "Error searching notes:",
        error.response?.data?.message || error
      );
      return [];
    }
  };

  // Create
  const createNote = async (title, content) => {
    const token = getToken();
    if (!token) return;

    try {
      const { data } = await API.post(
        "/notes/create-note",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [data.note, ...prev]);
      return data.note;
    } catch (error) {
      console.error(
        "Error creating note:",
        error.response?.data?.message || error
      );
      alert("Failed to create note");
      throw error;
    }
  };

  // Update
  const updateNote = async (id, title, content) => {
    const token = getToken();
    if (!token) return;

    try {
      const { data } = await API.put(
        `/notes/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => prev.map((note) => (note.id === id ? data : note)));
      return data;
    } catch (error) {
      console.error(
        "Error updating note:",
        error.response?.data?.message || error
      );
      alert("Failed to update note");
      throw error;
    }
  };

  // Delete
  const deleteNote = async (id) => {
    const token = getToken();
    if (!token) return;

    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error(
        "Error deleting note:",
        error.response?.data?.message || error
      );
      alert("Failed to delete note");
    }
  };

  // Fetch notes on mount
useEffect(() => {
  if (notes.length === 0) {
    fetchNotes();
  }
}, [notes.length]);


  return {
    notes,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
  };
};
