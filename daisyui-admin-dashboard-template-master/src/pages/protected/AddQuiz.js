import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [grade, setGrade] = useState("");
  const [image, setImage] = useState({});
  const [isFeatured, setIsFeatured] = useState(false); // ✅ New state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("time", time);
    formData.append("numberOfQuestions", numberOfQuestions);
    formData.append("grade", grade);
    formData.append("image", image);
    formData.append("featured", isFeatured); // ✅ Include isFeatured
    formData.append("questions", JSON.stringify(questions));

    questions.forEach((q) => {
      if (q.image) {
        formData.append("questionImages", q.image);
      }
    });

    try {
      const response = await axios.post("/add-exam", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: null,
        image: null,
        explanation: "",
      },
    ]);
  };

  const updateQuestion = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const updateAnswer = (qIndex, aIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[aIndex] = value;
    setQuestions(updatedQuestions);
  };

  const selectCorrectAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer =
      updatedQuestions[qIndex].answers[aIndex];
    setQuestions(updatedQuestions);
  };

  const updateQuestionImage = (qIndex, file) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].image = file;
    setQuestions(updatedQuestions);
  };

  const updateExplanation = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].explanation = value;
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    console.log(
      title,
      description,
      time,
      numberOfQuestions,
      grade,
      isFeatured,
      questions
    );
  }, [title, description, time, numberOfQuestions, grade, isFeatured]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      <label className="block mb-2">Title</label>
      <input type="text" className="w-full p-2 border rounded mb-4" onChange={(e) => setTitle(e.target.value)} />

      <label className="block mb-2">Description</label>
      <textarea className="w-full p-2 border rounded mb-4" onChange={(e) => setDescription(e.target.value)}></textarea>

      <label className="block mb-2">Image</label>
      <input type="file" className="w-full p-2 border rounded mb-4" onChange={(e) => setImage(e.target.files[0])} />

      <label className="block mb-2">Time Limit (minutes)</label>
      <input type="number" className="w-full p-2 border rounded mb-4" min="1" onChange={(e) => setTime(e.target.value)} />

      <label className="block mb-2">Number of Questions</label>
      <input type="number" className="w-full p-2 border rounded mb-4" min="1" onChange={(e) => setNumberOfQuestions(e.target.value)} />

      <label className="block mb-2">Grade</label>
      <input type="text" className="w-full p-2 border rounded mb-4" onChange={(e) => setGrade(e.target.value)} />

      {/* ✅ Featured Checkbox */}
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        <span>Feature this quiz</span>
      </label>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded mb-4">
          <label className="block mb-2">Question</label>
          <input type="text" className="w-full p-2 border rounded mb-4" value={q.question} onChange={(e) => updateQuestion(qIndex, e.target.value)} />

          <label className="block mb-2">Question Image</label>
          <input type="file" className="w-full p-2 border rounded mb-4" onChange={(e) => updateQuestionImage(qIndex, e.target.files[0])} />

          {q.answers.map((a, aIndex) => (
            <div key={aIndex} className="flex items-center mb-2">
              <input type="text" className="w-full p-2 border rounded mr-2" value={a} onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)} />
              <input type="checkbox" checked={q.correctAnswer === a} onChange={() => selectCorrectAnswer(qIndex, aIndex)} />
            </div>
          ))}

          <label className="block mb-2">Correct Answer Explanation</label>
          <textarea className="w-full p-2 border rounded mb-4" value={q.explanation} onChange={(e) => updateExplanation(qIndex, e.target.value)}></textarea>
        </div>
      ))}

      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addQuestion}>
        Add New Question
      </button>

      {questions.length > 0 && (
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}
    </div>
  );
}
