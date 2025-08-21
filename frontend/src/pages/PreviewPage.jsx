// src/components/PreviewPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const PreviewPage = () => {
  const [currentView, setCurrentView] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [notes, setNotes] = useState({});
  const [structure, setStructure] = useState({ courses: [] });

  // Fetch structure and notes from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [structureRes, notesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/structure'),
          axios.get('http://localhost:5000/api/notes'),
        ]);
        if (structureRes.data && structureRes.data.courses) {
          setStructure({ courses: structureRes.data.courses });
        }
        const notesObj = {};
        notesRes.data.forEach(note => {
          const pathKey = note.path ? note.path.join('-') : note.title;
          notesObj[pathKey] = note.content;
        });
        setNotes(notesObj);
      } catch (err) {
        console.error('Failed to fetch structure or notes from backend', err);
      }
    };
    fetchData();
  }, []);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSemester(null);
    setSelectedBook(null);
    setSelectedChapter(null);
    setCurrentView('semesters');
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setSelectedBook(null);
    setSelectedChapter(null);
    setCurrentView('books');
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(null);
    setCurrentView('chapters');
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView('notes');
  };

  const handleBack = () => {
    if (currentView === 'notes') {
      setCurrentView('chapters');
      setSelectedChapter(null);
    } else if (currentView === 'chapters') {
      setCurrentView('books');
      setSelectedBook(null);
    } else if (currentView === 'books') {
      setCurrentView('semesters');
      setSelectedSemester(null);
    } else if (currentView === 'semesters') {
      setCurrentView('courses');
      setSelectedCourse(null);
    }
  };

  const getBreadcrumb = () => {
    const items = ['Courses'];
    if (selectedCourse) items.push(selectedCourse.name);
    if (selectedSemester) items.push(selectedSemester.name);
    if (selectedBook) items.push(selectedBook.name);
    if (selectedChapter) items.push(selectedChapter.name);
    
    return items.join(' / ');
  };

  const getNoteContent = () => {
    if (!selectedCourse || !selectedSemester || !selectedBook || !selectedChapter) return '';
    const pathKey = [
      selectedCourse.name, 
      selectedSemester.name, 
      selectedBook.name, 
      selectedChapter.name
    ].join('-');
    return notes[pathKey] || '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notes Preview</h1>
          <p className="text-sm text-gray-500">{getBreadcrumb()}</p>
        </div>
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Editor
        </Link>
      </header> */}

      <main className="p-6">
        <div className="mb-4">
          {currentView !== 'courses' && (
            <button 
              onClick={handleBack}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          )}
        </div>

        {currentView === 'courses' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structure.courses.map(course => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{course.name}</h3>
                  </div>
                  <p className="text-gray-600">{course.semesters.length} semesters available</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'semesters' && selectedCourse && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Semesters in {selectedCourse.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCourse.semesters.map(semester => (
                <div 
                  key={semester.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSemesterSelect(semester)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{semester.name}</h3>
                  </div>
                  <p className="text-gray-600">{semester.books.length} books available</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'books' && selectedSemester && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Books in {selectedSemester.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedSemester.books.map(book => (
                <div 
                  key={book.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleBookSelect(book)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{book.name}</h3>
                  </div>
                  <p className="text-gray-600">{book.chapters.length} chapters available</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'chapters' && selectedBook && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Chapters in {selectedBook.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedBook.chapters.map(chapter => (
                <div 
                  key={chapter.id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4">{chapter.name}</h3>
                  </div>
                  <p className="text-gray-600">Click to view notes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'notes' && selectedChapter && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{selectedChapter.name}</h2>
              <p className="text-gray-600">
                {selectedCourse.name} / {selectedSemester.name} / {selectedBook.name}
              </p>
            </div>
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: getNoteContent() }}
            />
            
            {!getNoteContent() && (
              <div className="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No notes available for this chapter yet.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewPage;