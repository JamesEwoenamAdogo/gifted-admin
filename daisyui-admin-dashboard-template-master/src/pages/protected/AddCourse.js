import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [grade, setGrade] = useState("");
  const [files, setFiles] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const categoryOptions = ["Math", "Science", "Arts", "Technology"];
 useEffect(()=>{
  console.log()
 },[])
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(uploadedFiles);
  };

  const handleThumbnailUpload = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", courseTitle);
    formData.append("grade", grade);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("duration", duration);
    formData.append("level", level);
    formData.append("featured", featured);
    tags.forEach(tag => formData.append("tags", tag));
    files.forEach(file => formData.append("files", file));
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await axios.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Course Submitted:", response.data);
      setCourses([...courses, { id: Date.now(), title: courseTitle, grade }]);
      setCourseTitle("");
      setGrade("");
      setFiles([]);
      setThumbnail(null);
      setDescription("");
      setCategory("");
      setDuration("");
      setLevel("");
      setFeatured(false);
      setTags([]);
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

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={3}
        />

        <label className="block mb-2 font-semibold">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Duration</label>
        <input 
          type="text" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
        />

        <label className="block mb-2 font-semibold">Level</label>
        <input 
          type="text" 
          value={level} 
          onChange={(e) => setLevel(e.target.value)} 
          className="w-full p-2 border rounded mb-4" 
        />

        <div className="mb-4">
          <label className="block font-semibold mb-2">Featured</label>
          <input 
            type="checkbox" 
            checked={featured} 
            onChange={(e) => setFeatured(e.target.checked)} 
            className="mr-2"
          />
          <span>This course is featured</span>
        </div>

        <label className="block mb-2 font-semibold">Tags</label>
        <div className="flex mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 p-2 border rounded-l"
            placeholder="Enter tag"
          />
          <button
            onClick={handleTagAdd}
            className="bg-blue-500 text-white px-4 rounded-r"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center">
              {tag}
              <button
                onClick={() => handleTagRemove(tag)}
                className="ml-2 text-red-500 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <label className="block mb-2 font-semibold">Upload Files</label>
        <input 
          type="file" 
          multiple 
          onChange={handleFileUpload} 
          className="w-full p-2 border rounded mb-4" 
        />

        <label className="block mb-2 font-semibold">Upload Course Thumbnail</label>
        <input 
          type="file" 
          onChange={handleThumbnailUpload} 
          className="w-full p-2 border rounded mb-4" 
        />

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Submit Course
        </button>
      </form>
    </div>
  );
}
