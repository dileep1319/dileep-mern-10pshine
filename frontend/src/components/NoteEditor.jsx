import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import Quill styles
import './NoteEditor.css'; // Custom CSS for Quill

const NoteEditor = ({ existingContent = '', onSave }) => {
  const [content, setContent] = useState(existingContent);

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    onSave(content);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link', 'image', 'video',
  ];

  return (
    <div className="note-editor bg-white rounded-lg shadow-md p-4">
      <ReactQuill
        value={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className="h-64 mb-12"
      />
      <div className="flex justify-end">
  <button
    onClick={handleSave}
    className="mt-4 px-6 py-2 bg-black text-white font-medium rounded-md transform transition-transform duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
  >
    Save Note
  </button>
</div>

    </div>
  );
};

export default NoteEditor;
