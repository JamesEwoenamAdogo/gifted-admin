import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/all-groups");
        setItems(response.data.allGroups || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchExams();
  }, []);

  const handleViewDetails = (item) => {
    localStorage.setItem("groupDetails", JSON.stringify(item));
    window.location.href = "/app/group-details";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/delete-course/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              {/* <p className="text-gray-600 text-sm">{`${item.?.length} books added`}</p> */}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleViewDetails(item)}
              >
                Show Details
              </button>
              <button
                className="text-red-600 hover:text-red-800 text-xl"
                title="Delete"
                onClick={() => handleDelete(item._id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
