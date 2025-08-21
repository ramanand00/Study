import React from 'react';
import { 
  FolderIcon, 
  DocumentIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';

const Sidebar = ({ 
  structure, 
  currentPath, 
  setCurrentPath, 
  setCurrentNote, 
  notes, 
  onCreateNew 
}) => {
  const handleItemClick = (type, ids, name) => {
    const newPath = [...currentPath];
    
    if (type === 'course') {
      newPath[0] = name;
      setCurrentPath([name]);
    } else if (type === 'semester') {
      newPath[1] = name;
      setCurrentPath([newPath[0], name]);
    } else if (type === 'book') {
      newPath[2] = name;
      setCurrentPath([newPath[0], newPath[1], name]);
    } else if (type === 'chapter') {
      newPath[3] = name;
      setCurrentPath([newPath[0], newPath[1], newPath[2], name]);
      
      // Load the note for this chapter
      const noteKey = [...newPath].join('-');
      setCurrentNote(notes[noteKey] || '');
    }
  };

  const renderCourses = () => {
    return structure.courses.map(course => (
      <div key={course.id} className="ml-4">
        <div 
          className="flex items-center py-1 hover:bg-gray-200 rounded cursor-pointer"
          onClick={() => handleItemClick('course', [course.id], course.name)}
        >
          <FolderIcon className="h-4 w-4 mr-1" />
          <span>{course.name}</span>
        </div>
        
        {currentPath[0] === course.name && (
          <div className="ml-4">
            <div className="flex justify-between items-center mt-2">
              <h3 className="font-medium">Semesters</h3>
              <button 
                onClick={() => onCreateNew('semester')}
                className="text-blue-500 hover:text-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            
            {course.semesters.map(semester => (
              <div key={semester.id} className="ml-4">
                <div 
                  className="flex items-center py-1 hover:bg-gray-200 rounded cursor-pointer"
                  onClick={() => handleItemClick('semester', [course.id, semester.id], semester.name)}
                >
                  <FolderIcon className="h-4 w-4 mr-1" />
                  <span>{semester.name}</span>
                </div>
                
                {currentPath[1] === semester.name && (
                  <div className="ml-4">
                    <div className="flex justify-between items-center mt-2">
                      <h3 className="font-medium">Books</h3>
                      <button 
                        onClick={() => onCreateNew('book')}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {semester.books.map(book => (
                      <div key={book.id} className="ml-4">
                        <div 
                          className="flex items-center py-1 hover:bg-gray-200 rounded cursor-pointer"
                          onClick={() => handleItemClick('book', [course.id, semester.id, book.id], book.name)}
                        >
                          <FolderIcon className="h-4 w-4 mr-1" />
                          <span>{book.name}</span>
                        </div>
                        
                        {currentPath[2] === book.name && (
                          <div className="ml-4">
                            <div className="flex justify-between items-center mt-2">
                              <h3 className="font-medium">Chapters</h3>
                              <button 
                                onClick={() => onCreateNew('chapter')}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                            
                            {book.chapters.map(chapter => (
                              <div 
                                key={chapter.id}
                                className="flex items-center py-1 hover:bg-gray-200 rounded cursor-pointer ml-4"
                                onClick={() => handleItemClick('chapter', [course.id, semester.id, book.id, chapter.id], chapter.name)}
                              >
                                <DocumentIcon className="h-4 w-4 mr-1" />
                                <span>{chapter.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Notes Manager</h2>
        <button 
          onClick={() => onCreateNew('course')}
          className="text-blue-400 hover:text-blue-300"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Courses</h3>
        {renderCourses()}
      </div>
    </div>
  );
};

export default Sidebar;