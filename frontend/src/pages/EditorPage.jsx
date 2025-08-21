import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import NoteEditor from '../components/NoteEditor'
import NotePreview from '../components/NotePreview'
import CreateModal from '../components/CreateModal'

function EditorPage({ fileStructure, setFileStructure, notes, setNotes }) {
  const [currentPath, setCurrentPath] = useState([])
  const [currentNote, setCurrentNote] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createModalType, setCreateModalType] = useState('')

  // Fetch structure from backend on mount
  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/structure');
        if (res.data && res.data.courses) {
          setFileStructure({ courses: res.data.courses });
        }
      } catch (err) {
        console.error('Failed to fetch structure from backend', err);
      }
    };
    fetchStructure();
    // eslint-disable-next-line
  }, []);

  const handleCreateNew = (type) => {
    setCreateModalType(type)
    setShowCreateModal(true)
  }

  // Persist structure changes to backend
  const persistStructure = async (newStructure) => {
    try {
      await axios.put('http://localhost:5000/api/structure', newStructure);
    } catch (err) {
      console.error('Failed to save structure to backend', err);
    }
  }

  const handleSaveNote = async () => {
    if (!currentPath.length) return;
    const title = currentPath.join(' / ');
    try {
      // Send note to backend
      const res = await axios.post('http://localhost:5000/api/notes', {
        title,
        content: currentNote,
        path: currentPath // Optionally send the path for more structure
      });
      // Optionally update local state with response
      const newNotes = { ...notes };
      const pathKey = currentPath.join('-');
      newNotes[pathKey] = currentNote;
      setNotes(newNotes);
      alert('Note saved to database!');
    } catch (err) {
      alert('Failed to save note to database.');
      console.error(err);
    }
  }
// ...existing code...

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        structure={fileStructure} 
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        setCurrentNote={setCurrentNote}
        notes={notes}
        onCreateNew={handleCreateNew}
      />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">
              {currentPath.length > 0 ? currentPath.join(' / ') : 'My Notes'}
            </h1>
          </div>
          <div className="flex space-x-2">
            <Link 
              to="/preview" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Preview Mode
            </Link>
            {currentPath.length > 0 && (
              <>
                <button 
                  onClick={() => setIsPreview(!isPreview)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
                <button 
                  onClick={handleSaveNote}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {currentPath.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-700">Welcome to Notes Manager</h2>
              <p className="text-gray-500 mt-2">Select a chapter from the sidebar to start taking notes</p>
            </div>
          ) : isPreview ? (
            <NotePreview content={currentNote} />
          ) : (
            <NoteEditor content={currentNote} setContent={setCurrentNote} />
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateModal
          type={createModalType}
          structure={fileStructure}
          setStructure={async (newStructure) => {
            setFileStructure(newStructure);
            await persistStructure(newStructure);
          }}
          currentPath={currentPath}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}

export default EditorPage