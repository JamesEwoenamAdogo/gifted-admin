import { useEffect, useState } from "react";
import axios from "axios"

export default function ItemList() {
  const [items, setItems] = useState([]);
  useEffect(()=>{
    const fetchExams = async()=>{
      const response = await axios.get("/all-exams")
      if(response.data.success){
        setItems(()=>{return [...response.data.allCompetitions]})
      }
      console.log(items)
      
    }
    fetchExams()
  },[])

  const handleUpdate = (id) => {
    alert(`Update item with ID: ${id}`);
  };

  const handleViewDetails = (item) => {
    alert(`Details:\nName: ${item.name}\nDescription: ${item.description}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md flex justify-between items-center">
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
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleUpdate(item.id)}
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
