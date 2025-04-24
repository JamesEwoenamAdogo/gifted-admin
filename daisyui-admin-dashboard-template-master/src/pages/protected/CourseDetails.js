import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CourseDetails = () => {
  const [details, setDetails] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [showFileModal, setShowFileModal] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const loadCourseDetails = async () => {
      const response = await axios.get(`/course/${localStorage.getItem("id")}`);
      setDetails({ ...response.data.courseDetails });
    };
    loadCourseDetails();
  }, [editingField]);

  const openEditModal = (field) => {
    setFormData({ [field]: details[field] });
    if (field === 'image') {
      setImagePreview(details[field]);
    }
    setEditingField(field);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleUrl = ()=>{
    if(editingField==="image"){
        return `/update-course-thumbnail/${localStorage.getItem("id")}`
    }
    else if(editingField=="file"){
        return `/update-course-files/${localStorage.getItem("id")}`

    }
    else{
        return `/update-course-details/${localStorage.getItem("id")}`

    }
}



  const handleSave = async () => {
    const token = localStorage.getItem("token");
    let payload;
    const url = handleUrl()
    
    if (editingField === 'image') {
      payload = new FormData();
      payload.append('thumbnail', formData.image);
    } else {
      payload = { [editingField]: formData[editingField] };
    }

    try {
      await axios.put(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(editingField === 'image' && { 'Content-Type': 'multipart/form-data' })
          }
        }
      );
      setEditingField(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleAddFiles = async () => {
    const token = localStorage.getItem("token");
    const courseId = localStorage.getItem("id");

    const formData = new FormData();
    newFiles.forEach(file => formData.append("files", file));

    // Append existing files to retain them
    (details.files || []).forEach((fileUrl, index) => {
      formData.append("existingFiles", fileUrl);
    });

    try {
      const response = await axios.put(`/update-course-files/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Assuming response returns updated list
      setDetails(prev => ({ ...prev, files: response.data.updatedFiles }));
      setNewFiles([]);
      setShowFileModal(false);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleDeleteFile = async (index) => {
    const updatedFiles = details.files.filter((_, i) => i !== index);
    setDetails({ ...details, files: updatedFiles });
  
    try {
      const response = await axios.put(
        `/update-course-details/${localStorage.getItem("id")}`,
        { files: updatedFiles }
      );
      console.log(response);
    } catch (error) {
      console.error("Failed to update course details:", error);
    }
  };
  

  const renderEditButton = (field) => (
    <button
      onClick={() => openEditModal(field)}
      className="text-sm text-blue-600 underline ml-2"
    >
      Edit
    </button>
  );

  const renderEditableField = (label, field) => (
    <p>
      <strong>{label}:</strong> {Array.isArray(details[field]) ? details[field]?.join(', ') : details[field]} {renderEditButton(field)}
    </p>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Course Details</h1>
      {renderEditableField("Title", "title")}
      {renderEditableField("Description", "description")}
      {renderEditableField("Grade", "grade")}
      {renderEditableField("Category", "category")}
      {renderEditableField("Duration", "duration")}
      {renderEditableField("Level", "level")}
      {renderEditableField("Rating", "rating")}
      {renderEditableField("Tags", "tags")}
      <p><strong>Registered:</strong> {details.registered}</p>

      {details.image && (
        <div className="my-4">
          <p><strong>Image:</strong> {renderEditButton('image')}</p>
          <img
            src={details.image}
            alt="Course"
            className="mt-2 w-64 h-auto rounded"
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
        <ul className="space-y-2">
          {details.files?.map((file, index) => (
            <li key={index} className="flex items-center gap-4">
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View File {index + 1}
              </a>
              <button
                onClick={() => handleDeleteFile(index)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button
            onClick={() => setShowFileModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add File
          </button>
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 capitalize">Edit {editingField}</h2>
            {editingField === 'image' ? (
              <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-64 h-auto" />}
              </div>
            ) : (
              <input
                name={editingField}
                value={formData[editingField] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Files</h2>
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => setNewFiles(Array.from(e.target.files))}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowFileModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFiles}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
