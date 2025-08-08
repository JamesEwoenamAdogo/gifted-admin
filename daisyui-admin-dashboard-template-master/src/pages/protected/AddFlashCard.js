import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

  const saveFlashcard = () => {
    console.log("Flashcard Added:", flashcard);
    setFlashcardsList((prev) => [...prev, flashcard]);
    setFlashcard({ question: "", answer: "", difficulty: "Easy" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save the current flashcard to the list
    saveFlashcard();

    // Here, you can send the list to your backend
    console.log("Final Flashcards List:", [...flashcardsList, flashcard]);

    // Optional: send to backend
    // await axios.post('/bulk-flashcards', [...flashcardsList, flashcard]);

    alert("Flashcards saved successfully!");
    navigate("/flashcards");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#003366]">
          Add New Flashcard
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

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-1/2 bg-[#003366] hover:bg-[#002244] text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save All & Finish
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
