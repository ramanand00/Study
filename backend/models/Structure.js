const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  id: String,
  name: String,
});

const BookSchema = new mongoose.Schema({
  id: String,
  name: String,
  chapters: [ChapterSchema],
});

const SemesterSchema = new mongoose.Schema({
  id: String,
  name: String,
  books: [BookSchema],
});

const CourseSchema = new mongoose.Schema({
  id: String,
  name: String,
  semesters: [SemesterSchema],
});

const StructureSchema = new mongoose.Schema({
  courses: [CourseSchema],
});

module.exports = mongoose.model('Structure', StructureSchema);
