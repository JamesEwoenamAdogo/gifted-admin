import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function AddCourseModule() {
  const navigate = useNavigate();
  const locator = useLocation();
  const courseId = locator.state;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [uploadType, setUploadType] = useState("file");

  const [files, setFiles] = useState([]);
  const [videos, setVideos] = useState([""]);
  const [resources, setResources] = useState([""]);
  const [image, setImage] = useState(null);

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = value;
    setVideos(updatedVideos);
  };

  const handleAddVideoField = () => {
    setVideos([...videos, ""]);
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...resources];
    updatedResources[index] = value;
    setResources(updatedResources);
  };

  const handleAddResourceField = () => {
    setResources([...resources, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedVideos = videos.filter((v) => v && v.trim() !== "");
      const videosJson = JSON.stringify(cleanedVideos);
      const resourcesJson = JSON.stringify(resources.filter((r) => r.trim() !== ""));
      let uploadedFiles = [];
      let uploadedImage = "";

      if (uploadType === "file" && files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("Videos", videosJson);
        formData.append("resources", resourcesJson);


        const res = await axios.post(`/upload-course-details/${courseId}`, formData);
        console.log(res)
        console.log(courseId)
        uploadedFiles = res.data.files;
      }

      if (uploadType === "image" && image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("Videos", videosJson);
        formData.append("Resources", resourcesJson);


        const res = await axios.post(`/upload-course-details/${courseId}`, formData);
        uploadedImage = res.data.url;
      }

      if (uploadType === "resources") {
        await axios.post(`/upload-course-details/${courseId}`, {
          courseId,
          title,
          description,
          duration,
          files: [],
          Videos: videosJson,
          image: "",
          resources: resourcesJson,
        });
      } else if (uploadType === "video") {
        await axios.post(`/upload-course-details/${courseId}`, {
          courseId,
          title,
          description,
          duration,
          files: [],
          Videos: videosJson,
          image: "",
          resources: resourcesJson,
        });
      } else {
        await axios.post(`/upload-course-details/${courseId}`, {
          courseId,
          title,
          description,
          duration,
          files: uploadedFiles,
          Videos: videosJson,
          image: uploadedImage,
          resources: resourcesJson,
        });
      }

      navigate(-1);
    } catch (err) {
      console.error("Module creation error:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Module</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Duration (e.g., 30 minutes)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Upload Type</label>
          <div className="flex gap-4">
            {["file", "video", "image", "resources"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="uploadType"
                  value={type}
                  checked={uploadType === type}
                  onChange={() => setUploadType(type)}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {uploadType === "file" && (
          <div>
            <label className="block font-medium">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </div>
        )}

        {uploadType === "video" && (
          <div>
            <label className="block font-medium mb-2">Video URLs</label>
            {videos.map((url, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Video URL ${index + 1}`}
                className="border px-3 py-2 w-full mb-2 rounded"
                value={url}
                onChange={(e) => handleVideoChange(index, e.target.value)}
              />
            ))}
            <button
              type="button"
              onClick={handleAddVideoField}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add another video
            </button>
          </div>
        )}

        {uploadType === "image" && (
          <div>
            <label className="block font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}

        {uploadType === "resources" && (
          <div>
            <label className="block font-medium mb-2">Resource URLs</label>
            {resources.map((url, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Resource URL ${index + 1}`}
                className="border px-3 py-2 w-full mb-2 rounded"
                value={url}
                onChange={(e) => handleResourceChange(index, e.target.value)}
              />
            ))}
            <button
              type="button"
              onClick={handleAddResourceField}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add another resource
            </button>
          </div>
        )}

        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Save Module
          </button>
        </div>
      </form>
    </div>
  );
}
