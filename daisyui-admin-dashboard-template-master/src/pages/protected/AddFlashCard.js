import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddFlashcardPage() {
  const [flashcard, setFlashcard] = useState({
    question: "",
    answer: "",
    difficulty: "Easy",
  });

  const [flashcardsList, setFlashcardsList] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlashcard((prev) => ({ ...prev, [name]: value }));
  };

  const saveFlashcard = async () => {
    try {
      const response = await axios.post("/add-flashcard", {
        ...flashcard,
        courseId: localStorage.getItem("courseId"),
      });
      console.log(response)

      if (response.data.succes) {
        toast.success("✅ Flashcard saved successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        setFlashcard({ question: "", answer: "", difficulty: "Easy" });
      } else {
        toast.error("❌ Failed to save flashcard", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("⚠️ Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveFlashcard();
    navigate("/flashcards");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#003366]">
          {`Add New Flashcard to  ${localStorage.getItem("courseName")}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              name="question"
              rows={3}
              value={flashcard.question}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Enter the flashcard question..."
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              name="answer"
              rows={3}
              value={flashcard.answer}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Enter the flashcard answer..."
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={flashcard.difficulty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={saveFlashcard}
              className="w-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save & Add Another
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
