import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/all-exams-admin");
        const allExaminations = response.data.allExaminations || [];
        setItems(allExaminations);
        setFilteredItems(allExaminations);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleViewDetails = (item) => {
    localStorage.setItem("id", item._id);
    window.location.href = "/app/quiz-details";
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`/delete-exam/${id}`);
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        setFilteredItems(updatedItems);
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete the quiz.");
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>

      {/* Live Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search quizzes by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Quiz List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleViewDetails(item)}
              >
                Show all Questions
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500">No quizzes found.</p>
        )}
      </div>
    </div>
  );
}
