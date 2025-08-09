import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewAllTimedChallengePage() {
  const courseId = localStorage.getItem("courseId");
  const [questions, setQuestions] = useState([]);
  const [time, setTime] = useState("");
  const [editModal, setEditModal] = useState(null); // Holds the item being edited
  const [editTimeModal, setEditTimeModal] = useState(false);
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`/timed-challenge/${courseId}`);
      console.log(res)
      setQuestions(res.data.allQuestions || []);
      if (res.data.allQuestions.length > 0) {
        setTime(res.data.allQuestions[0].time);
        setNewTime(res.data.allQuestions[0].time);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch questions");
    }
  };

  const deleteQuestion = async (id) => {
    try {
      await axios.delete(`/delete-timed-challenge-questions/${id}`);
      toast.success("Question deleted");
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  const editQuestion = async () => {
    try {
       delete editModal.createdAt
       delete editModal.updatedAt
       delete editModal._id
       delete editModal.__v
       delete editModal.time
       const response = await axios.put(`/edit-timed-challenge-questions/${localStorage.getItem("questionId")}`, editModal);
       console.log(response)
       console.log(editModal)
    
      toast.success("Question updated");
      setEditModal(null);
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to update question");
      console.log(err)
    }
  };

  const deleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all questions?")) return;
    try {
      await axios.delete(`/delete-timed-challenge/${courseId}`);
      toast.success("All questions deleted");
      setQuestions([]);
    } catch (err) {
      toast.error("Failed to delete all questions");
    }
  };

  const updateTime = async () => {
    if (questions.length === 0) return;
    try {
      // Update all questions' time
      for (let q of questions) {
        await axios.put(`/edit-timed-challenge-questions/${localStorage.getItem("courseId")}`, {
          ...q,
          time: newTime,
        });
      }
      toast.success("Time updated for all questions");
      setTime(newTime);
      setEditTimeModal(false);
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to update time");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Timed Challenge</h2>
        {time && (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Time: {time} seconds</span>
            <button
              onClick={() => setEditTimeModal(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Edit Time
            </button>
          </div>
        )}
      </div>

      {questions.map((item) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          <p className="font-semibold">{item.question}</p>
          <ul className="mt-2 list-disc list-inside">
            {item.options.map((opt, idx) => (
              <li
                key={idx}
                className={idx === item.correct ? "text-green-600 font-bold" : ""}
              >
                {opt}
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { localStorage.setItem("questionId",item._id);setEditModal(item)}}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => deleteQuestion(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}

      {questions.length > 0 && (
        <div className="mt-6">
          <button
            onClick={deleteAll}
            className="bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete All
          </button>
        </div>
      )}

      {/* Edit Question Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow max-w-lg w-full">
            <h3 className="text-lg font-bold mb-4">Edit Question</h3>
            <textarea
              value={editModal.question}
              onChange={(e) =>
                setEditModal({ ...editModal, question: e.target.value })
              }
              className="w-full border p-2 rounded mb-3"
            />
            {editModal.options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...editModal.options];
                  newOptions[idx] = e.target.value;
                  setEditModal({ ...editModal, options: newOptions });
                }}
                className="w-full border p-2 rounded mb-2"
              />
            ))}
            <label className="block mb-2">Correct Option Index</label>
            <input
              type="number"
              value={editModal.correct}
              onChange={(e) =>
                setEditModal({ ...editModal, correct: Number(e.target.value) })
              }
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={editQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     {/* Edit Question Modal */}
{editModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow max-w-lg w-full">
      <h3 className="text-lg font-bold mb-4">Edit Question</h3>
      <textarea
        value={editModal.question}
        onChange={(e) =>
          setEditModal({ ...editModal, question: e.target.value })
        }
        className="w-full border p-2 rounded mb-3"
      />
      {editModal.options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="correctOption"
            checked={editModal.correct === idx}
            onChange={() =>
              setEditModal({ ...editModal, correct: idx })
            }
          />
          <input
            type="text"
            value={opt}
            onChange={(e) => {
              const newOptions = [...editModal.options];
              newOptions[idx] = e.target.value;
              setEditModal({ ...editModal, options: newOptions });
            }}
            className="w-full border p-2 rounded"
          />
        </div>
      ))}
      <div className="flex gap-3 mt-4">
        <button
          onClick={editQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEditModal(null)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{/* Edit Time Modal */}
{editTimeModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow max-w-sm w-full">
      <h3 className="text-lg font-bold mb-4">Edit Time</h3>
      <input
        type="number"
        value={newTime}
        onChange={(e) => setNewTime(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />
      <div className="flex gap-3">
        <button
          onClick={updateTime}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={() => setEditTimeModal(false)}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
