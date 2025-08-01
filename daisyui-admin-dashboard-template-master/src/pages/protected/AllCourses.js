import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("/all-courses");
        const courses = response.data.courses || [];
        setItems(courses);

        // Flatten all program values (whether string or array), remove duplicates
        const allPrograms = courses.flatMap((item) =>
          Array.isArray(item.program) ? item.program : [item.program]
        );
        const uniquePrograms = [...new Set(allPrograms.filter(Boolean))];
        setPrograms(uniquePrograms);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchExams();
  }, []);

  const handleViewDetails = (item) => {
    localStorage.setItem("courseInfo", JSON.stringify(item));
    window.location.href = "/app/course-details";
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

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    const itemPrograms = Array.isArray(item.program) ? item.program : [item.program];
    const matchesProgram = selectedProgram
      ? itemPrograms.includes(selectedProgram)
      : true;

    return matchesSearch && matchesProgram;
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/2"
        />
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-1/2"
        >
          <option value="">Filter by Program</option>
          {programs.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
      </div>

      {/* Item List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-500 text-sm">
                {Array.isArray(item.program) ? item.program.join(", ") : item.program}
              </p>
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

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500">No courses found.</p>
        )}
      </div>
    </div>
  );
}
