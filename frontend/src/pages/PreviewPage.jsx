import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const PreviewPage = () => {
  const { courseId, semesterId, bookId, chapterId } = useParams();
  const navigate = useNavigate();

  const [structure, setStructure] = useState({ courses: [] });
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [structureRes, notesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/structure"),
          axios.get("http://localhost:5000/api/notes"),
        ]);

        if (structureRes.data?.courses) {
          setStructure({ courses: structureRes.data.courses });
        }

        const notesObj = {};
        notesRes.data.forEach((note) => {
          const pathKey = note.path ? note.path.join("-") : note.title;
          notesObj[pathKey] = note.content;
        });
        setNotes(notesObj);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Resolve selections based on URL params
  const selectedCourse = structure.courses.find((c) => c.id === courseId);
  const selectedSemester = selectedCourse?.semesters.find((s) => s.id === semesterId);
  const selectedBook = selectedSemester?.books.find((b) => b.id === bookId);
  const selectedChapter = selectedBook?.chapters.find((ch) => ch.id === chapterId);

  // 🔹 Navigation handlers update URL instead of local state
  const handleCourseSelect = (course) => navigate(`/courses/${course.id}`);
  const handleSemesterSelect = (semester) =>
    navigate(`/courses/${courseId}/${semester.id}`);
  const handleBookSelect = (book) =>
    navigate(`/courses/${courseId}/${semesterId}/${book.id}`);
  const handleChapterSelect = (chapter) =>
    navigate(`/courses/${courseId}/${semesterId}/${bookId}/${chapter.id}`);

  const handleBack = () => {
    if (chapterId) navigate(`/courses/${courseId}/${semesterId}/${bookId}`);
    else if (bookId) navigate(`/courses/${courseId}/${semesterId}`);
    else if (semesterId) navigate(`/courses/${courseId}`);
    else if (courseId) navigate(`/courses`);
  };

  const getNoteContent = () => {
    if (!selectedCourse || !selectedSemester || !selectedBook || !selectedChapter)
      return "";
    const pathKey = [
      selectedCourse.name,
      selectedSemester.name,
      selectedBook.name,
      selectedChapter.name,
    ].join("-");
    return notes[pathKey] || "";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        {courseId && (
          <button
            onClick={handleBack}
            className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
          >
            ⬅ Back
          </button>
        )}

        {/* Courses */}
        {!courseId && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structure.courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className="bg-white p-6 rounded-lg shadow cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">{course.name}</h3>
                  <p>{course.semesters.length} semesters</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semesters */}
        {courseId && !semesterId && selectedCourse && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Semesters in {selectedCourse.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCourse.semesters.map((semester) => (
                <div
                  key={semester.id}
                  onClick={() => handleSemesterSelect(semester)}
                  className="bg-white p-6 rounded-lg shadow cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">{semester.name}</h3>
                  <p>{semester.books.length} books</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books */}
        {semesterId && !bookId && selectedSemester && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Books in {selectedSemester.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedSemester.books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="bg-white p-6 rounded-lg shadow cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">{book.name}</h3>
                  <p>{book.chapters.length} chapters</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapters */}
        {bookId && !chapterId && selectedBook && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Chapters in {selectedBook.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedBook.chapters.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleChapterSelect(ch)}
                  className="bg-white p-6 rounded-lg shadow cursor-pointer"
                >
                  <h3 className="text-xl font-semibold">{ch.name}</h3>
                  <p>Click to view notes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {chapterId && selectedChapter && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-2">{selectedChapter.name}</h2>
            <p className="text-gray-600">
              {selectedCourse.name} / {selectedSemester.name} / {selectedBook.name}
            </p>
            <div
              className="prose max-w-none mt-4"
              dangerouslySetInnerHTML={{ __html: getNoteContent() }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewPage;
