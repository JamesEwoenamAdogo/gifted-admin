import React from "react";

function UserDetails() {
  const userDetails = JSON.parse(localStorage.getItem("details"));

  if (!userDetails) {
    return <p className="text-center text-red-500 font-semibold">No user details found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">User Details</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="p-4  rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Personal Information</h2>
          <p><strong>Username:</strong> {userDetails.userName}</p>
          <p><strong>First Name:</strong> {userDetails.firstName}</p>
          <p><strong>Last Name:</strong> {userDetails.lastName}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Gender:</strong> {userDetails.gender}</p>
          <p><strong>Mobile Number:</strong> {userDetails.mobileNumber}</p>
          <p><strong>Country:</strong> {userDetails.country}</p>
        </div>

        {/* Education Details */}
        <div className="p-4  rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Education</h2>
          <p><strong>Educational Level:</strong> {userDetails.educationalLevel}</p>
          <p><strong>School:</strong> {userDetails.school}</p>
          <p><strong>Grade:</strong> {userDetails.grade}</p>
        </div>
      </div>

      {/* Purpose of Registration */}
      <div className="mt-6 p-4  rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Purpose of Registration</h2>
        <ul className="list-disc list-inside text-gray-600">
          {userDetails.purposeOfRegistration.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>

      {/* Registered Items */}
      <div className="mt-6 p-4  rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Registered Items</h2>
        <ul className="list-disc list-inside text-gray-600">
          {userDetails.Registered.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Add-Ons */}
      <div className="mt-6 p-4  rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Add-Ons</h2>
        <ul className="list-disc list-inside text-gray-600">
          {userDetails.AddOns.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Invoice */}
      <div className="mt-6 p-4  rounded-xl">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Invoice</h2>
        {userDetails.Invoice.map((item, index) => (
          <div key={index} className="flex justify-between p-3 rounded-lg shadow-sm mb-2">
            <span className="text-gray-700 font-medium">{item.name}</span>
            <span className="text-blue-600 font-semibold">{item.Cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDetails;
