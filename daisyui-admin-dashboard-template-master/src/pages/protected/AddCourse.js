import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CreateCoursePage() {
  const [courseInfo, setCourseInfo] = useState({
    title: "",
    grade: [],
    description: "",
    category: "",
    duration: "",
    level: "",
    featured: false,
    thumbnail: null,
    program: "",
    cost:""
  });

  const [modules, setModules] = useState([]);
  const [ categories,setCategories]= useState([])
  const [programs,setPrograms]= useState([])

  // const programs = ["STEM Program", "Arts Program", "Leadership Program", "Entrepreneurship Program"];
    // const programs = ["STEM Program", "Arts Program", "Leadership Program", "Entrepreneurship Program"];
    // const categories = ["Science", "Math", "Arts", "Technology", "Language", "Business"];
    const gradesList = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
    
    const handleAddModule = () => {
      setModules([
        ...modules,
        {
        title: "",
        description: "",
        duration: "",
        includeImage: false,
        includePdf: false,
        includeVideo: false,
        images: [],
        pdfs: [],
        videoLinks: [""],
      },
    ]);
  };
  
 const handleCourseChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  if (name === "thumbnail") {
    setCourseInfo({ ...courseInfo, thumbnail: files[0] });

  } else if (name === "grade") {
    let updatedGrades = [...courseInfo.grade];

    if (checked) {
      updatedGrades.push(value);
    } else {
      updatedGrades = updatedGrades.filter((g) => g !== value);
    }

    setCourseInfo({ ...courseInfo, grade: updatedGrades });

  } else {
    setCourseInfo({
      ...courseInfo,
      [name]: type === "checkbox" ? checked : value,
    });
  }
};


  const handleModuleChange = (index, field, value) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const handleFileChange = (index, field, files) => {
    const updated = [...modules];
    updated[index][field] = Array.from(files);
    setModules(updated);
  };

  const handleVideoLinkChange = (index, vIndex, value) => {
    const updated = [...modules];
    updated[index].videoLinks[vIndex] = value;
    setModules(updated);
  };
  
  const addVideoField = (index) => {
    const updated = [...modules];
    updated[index].videoLinks.push("");
    setModules(updated);
  };
  
  const handleSubmitCourseInfo = async () => {
    try {
      const formData = new FormData()
      formData.append("title", courseInfo.title);
      formData.append("grade", JSON.stringify(courseInfo.grade));
      formData.append("description", courseInfo.description);
      formData.append("category", courseInfo.category);
      formData.append("duration", courseInfo.duration);
      // formData.append("level", courseInfo.level);
      formData.append("publish", courseInfo.featured);
      formData.append("program", courseInfo.program);
      formData.append("cost", courseInfo.cost);
      if (courseInfo.thumbnail) {
        formData.append("thumbnail", courseInfo.thumbnail);
      }
      
      const response = await axios.post("/upload-course-info", formData);
      if (response.data.success) {
        alert("Course info submitted successfully!");
        localStorage.setItem("courseId", response.data._id);
      } else {
        throw new Error("Failed to submit course info");
      }
    } catch (error) {
      console.error("Error submitting course info:", error);
      alert("Error submitting course info");
    }
  };
  useEffect(()=>{
    const loadCategories= async()=>{
      const response = await axios.get("/all-interest")
      
      console.log(response)
      const interest = response.data.allInterest.map((item)=>item.name)
      setCategories(interest)
    }
    loadCategories()
  },[])
  useEffect(()=>{
    const loadPrograms = async()=>{
      const response = await axios.get("/all-competitions")
      
      console.log(response)
      const competition = response.data.AllCompetitions.map((item)=>item.name)
      setPrograms(competition)
    }
    loadPrograms()
  },[])
  
  const handleSubmitModule = async (index) => {
    const courseId = localStorage.getItem("courseId");
    if (!courseId) {
      alert("Please submit course info first.");
      return;
    }

    const module = modules[index];
    const formData = new FormData();
    formData.append("title", module.title);
    formData.append("description", module.description);
    formData.append("duration", module.duration);

    formData.append("Videos", JSON.stringify(module.videoLinks));

    if (module.includeImage && module.images.length > 0) {
      module.images.forEach((file) => {
        formData.append("image", file);
      });
    }

    if (module.includePdf && module.pdfs.length > 0) {
      module.pdfs.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await axios.post(`/upload-course-details/${courseId}`, formData);
      if (response.data.success) {
        alert(`Module ${index + 1} submitted successfully!`);
      } else {
        throw new Error("Failed to submit module");
      }
    } catch (error) {
      console.error(`Error submitting module ${index + 1}:`, error);
      alert(`Error submitting module ${index + 1}`);
    }
  };

  const handleSubmit = () => {

    console.log("Course Info:", courseInfo);
    console.log("Modules:", modules);
    alert("Course submitted! Check the console for details.");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Create New Course</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="title" placeholder="Course Title" className="border rounded p-2" value={courseInfo.title} onChange={handleCourseChange} />
        {/* <input name="grade" placeholder="Grade" className="border rounded p-2" value={courseInfo.grade} onChange={handleCourseChange} /> */}
        {/* <input name="category" placeholder="Category" className="border rounded p-2" value={courseInfo.category} onChange={handleCourseChange} /> */}
        {/* Cost Input */}
        <input name="cost" placeholder="Cost (e.g., 200)" type="number" className="border rounded p-2" value={courseInfo.cost} onChange={handleCourseChange} />

        {/* Category Dropdown */}
        <select name="category" className="border rounded p-2" value={courseInfo.category} onChange={handleCourseChange}>
          <option value="">Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>





        <input name="duration" placeholder="Duration (e.g., 6 weeks)" className="border rounded p-2" value={courseInfo.duration} onChange={handleCourseChange} />
        {/* <input name="level" placeholder="Level (e.g., Beginner)" className="border rounded p-2" value={courseInfo.level} onChange={handleCourseChange} /> */}
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" checked={courseInfo.featured} onChange={handleCourseChange} />
          Featured
        </label>
        <select name="program" className="border rounded p-2" value={courseInfo.program} onChange={handleCourseChange}>
          <option value="">Select Program</option>
          {programs.map((prog, idx) => (
            <option key={idx} value={prog}>{prog}</option>
          ))}
        </select>

        <div className="col-span-1 md:col-span-2">
          <label className="block font-medium mb-1">Grade Levels</label>
          <div className="grid grid-cols-3 gap-2">
            {gradesList.map((grade) => (
              <label key={grade} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="grade"
                  value={grade}
                  checked={courseInfo.grade.includes(grade)}
                  onChange={handleCourseChange}
                />
                {grade}
              </label>
            ))}
          </div>
        </div>

        <textarea name="description" placeholder="Course Description" className="border rounded p-2 col-span-1 md:col-span-2" rows={4} value={courseInfo.description} onChange={handleCourseChange} />
        <div className="col-span-1 md:col-span-2">
          <label className="block mb-1">Course Thumbnail</label>
          <input type="file" name="thumbnail" accept="image/*" className="border rounded p-2 w-full" onChange={handleCourseChange} />
        </div>
      </div>

      <div>
        <button
          onClick={handleSubmitCourseInfo}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          Submit Course Info
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modules</h2>

        {modules.map((mod, idx) => (
          <div key={idx} className="border rounded p-4 space-y-3 bg-gray-50">
            <input placeholder="Module Title" className="border rounded p-2 w-full" value={mod.title} onChange={(e) => handleModuleChange(idx, "title", e.target.value)} />
            <textarea placeholder="Module Description" className="border rounded p-2 w-full" rows={3} value={mod.description} onChange={(e) => handleModuleChange(idx, "description", e.target.value)} />
            <input placeholder="Module Duration (e.g., 1 week)" className="border rounded p-2 w-full" value={mod.duration} onChange={(e) => handleModuleChange(idx, "duration", e.target.value)} />

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={mod.includeImage} onChange={(e) => handleModuleChange(idx, "includeImage", e.target.checked)} />
                Include Images
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={mod.includePdf} onChange={(e) => handleModuleChange(idx, "includePdf", e.target.checked)} />
                Include PDFs
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={mod.includeVideo} onChange={(e) => handleModuleChange(idx, "includeVideo", e.target.checked)} />
                Include Videos
              </label>
            </div>

            {mod.includeImage && (
              <input type="file" accept="image/*" multiple className="border p-2 rounded w-full" onChange={(e) => handleFileChange(idx, "images", e.target.files)} />
            )}
            {mod.includePdf && (
              <input type="file" accept="application/pdf" multiple className="border p-2 rounded w-full" onChange={(e) => handleFileChange(idx, "pdfs", e.target.files)} />
            )}
            {mod.includeVideo && (
              <div className="space-y-2">
                {mod.videoLinks.map((link, vIndex) => (
                  <input key={vIndex} type="text" placeholder="Video URL" className="border p-2 rounded w-full" value={link} onChange={(e) => handleVideoLinkChange(idx, vIndex, e.target.value)} />
                ))}
                <button onClick={() => addVideoField(idx)} className="text-blue-600 hover:underline text-sm">+ Add another video link</button>
              </div>
            )}

            <div>
              <button
                onClick={() => handleSubmitModule(idx)}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit Module {idx + 1}
              </button>
            </div>
          </div>
        ))}

        <button onClick={handleAddModule} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Module</button>
      </div>

      <div>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Create Course</button>
      </div>
    </div>
  );
}
