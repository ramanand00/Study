import React from 'react';

const NotePreview = ({ content }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full overflow-auto">
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default NotePreview;