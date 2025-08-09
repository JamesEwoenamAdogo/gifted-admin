import React, { useState } from "react";
import axios from "axios";
import { toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CreateTimedChallenge = () => {
  const [challengeTitle, setChallengeTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const handleAddQuestion = () => {
    if (
      currentQuestion.question.trim() === "" ||
      currentQuestion.options.some((opt) => opt.trim() === "")
    ) {
      alert("Please fill out the question and all options.");
      return;
    }

    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  const handleSubmitChallenge = async () => {
    const challengeData = {
      // title: challengeTitle,
      courseId: localStorage.getItem("courseId"),
      time: parseInt(timeLimit), // in minutes
      ...currentQuestion,
    };
    console.log("Submitting Challenge:", challengeData);
    const response = await axios.post("/add-timed-challenge",challengeData)

    if(response.data.success){
      console.log(response)
      toast.success("timed challenge question added successfully",{toastId:"my-id"})
      setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
    }

    // alert("Challenge Created!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-900">{`Create Time Challenge for ${localStorage.getItem("courseName")}`}</h1>
      <ToastContainer/>
      {/* <div className="mb-4">
        <label className="block mb-1 font-medium">Challenge Title</label>
        <input
          type="text"
          value={challengeTitle}
          onChange={(e) => setChallengeTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Enter title"
        />
      </div> */}

      <div className="mb-6">
        <label className="block mb-1 font-medium">Time Limit (in minutes)</label>
        <input
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="e.g., 10"
        />
      </div>

      <div className="mb-6 border p-4 rounded-md bg-gray-50">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Add Time Challenge</h2>

        <label className="block mb-1 font-medium">Question</label>
        <textarea
          value={currentQuestion.question}
          onChange={(e) =>
            setCurrentQuestion({ ...currentQuestion, question: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Enter question"
        />

        <label className="block mb-2 font-medium">Options</label>
        {currentQuestion.options.map((opt, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full px-4 py-2 border rounded-md mr-3"
              placeholder={`Option ${index + 1}`}
            />
            <input
              type="radio"
              name="correct"
              checked={currentQuestion.correctAnswer === index}
              onChange={() =>
                setCurrentQuestion({ ...currentQuestion, correctAnswer: index })
              }
              className="w-5 h-5"
              title="Mark as correct answer"
            />
          </div>
        ))}

        <button
          onClick={handleSubmitChallenge}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Add Question
        </button>
      </div>

      {/* {questions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-green-700">Questions Preview:</h3>
          <ul className="list-decimal pl-5 space-y-3">
            {questions.map((q, idx) => (
              <li key={idx}>
                <strong>Q:</strong> {q.question}
                <ul className="list-disc pl-5">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={i === q.correctAnswer ? "font-semibold text-green-700" : ""}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmitChallenge}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
      >
        Submit Challenge
      </button> */}
    </div>
  );
};

export default CreateTimedChallenge;
