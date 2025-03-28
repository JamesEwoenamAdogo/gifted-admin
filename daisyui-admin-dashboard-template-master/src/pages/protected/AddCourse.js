import { useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [grade, setGrade] = useState(""); // New state for grade
  const [files, setFiles] = useState([]); // New state for uploaded files

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", courseTitle);
    formData.append("grade", grade);
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("/course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Course Submitted:", response.data);
      setCourses([...courses, { id: Date.now(), title: courseTitle, grade }]);
      setCourseTitle("");
      setGrade("");
      setFiles([]);

    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md">
        <label className="block mb-2 font-semibold">Course Title</label>
        <input 
          type="text" 
          value={courseTitle} 
          onChange={(e) => setCourseTitle(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2 font-semibold">Grade</label>
        <input 
          type="number" 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
          required 
        />

        <label className="block mb-2 font-semibold">Upload Files</label>
        <input 
          type="file" 
          multiple 
          onChange={handleFileUpload} 
          className="w-full p-2 border rounded mb-4" 
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Submit Course
        </button>
      </form>
    </div>
  );
}
