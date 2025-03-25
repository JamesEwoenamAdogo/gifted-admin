import { useState } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([
    { title: "", videos: [], files: [] },
  ]);

  const handleModuleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedModules = [...modules];
    updatedModules[index][name] = value;
    setModules(updatedModules);
  };

  const handleFileChange = (index, e, type) => {
    const files = Array.from(e.target.files);
    const updatedModules = [...modules];
    updatedModules[index][type] = [...updatedModules[index][type], ...files];
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: "", videos: [], files: [] }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses([...courses, { id: Date.now(), modules }]);
    setModules([{ title: "", videos: [], files: [] }]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {modules.map((module, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
            <label className="block mb-2 font-semibold">Module Title</label>
            <input type="text" name="title" value={module.title} onChange={(e) => handleModuleChange(index, e)} className="w-full p-2 border rounded mb-4" required />

            <label className="block mb-2 font-semibold">Upload Videos</label>
            <input type="file" multiple name="videos" onChange={(e) => handleFileChange(index, e, 'videos')} className="w-full p-2 border rounded mb-4" required />

            <label className="block mb-2 font-semibold">Upload Files</label>
            <input type="file" multiple name="files" onChange={(e) => handleFileChange(index, e, 'files')} className="w-full p-2 border rounded mb-4" required />

            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded flex items-center" onClick={() => removeModule(index)}>
              <FaTrash className="mr-1" /> Remove Module
            </button>
          </div>
        ))}

        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 mb-4" onClick={addModule}>
          <FaPlus /> Add Module
        </button>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Submit Course</button>
      </form>
    </div>
  );
}
