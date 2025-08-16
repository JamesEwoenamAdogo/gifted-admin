import React, { useState, useEffect } from "react";
import { Pencil, Save, X, PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CourseDetailsPage() {
  const navigate = useNavigate();
  const courseData = JSON.parse(localStorage.getItem("courseInfo"));
  const courseId = courseData._id;

  const [courseInfo, setCourseInfo] = useState({});
  const [modules, setModules] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [moduleEditing, setModuleEditing] = useState({});
  // Inside CourseDetailsPage component...

const [fileUploadModuleId, setFileUploadModuleId] = useState(null);
const [newVideos, setNewVideos] = useState("");
const [videoEditingModuleId, setVideoEditingModuleId] = useState(null);

const handleFilesUpload = async (moduleId, files) => {
  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const res = await axios.put(`/upload-module/${moduleId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updated = await axios.put(`/update-module/${moduleId}`, {
      files: res.data.files, // expecting `files: [url1, url2]`
    });

    setModules((prev) =>
      prev.map((mod) => (mod._id === moduleId ? { ...mod, files: updated.data.files } : mod))
    );
    setFileUploadModuleId(null);
  } catch (err) {
    console.error("File upload error:", err);
  }
};

const handleAddVideoLink = async (moduleId) => {
  try {
    const mod = modules.find((m) => m._id === moduleId);
    const updatedVideos = [...(mod.Videos || []), newVideos.trim()];
    await axios.put(`/update-module/${moduleId}`, {
      Videos: updatedVideos,
    });
    setModules((prev) =>
      prev.map((mod) => (mod._id === moduleId ? { ...mod, Videos: updatedVideos } : mod))
    );
    setVideoEditingModuleId(null);
    setNewVideos("");
  } catch (err) {
    console.error("Error adding video:", err);
  }
};


  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const res = await axios.get(`/fetch-course-info/${courseId}`);
        setCourseInfo(res.data.courseInfo);
      } catch (error) {
        console.error("Error fetching course info:", error);
      }
    };

    const fetchModules = async () => {
      try {
        const res = await axios.get(`/fetch-course-details/${courseId}`);
        setModules(res.data.course || []);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchCourseInfo();
    fetchModules();
  }, [courseId]);

  const handleEditField = (field) => {
    setEditingField(field);
    setFieldValue(
      Array.isArray(courseInfo[field])
        ? courseInfo[field].join(", ")
        : courseInfo[field]
    );
  };

  const handleSaveField = async () => {
    try {
      let payload = {};

      if (editingField === "thumbnail" && thumbnailFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("thumbnail", thumbnailFile);

        const uploadRes = await axios.put(`/update-course-info/${courseId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        payload.thumbnail = uploadRes.data.url;
      } else if (editingField === "program") {
        payload[editingField] = fieldValue.split(",").map((s) => s.trim());
      } else {
        payload[editingField] = fieldValue;
      }

      await axios.put(`/update-course-info/${courseId}`, payload);

      setCourseInfo((prev) => ({
        ...prev,
        [editingField]: payload[editingField],
      }));
      setEditingField(null);
      setThumbnailFile(null);
      setUploading(false);
    } catch (error) {
      console.error("Failed to update field:", error);
      setUploading(false);
    }
  };

  const handleToggleCourseBoolean = async (field, newValue) => {
    try {
      await axios.put(`/update-course-info/${courseId}`, { [field]: newValue });
      setCourseInfo((prev) => ({ ...prev, [field]: newValue }));
    } catch (error) {
      console.error(`Failed to toggle ${field}:`, error);
    }
  };

  const handleAddNew = () => {
    navigate("/app/add-module",{state:courseId});
  };

  const handleDeleteModule = async (moduleId) => {
    try {
      await axios.delete(`/delete-module/${moduleId}`);
      setModules(modules.filter((mod) => mod._id !== moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleModuleFieldEdit = (moduleId, field, value) => {
    setModuleEditing({ moduleId, field });
    setFieldValue(value);
  };

  const handleModuleFieldSave = async (moduleId) => {
    try {
      const payload = {
        [moduleEditing.field]: fieldValue,
      };
      await axios.put(`/update-module/${moduleId}`, payload);
      const updatedModules = modules.map((mod) =>
        mod._id === moduleId ? { ...mod, ...payload } : mod
      );
      setModules(updatedModules);
      setModuleEditing({});
    } catch (err) {
      console.error("Error updating module field:", err);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6 bg-blue-50 min-h-screen w-[85%]">
      <button
        className="text-sm text-gray-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-4">Course Details</h1>

      {/* COURSE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow">
        {[
          "title",
          "description",
          "duration",
          "grade",
          "category",
          "program",
          "featured",
          "publish",
          "thumbnail",
        ].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 capitalize">
              {field}
            </label>
            {(["featured", "publish"].includes(field) || typeof courseInfo[field] === "boolean") ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  checked={Boolean(courseInfo[field])}
                  onChange={(e) => handleToggleCourseBoolean(field, e.target.checked)}
                />
                <span className="text-sm text-gray-800">{Boolean(courseInfo[field]) ? "On" : "Off"}</span>
              </div>
            ) : editingField === field ? (
              <div className="flex items-center gap-2 mt-1">
                {field === "thumbnail" ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                    <button
                      onClick={handleSaveField}
                      disabled={uploading}
                      className="text-green-600"
                    >
                      {uploading ? "Uploading..." : <Save size={20} />}
                    </button>
                    <button onClick={() => setEditingField(null)}>
                      <X size={20} className="text-gray-500" />
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded w-full"
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                    />
                    <button onClick={handleSaveField}>
                      <Save size={20} className="text-green-600" />
                    </button>
                    <button onClick={() => setEditingField(null)}>
                      <X size={20} className="text-gray-500" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                {field === "thumbnail" ? (
                  <img
                    src={courseInfo.thumbnail}
                    alt="Course Thumbnail"
                    className="w-40 h-28 object-cover rounded border"
                  />
                ) : (
                  <p className="text-gray-800 text-sm break-words">
                    {Array.isArray(courseInfo[field])
                      ? courseInfo[field].join(", ")
                      : courseInfo[field]}
                  </p>
                )}
                <button onClick={() => handleEditField(field)}>
                  <Pencil size={18} className="text-blue-600" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD NEW MODULE */}
      <div className="flex justify-end">
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          <PlusCircle size={20} /> Add New Material
        </button>
      </div>

      {/* MODULES LIST */}
      <div className="space-y-4">
        {modules.map((mod) => (
          <div
            key={mod._id}
            className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-600"
          >
            <div className="flex justify-between items-start">
              <div className="w-full space-y-2">
                {/* TITLE */}
                <div className="flex justify-between">
                  {moduleEditing.moduleId === mod._id && moduleEditing.field === "title" ? (
                    <div className="flex gap-2 w-full">
                      <input
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      />
                      <button onClick={() => handleModuleFieldSave(mod._id)}>
                        <Save size={20} className="text-green-600" />
                      </button>
                      <button onClick={() => setModuleEditing({})}>
                        <X size={20} className="text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {mod.title}
                      <button onClick={() => handleModuleFieldEdit(mod._id, "title", mod.title)}>
                        <Pencil size={16} className="text-blue-600" />
                      </button>
                    </h3>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => navigate("/app/edit-course-module")}>
                      <Pencil size={20} />
                    </button>
                    <button onClick={() => handleDeleteModule(mod._id)}>
                      <Trash2 size={20} className="text-red-600" />
                    </button>
                  </div>
                </div>

                {/* DESCRIPTION */}
                {moduleEditing.moduleId === mod._id && moduleEditing.field === "description" ? (
                  <div className="flex gap-2">
                    <input
                      value={fieldValue}
                      onChange={(e) => setFieldValue(e.target.value)}
                      className="border px-2 py-1 w-full rounded"
                    />
                    <button onClick={() => handleModuleFieldSave(mod._id)}>
                      <Save size={20} className="text-green-600" />
                    </button>
                    <button onClick={() => setModuleEditing({})}>
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    <strong>Description:</strong> {mod.description}
                    <button
                      onClick={() => handleModuleFieldEdit(mod._id, "description", mod.description)}
                      className="ml-2"
                    >
                      <Pencil size={14} className="inline text-blue-500" />
                    </button>
                  </p>
                )}

                {/* FILES */}
                {/* FILES */}
<div>
  <div className="flex justify-between items-center">
    <strong>Files:</strong>
    <button onClick={() => setFileUploadModuleId(mod._id)}>
      <Pencil size={16} className="text-blue-600" />
    </button>
  </div>
  {fileUploadModuleId === mod._id ? (
    <div className="flex gap-2 mt-2">
      <input
        type="file"
        multiple
        onChange={(e) => handleFilesUpload(mod._id, Array.from(e.target.files))}
      />
      <button onClick={() => setFileUploadModuleId(null)}>
        <X size={18} />
      </button>
    </div>
  ) : mod.files?.length ? (
    <ul className="list-disc pl-5 text-blue-600 text-sm">
      {mod.files.map((f, i) => (
        <li key={i}>
          <a href={f} target="_blank" rel="noreferrer" className="underline">
            {decodeURIComponent(f.split("/").pop())}
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm italic text-gray-500">No files uploaded</p>
  )}
</div>

{/* VIDEOS */}
<div>
  <div className="flex justify-between items-center">
    <strong>Videos:</strong>
    <button onClick={() => setVideoEditingModuleId(mod._id)}>
      <Pencil size={16} className="text-blue-600" />
    </button>
  </div>
  {videoEditingModuleId === mod._id ? (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="border px-2 py-1 w-full rounded"
        placeholder="Paste video URL"
        value={newVideos}
        onChange={(e) => setNewVideos(e.target.value)}
      />
      <button onClick={() => handleAddVideoLink(mod._id)}>
        <Save size={18} className="text-green-600" />
      </button>
      <button onClick={() => setVideoEditingModuleId(null)}>
        <X size={18} />
      </button>
    </div>
  ) : mod.Videos?.length ? (
    <ul className="list-disc pl-5 text-green-700 text-sm">
      {mod.Videos.map((v, i) => (
        <li key={i}>
          <a href={v} target="_blank" rel="noreferrer" className="underline">
            {decodeURIComponent(v.split("/").pop())}
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-sm italic text-gray-500">No videos</p>
  )}
</div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
