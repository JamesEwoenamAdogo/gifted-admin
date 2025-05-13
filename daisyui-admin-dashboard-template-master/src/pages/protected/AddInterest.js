import axios from 'axios';
import React, { useState } from 'react';

const AddInterest = () => {
  const [interest, setInterest] = useState('');

  // Handle change in input
  const handleInputChange = async(e) => {
    // const response = await axios.post("/add-interest")
    // console.log(response)
    setInterest(e.target.value);
  };

  // Handle form submission (for example, logging the input)
  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const response = await axios.post("/add-interest",{name:interest})
    console.log(response)
    console.log("Interest Submitted:", interest);
    // You can add additional logic here, like saving the interest or sending it to a backend
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Add Your Interest</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="interest" className="block text-gray-700 font-medium mb-2">
            Your Interest:
          </label>
          <input
            type="text"
            id="interest"
            name="interest"
            value={interest}
            onChange={handleInputChange}
            placeholder="Enter your interest"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInterest;
