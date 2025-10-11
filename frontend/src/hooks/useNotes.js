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


    const fetchNotes = async () => {
        const token = getToken();
        if (!token) return;
        try {
        const { data } = await API.get("/notes", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(data);
        } catch (error) {
        console.error("Failed to fetch notes:", error.response?.data?.message || error);
        }
    };

    const createNote = async (title, content) => {
        const token = getToken();
        if (!token) return;
        try {
        const { data } = await API.post(
            "/notes/create-note",
            { title, content },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotes((prev) => [...prev, data.note]);
        } catch (error) {
        console.error("Error creating note:", error.response?.data?.message || error);
        alert("Failed to create note");
        }
    };

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
        } catch (error) {
        console.error("Error updating note:", error.response?.data?.message || error);
        alert("Failed to update note");
        }
    };

    const deleteNote = async (id) => {
        const token = getToken();
        if (!token) return;
        try {
        await API.delete(`/notes/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes((prev) => prev.filter((note) => note.id !== id));
        } catch (error) {
        console.error("Error deleting note:", error.response?.data?.message || error);
        alert("Failed to delete note");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return { notes, createNote, updateNote, deleteNote };
    };
