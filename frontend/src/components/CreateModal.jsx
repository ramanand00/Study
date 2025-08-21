import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CreateModal = ({ type, structure, setStructure, currentPath, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const newStructure = JSON.parse(JSON.stringify(structure));
    
    if (type === 'course') {
      newStructure.courses.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        semesters: []
      });
    } else if (type === 'semester' && currentPath[0]) {
      const course = newStructure.courses.find(c => c.name === currentPath[0]);
      if (course) {
        course.semesters.push({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name: name,
          books: []
        });
      }
    } else if (type === 'book' && currentPath[1]) {
      const course = newStructure.courses.find(c => c.name === currentPath[0]);
      if (course) {
        const semester = course.semesters.find(s => s.name === currentPath[1]);
        if (semester) {
          semester.books.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name: name,
            chapters: []
          });
        }
      }
    } else if (type === 'chapter' && currentPath[2]) {
      const course = newStructure.courses.find(c => c.name === currentPath[0]);
      if (course) {
        const semester = course.semesters.find(s => s.name === currentPath[1]);
        if (semester) {
          const book = semester.books.find(b => b.name === currentPath[2]);
          if (book) {
            book.chapters.push({
              id: name.toLowerCase().replace(/\s+/g, '-'),
              name: name,
              notes: ''
            });
          }
        }
      }
    }
    
    setStructure(newStructure);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder={`Enter ${type} name`}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;