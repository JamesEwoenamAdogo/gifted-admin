import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [modules, setModules] = useState([{ title: "", videos: [], files: [] }]);

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedModules = [...modules];
    updatedModules[index][name] = value;
    setModules(updatedModules);
  };

  const handleFileUpload = async (index, e, type) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append(type, file));

    try {
      const response = await fetch(`http://localhost:5000/upload/${type}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload Response:", data);

      const uploadedFiles = data.files.map((file) => file.url);

      const updatedModules = [...modules];
      updatedModules[index][type] = [...updatedModules[index][type], ...uploadedFiles];
      setModules(updatedModules);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const addModule = () => {
    setModules([...modules, { title: "", videos: [], files: [] }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses([...courses, { id: Date.now(), title: courseTitle, modules }]);
    setCourseTitle("");
    setModules([{ title: "", videos: [], files: [] }]);
    console.log("Submitted Course:", { title: courseTitle, modules });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
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

        {modules.map((module, index) => (
          <div key={index} className="p-4 rounded-md shadow-md mb-4">
            <label className="block mb-2 font-semibold">Module Title</label>
            <input 
              type="text" 
              name="title" 
              value={module.title} 
              onChange={(e) => handleModuleChange(index, e)} 
              className="w-full p-2 border rounded mb-4" 
              required 
            />

            <label className="block mb-2 font-semibold">Upload Videos</label>
            <input 
              type="file" 
              multiple 
              name="videos" 
              onChange={(e) => handleFileUpload(index, e, "video")} 
              className="w-full p-2 border rounded mb-4" 
              required 
            />

            <label className="block mb-2 font-semibold">Upload Files</label>
            <input 
              type="file" 
              multiple 
              name="files" 
              onChange={(e) => handleFileUpload(index, e, "file")} 
              className="w-full p-2 border rounded mb-4" 
              required 
            />

            <button 
              type="button" 
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center" 
              onClick={() => removeModule(index)}
            >
              <FaTrash className="mr-1" /> Remove Module
            </button>
          </div>
        ))}

        <button 
          type="button" 
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4" 
          onClick={addModule}
        >
          <FaPlus /> Add Module
        </button>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Submit Course
        </button>
      </form>
    </div>
  );
}
