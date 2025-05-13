import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

export default function AllInterest() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/all-interest");
        console.log(response);
        setItems(response.data.allInterest); // Directly set the response data
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchExams();
  }, []); // Empty array to only run once when component mounts

  const handleUpdate = (id) => {
    // alert(`Update item with ID: ${id}`);
    // You can navigate to another page to update the item
    // Example: navigate(`/update-item/${id}`);
  };

  const handleViewDetails = (item) => {
    // When viewing details, you can store the item ID in localStorage and navigate
    localStorage.setItem("id", item._id);
    window.location.href = "/app/quiz-details";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item._id} className="p-4 border rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2> {/* Display item name */}
              <p className="text-gray-600 text-sm">{item.description}</p> Show description if available
            </div>
            <div className="space-x-2">
              {/* <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleViewDetails(item)} // View details of the item
              >
                View Details
              </button> */}
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleUpdate(item._id)} // Handle item update
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
