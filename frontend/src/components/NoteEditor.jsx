import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./NoteEditor.css";

const NoteEditor = ({ existingContent = "", onSave }) => {
  const [content, setContent] = useState(existingContent);
  const [modules, setModules] = useState({});

  useEffect(() => {
    // Simplify toolbar for small screens
    const isMobile = window.innerWidth < 640;
    setModules({
      toolbar: isMobile
        ? [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ]
        : [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
    });
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  const handleChange = (value) => setContent(value);

  const handleSave = () => {
    if (content.trim() === "" || content === "<p><br></p>") return;
    onSave(content);
  };

  return (
    <div className="note-editor bg-white rounded-xl shadow-md p-4 sm:p-5">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className="quill-container"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="save-btn mt-2 sm:mt-3 bg-black text-white px-6 py-2 rounded-md font-medium transition-transform transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
