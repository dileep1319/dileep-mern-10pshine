import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./NoteEditor.css";

const NoteEditor = ({ existingContent = "", onSave = () => {}, onCancel = () => {} }) => {
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

  useEffect(() => setContent(existingContent || ""), [existingContent]);

  const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link"];
  
  const handleSave = () => {
    if (!content || content.trim() === "" || content === "<p><br></p>") return;
    onSave(content);
  };

  return (
    <div className="note-editor">
      <div className="editor-wrapper">
        <ReactQuill
          ref={editorRef}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          theme="snow"
          className="quill-container"
          placeholder="Start writing your note..."
        />
      </div>

      <div className="editor-footer">
        <button onClick={onCancel} className="btn-cancel">Cancel</button>
        <button onClick={handleSave} className="btn-save">Save</button>
      </div>
    </div>
  );
};

export default NoteEditor;
