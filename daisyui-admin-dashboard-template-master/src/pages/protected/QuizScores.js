import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StudentScores = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [results, setResults] = useState([]);

  const years = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => 2015 + i
  );

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("/all-exams-admin");
        setQuizzes(res.data.allExaminations || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!selectedQuizId || !selectedYear) return;
      try {
        const res = await axios.get(`/fetch-results/${selectedQuizId}/${selectedYear}`);
        const sorted = (res.data.results || []).sort(
          (a, b) => b.correctAnswers - a.correctAnswers
        );
        setResults(sorted);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    fetchResults();
  }, [selectedQuizId, selectedYear]);

  const formatDateTime = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleExport = () => {
    const data = results.map((student, index) => ({
      Rank: index + 1,
      "Full Name": student.fullName,
      School: student.school,
      Grade: student.grade,
      Score: `${student.correctAnswers}/${student.numberOfQuestions}`,
      "Date Taken": formatDateTime(student.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Scores");

    const blob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );
    saveAs(blob, "student_scores.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Student Score Rankings</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          <select
            onChange={(e) => setSelectedQuizId(e.target.value)}
            value={selectedQuizId}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm text-gray-700"
          >
            <option value="">Select Quiz</option>
            {quizzes.map((quiz) => (
              <option key={quiz._id} value={quiz._id}>
                {quiz.title}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm text-gray-700"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {results.length > 0 && (
            <button
              onClick={handleExport}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export to Excel
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-100 text-blue-800 text-left">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">School</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Date Completed</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No data available.
                  </td>
                </tr>
              ) : (
                results.map((student, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-3 px-4 font-medium">{index + 1}</td>
                    <td className="py-3 px-4">{student.fullName}</td>
                    <td className="py-3 px-4">{student.school}</td>
                    <td className="py-3 px-4">{student.grade}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {student.correctAnswers}/{student.numberOfQuestions}
                    </td>
                    <td className="py-3 px-4">{formatDateTime(student.updatedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentScores;
