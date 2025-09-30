import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeTab, setActiveTab] = useState("normal"); // "normal" or "contests"

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/all-exams-admin");
        const allExaminations = response.data.allExaminations || [];
        setItems(allExaminations);
        console.log(items)
        setFilteredItems(allExaminations);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    
    // Debug: Log the items and their contest values
    console.log("All items:", items);
    console.log("Active tab:", activeTab);
    items.forEach((item, index) => {
      console.log(`Item ${index}:`, item.title, "contest value:", item.contest, "type:", typeof item.contest);
    });
    
    // First filter by tab (normal quizzes vs contests)
    let tabFilteredItems = items;
    if (activeTab === "contests") {
      // Show only items where contest is explicitly true
      tabFilteredItems = items.filter((item) => item.contest === true);
    } else {
      // Show items where contest is false, undefined, or null
      tabFilteredItems = items.filter((item) => 
        item.contest === false || 
        item.contest === undefined || 
        item.contest === null ||
        item.contest === ""
      );
    }
    
    console.log("Filtered items for tab:", tabFilteredItems.length);
    
    // Then filter by search term
    if (!term) {
      setFilteredItems(tabFilteredItems);
    } else {
      const filtered = tabFilteredItems.filter((item) =>
        item.title.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items, activeTab]);

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

      {/* Tab Filter */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "normal"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("normal")}
          >
            Quizzes
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "contests"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("contests")}
          >
            Contests
          </button>
        </div>
      </div>

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
          <p className="text-center text-gray-500">
            {activeTab === "contests" ? "No contests found." : "No normal quizzes found."}
          </p>
        )}
      </div>
    </div>
  );
}



























