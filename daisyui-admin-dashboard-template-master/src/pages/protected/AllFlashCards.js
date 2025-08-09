import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FlashcardsListPage() {
  const courseId = localStorage.getItem("courseId");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);

  // Fetch flashcards on load
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/flash-card/${courseId}`);
      setFlashcards(res.data.allQuestions || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const deleteFlashcard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) return;
    try {
      await axios.delete(`/delete-flash-card-item/${id}`);
      toast.success("Flashcard deleted");
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const deleteAllFlashcards = async () => {
    if (!window.confirm("Are you sure you want to delete ALL flashcards?")) return;
    try {
      await axios.delete(`/delete-flash-card/${courseId}`);
      toast.success("All flashcards deleted");
      setFlashcards([]);
    } catch (err) {
      console.error(err);
      toast.error("Delete all failed");
    }
  };

  const startEditing = (card) => {
    setEditingCard({ ...card });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingCard((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/edit-flash-card-item/${editingCard._id}`, editingCard);
      toast.success("Flashcard updated");
      setEditingCard(null);
      fetchFlashcards();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#003366]">
          Flashcards List
        </h1>

        {loading ? (
          <p className="text-center">Loading flashcards...</p>
        ) : flashcards.length === 0 ? (
          <p className="text-center text-gray-500">No flashcards found.</p>
        ) : (
          <div className="space-y-4">
            {flashcards.map((card) => (
              <motion.div
                key={card._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
              >
                <p>
                  <strong>Question:</strong> {card.question}
                </p>
                <p>
                  <strong>Answer:</strong> {card.answer}
                </p>
                <p>
                  <strong>Difficulty:</strong> {card.difficulty}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(card)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFlashcard(card._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {flashcards.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={deleteAllFlashcards}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg"
            >
              Delete All
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Flashcard</h2>
            <label className="block mb-2 text-sm">Question</label>
            <textarea
              name="question"
              value={editingCard.question}
              onChange={handleEditChange}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <label className="block mb-2 text-sm">Answer</label>
            <textarea
              name="answer"
              value={editingCard.answer}
              onChange={handleEditChange}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <label className="block mb-2 text-sm">Difficulty</label>
            <select
              name="difficulty"
              value={editingCard.difficulty}
              onChange={handleEditChange}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
