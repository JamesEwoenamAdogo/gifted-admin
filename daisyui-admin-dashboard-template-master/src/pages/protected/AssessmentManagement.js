import { PlusCircle, Eye } from "lucide-react";

export default function QuizOptions() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add New Quiz Card */}
        <div className="p-6  shadow-lg rounded-2xl flex flex-col items-center text-center">
          <PlusCircle size={48} className="text-blue-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Add New Quiz</h2>
          <p className="text-gray-600 mb-4">Create a new quiz with custom questions.</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={()=>{window.location.href="/app/add-quiz"}}>Add Quiz</button>
        </div>

        {/* View All Quizzes Card */}
        <div className="p-6 shadow-lg rounded-2xl flex flex-col items-center text-center">
          <Eye size={48} className="text-green-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">View All Quizzes</h2>
          <p className="text-gray-600 mb-4">Browse and manage existing quizzes.</p>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" onClick={()=>{window.location.href="/app/quizzes"}}>View Quizzes</button>
        </div>
      </div>
    </div>
  );
}
