import { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'katex/dist/katex.min.css';


export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [grade, setGrade] = useState("");
  const [image, setImage] = useState({});
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [allowReview, setAllowReview] = useState(false);
  const [displayScores, setDisplayScores] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("time", time);
    formData.append("numberOfQuestions", numberOfQuestions);
    formData.append("grade", grade);
    formData.append("image", image);
    formData.append("featured", isFeatured);
    formData.append("publish", isPublished);
    formData.append("attemptsAllowed", attemptsAllowed);
    formData.append("allowQuizReview", allowReview);
    formData.append("displayScores", displayScores);
    formData.append("showFeedBackForm", showFeedbackForm);
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
      isPublished,
      attemptsAllowed,
      allowReview,
      displayScores,
      showFeedbackForm,
      questions
    );
  }, [
    title,
    description,
    time,
    numberOfQuestions,
    grade,
    isFeatured,
    isPublished,
    attemptsAllowed,
    allowReview,
    displayScores,
    showFeedbackForm,
    questions,
  ]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      <label className="block mb-2">Title</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mb-2">Description</label>
      <textarea
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <label className="block mb-2">Image</label>
      <input
        type="file"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <label className="block mb-2">Time Limit (minutes)</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-4"
        min="1"
        onChange={(e) => setTime(e.target.value)}
      />

      <label className="block mb-2">Number of Questions</label>
      <input
        type="number"
        className="w-full p-2 border rounded mb-4"
        min="1"
        onChange={(e) => setNumberOfQuestions(e.target.value)}
      />

      <label className="block mb-2">Grade</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setGrade(e.target.value)}
      />

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        <span>Feature this quiz</span>
      </label>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <span>Publish this quiz</span>
      </label>

      <label className="block mb-2">Attempts Allowed</label>
      <input
        type="number"
        min="1"
        className="w-full p-2 border rounded mb-4"
        value={attemptsAllowed}
        onChange={(e) => setAttemptsAllowed(e.target.value)}
      />

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={allowReview}
          onChange={(e) => setAllowReview(e.target.checked)}
        />
        <span>Allow Review After Completion</span>
      </label>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={displayScores}
          onChange={(e) => setDisplayScores(e.target.checked)}
        />
        <span>Display Scores After Submission</span>
      </label>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={showFeedbackForm}
          onChange={(e) => setShowFeedbackForm(e.target.checked)}
        />
        <span>Show Feedback Form After Quiz</span>
      </label>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded mb-4">
          <label className="block mb-2">Question</label>
          <ReactQuill
            theme="snow"
            value={q.question}
            onChange={(value) => updateQuestion(qIndex, value)}
            className="mb-4"
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{ script: 'sub' }, { script: 'super' }], // Subscript & Superscript
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['clean'],
                ['formula'],

              ],
            }}
            formats={[
              'bold',
              'italic',
              'underline',
              'script',
              'list',
              'bullet',
              'formula'
            ]}
          />

          <label className="block mb-2">Question Image</label>
          <input
            type="file"
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => updateQuestionImage(qIndex, e.target.files[0])}
          />

          {q.answers.map((a, aIndex) => (
  <div key={aIndex} className="mb-4">
    <div className="flex items-start gap-2">
      <div className="w-full">
        <ReactQuill
          theme="snow"
          value={a}
          onChange={(value) => updateAnswer(qIndex, aIndex, value)}
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ script: 'sub' }, { script: 'super' }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['clean'],
              ['formula'],
            ],
          }}
          formats={[
            'bold',
            'italic',
            'underline',
            'script',
            'list',
            'bullet',
            'formula',
          ]}
        />
      </div>
      <div className="mt-2">
        <input
          type="checkbox"
          checked={q.correctAnswer === a}
          onChange={() => selectCorrectAnswer(qIndex, aIndex)}
        />
      </div>
    </div>
  </div>
))}


          <label className="block mb-2">Correct Answer Explanation</label>
          <textarea
            className="w-full p-2 border rounded mb-4"
            value={q.explanation}
            onChange={(e) => updateExplanation(qIndex, e.target.value)}
          ></textarea>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={addQuestion}
      >
        Add New Question
      </button>

      {questions.length > 0 && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      )}
    </div>
  );
}
