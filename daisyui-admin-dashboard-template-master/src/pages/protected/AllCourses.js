import { useEffect, useState,useRef } from "react";
import axios from "axios"

export default function ItemList() {
  // let Quizitems =[]
  // const ref= useRef(Quizitems)

  const [items, setItems] = useState([]);
  useEffect(()=>{
    const fetchExams = async()=>{
      const response = await axios.get("/all-courses")
      console.log(response)
    
        setItems(()=>{return [...response.data.courses]})
    
      console.log(items)
      
    }
    fetchExams()
  },[])

  const handleUpdate = (id) => {
    alert(`Update item with ID: ${id}`);
    // localStorage.setItem("id",id)
  };

  const handleViewDetails = (item) => {
    // alert(`Details:\nName: ${item.name}\nDescription: ${item.description}`);
    localStorage.setItem("id",item._id)

    window.location.href="/app/course-details"
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item List</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-gray-600 text-sm">{`${item.files.length} books added`}</p>
            </div>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleViewDetails(item)}
              >
                Show Details
              </button>
              {/* <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => handleUpdate(item)}
              >
                Update
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
