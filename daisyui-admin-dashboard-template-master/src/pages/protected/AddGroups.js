// src/pages/AdminCreateGroup.jsx
import { useState } from "react";
import axios from "axios";

export default function AdminCreateGroup() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);
    const token = localStorage.getItem("token")
  
    try {
      const res = await axios.post("/create-group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token
        
        },
      });
      setMessage("Group created successfully!");
      setName("");
      setDescription("");
      setImage(null);
    } catch (err) {
      setMessage("Failed to create group.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Group</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
          required
            />
        <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded-xl"
        />
        
        <textarea
          placeholder="Group Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-xl"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
        >
          Create Group
        </button>
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
