import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./NoteEditor.css";

const NoteEditor = ({
  existingTitle = "",
  existingContent = "",
  onSave = () => {},
  onCancel = () => {},
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [content, setContent] = useState(existingContent || "");
  const [modules, setModules] = useState({});
  const editorRef = useRef(null);

  useEffect(() => {
    const applyModules = () => {
      const isMobile = window.innerWidth < 640;
      setModules({
        toolbar: isMobile
          ? [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }]]
          : [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              ["clean"],
            ],
      });
    };
    applyModules();
    window.addEventListener("resize", applyModules);
    return () => window.removeEventListener("resize", applyModules);
  }, []);

  useEffect(() => {
    setTitle(existingTitle || "");
    setContent(existingContent || "");
  }, [existingTitle, existingContent]);

  const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link"];

const handleSave = () => {
  const contentString = typeof content === "string" ? content : JSON.stringify(content);

  if (!title.trim() && (!contentString || contentString.trim() === "" || contentString === "<p><br></p>")) {
    alert("Cannot save an empty note.");
    return;
  }

  onSave({ title: title.trim() || "Untitled", content: contentString });
};


  return (
    <div className="note-editor">
      <div className="editor-wrapper">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="editor-title-input"
        />

        {/* Content Area with Plus Icon */}
        <div className="content-area">
          <div className="quill-container">
            <ReactQuill
              ref={editorRef}
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              theme="snow"
              placeholder="Tell your story..."
            />
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-save">
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteEditor;
