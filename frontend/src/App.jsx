import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EditorPage from './pages/EditorPage'
import PreviewPage from './pages/PreviewPage'

function App() {
  const [fileStructure, setFileStructure] = useState({
    courses: [
      {
        id: 'csit',
        name: 'Course',
        semesters: [
          {
            id: 'first',
            name: 'Semester',
            books: [
              {
                id: 'physics',
                name: 'Subject',
                chapters: [
                  { id: 'ch1', name: 'Chapter 1', notes: '' },
                  // { id: 'ch2', name: 'Chapter 2', notes: '' },
                ]
              }
            ]
          }
        ]
      }
    ]
  })

  const [notes, setNotes] = useState({})

  // Fetch notes from backend on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notes');
        // Convert array of notes to object with pathKey as key
        const notesObj = {};
        res.data.forEach(note => {
          // Use pathKey if available, else fallback to title
          const pathKey = note.path ? note.path.join('-') : note.title;
          notesObj[pathKey] = note.content;
        });
        setNotes(notesObj);
      } catch (err) {
        console.error('Failed to fetch notes from backend', err);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <EditorPage 
              fileStructure={fileStructure} 
              setFileStructure={setFileStructure}
              notes={notes}
              setNotes={setNotes}
            />
          } 
        />
        <Route 
          path="/preview" 
          element={
            <PreviewPage 
              fileStructure={fileStructure} 
              notes={notes}
            />
          } 
        />
      </Routes>
    </Router>
  )
}

export default App