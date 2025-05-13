import { PlusCircle, Eye } from "lucide-react";

export default function InterestPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Quiz Card */}
        <div className="p-6  shadow-lg rounded-2xl flex flex-col items-center text-center">
          <PlusCircle size={48} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Add New Interest</h2>
          <p className="text-gray-600 mb-4">Create a new subject Interest</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>{window.location.href="/app/add-interest"}}>Add Interest</button>
        </div>

        {/* View All Quizzes Card */}
        <div className="p-6 shadow-lg rounded-2xl flex flex-col items-center text-center">
          <Eye size={48} className="text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">View All Interests</h2>
          <p className="text-gray-600 mb-4">Browse and manage existing interests.</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={()=>{window.location.href="/app/all-interest"}}>View Interest</button>
        </div>
      </div>
    </div>
  );
}
