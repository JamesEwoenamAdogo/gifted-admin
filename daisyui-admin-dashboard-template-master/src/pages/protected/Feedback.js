import { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [allExams, setAllExams] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");

  // Fetch all exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get("/all-exams-admin");
        setAllExams(res.data.allExaminations || []);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
      }
    };
    fetchExams();
  }, []);

  // Fetch all feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("/all-fedback");
        setFeedbacks(res.data.allFeedback || []);
        setFilteredFeedbacks(res.data.allFeedback || []);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      }
    };
    fetchFeedbacks();
  }, []);

  // Filter feedback by selected quiz
  useEffect(() => {
    if (!selectedQuizId) {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter((fb) => fb.quizId === selectedQuizId);
      setFilteredFeedbacks(filtered);
    }
  }, [selectedQuizId, feedbacks]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Comments</h1>

      {/* Quiz Filter Dropdown */}
      <div className="mb-6">
        <select
          className="border px-4 py-2 rounded w-full md:w-1/2"
          value={selectedQuizId}
          onChange={(e) => setSelectedQuizId(e.target.value)}
        >
          <option value="">Filter by Quiz</option>
          {allExams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((fb, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <p className="text-gray-800">{fb.feedback}</p>
            {/* {fb.fullName && (
              <p className="text-sm text-gray-500 mt-2">By: {fb.fullName}</p>
            )} */}
          </div>
        ))}
        {filteredFeedbacks.length === 0 && (
          <p className="text-center text-gray-500">No feedback found.</p>
        )}
      </div>
    </div>
  );
}
