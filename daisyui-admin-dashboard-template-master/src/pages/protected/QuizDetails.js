import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizDetails = () => {
  const [details, setDetails] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [newQuestion, setNewQuestion] = useState(false);

  useEffect(() => {
    const loadQuizDetails = async () => {
      const response = await axios.get(`/all-exams/${localStorage.getItem("id")}`);
      setDetails({ ...response.data.exam });
    };
    loadQuizDetails();
  }, [editingField]);

  const openEditModal = (field) => {
    if (field.startsWith("question-")) {
      const index = parseInt(field.split("-")[1]);
      setFormData({ ...details.questions[index], index });
      setImagePreview(details.questions[index]?.image || null);
      setImageRemoved(false);
    } else {
      setFormData({ [field]: details[field] });
      if (field === 'image') {
        setImagePreview(details[field]);
      }
    }
    setEditingField(field);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index] = value;
    setFormData({ ...formData, answers: updatedAnswers });
  };

  const handleCorrectAnswerChange = (index) => {
    const correctValue = formData.answers[index];
    setFormData({ ...formData, correctAnswer: correctValue });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
    setImageRemoved(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (editingField.startsWith("question-")) {
      const index = formData.index;
      // If image was explicitly removed, send JSON with image: null
      if (imageRemoved) {
        const payload = {
          question: formData.question,
          explanation: formData.explanation,
          correctAnswer: formData.correctAnswer,
          answers: formData.answers,
          image: null
        };
        try {
          await axios.put(
            `/update-question/${localStorage.getItem("id")}/${index}`,
            JSON.stringify(payload),
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          setEditingField(null);
        } catch (error) {
          console.error("Question update failed:", error);
        }
      } else {
        const form = new FormData();
        form.append("question", formData.question);
        form.append("explanation", formData.explanation);
        form.append("correctAnswer", formData.correctAnswer);
        formData.answers.forEach((ans, i) => {
          form.append(`answers[${i}]`, ans);
        });
        if (formData.image instanceof File) {
          form.append("image", formData.image);
        }
        try {
          await axios.put(
            `/update-question/${localStorage.getItem("id")}/${index}`,
            form,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
              }
            }
          );
          setEditingField(null);
        } catch (error) {
          console.error("Question update failed:", error);
        }
      }

    } else {
      let payload;
      if (editingField === 'image') {
        const form = new FormData();
        form.append("image", formData.image);
        payload = form;
      } else {
        payload = { [editingField]: formData[editingField] };
      }

      try {
        await axios.put(
          `/update-exams/${localStorage.getItem("id")}`,
          payload instanceof FormData ? payload : JSON.stringify(payload),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(payload instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' }),
            },
          }
        );
        setEditingField(null);
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  const renderEditButton = (field) => (
    <button
      onClick={() => openEditModal(field)}
      className="text-sm text-blue-600 underline ml-2"
    >
      Edit
    </button>
  );

  const handleAddQuestion = async () => {
    if (!newQuestion) {
      const question = {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: null,
        image: null,
        explanation: ""
      };
      const updatedQuestions = [...(details.questions || []), question];
      setDetails((prevDetails) => ({
        ...prevDetails,
        numberOfQuestions: updatedQuestions.length,
        questions: updatedQuestions
      }));
    }
    if (newQuestion["question"]) {
      const response = await axios.put(`/add-question/${localStorage.getItem("id")}`, newQuestion);
      console.log(response);
    }
  };

  const handleDeleteQuestion = async (indexToDelete) => {
    const token = localStorage.getItem("token");
    const updatedQuestions = details.questions.filter((_, index) => index !== indexToDelete);
    setDetails((prevDetails) => ({
      ...prevDetails,
      numberOfQuestions: updatedQuestions.length,
      questions: updatedQuestions
    }));

    try {
      await axios.put(
        `/update-exams/${localStorage.getItem("id")}`,
        JSON.stringify({ questions: updatedQuestions, numberOfQuestions: updatedQuestions.length }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Quiz Details</h1>

      <div>
        <p><strong>Title:</strong> {details.title} {renderEditButton('title')}</p>
        <p><strong>Description:</strong> {details.description} {renderEditButton('description')}</p>
        <p><strong>Time:</strong> {details.time} mins {renderEditButton('time')}</p>
        <p><strong>Number of Questions:</strong> {details.numberOfQuestions}</p>
        <p><strong>Grade:</strong> {details.grade} {renderEditButton('grade')}</p>
        <p><strong>Featured:</strong> {details.featured ? "Yes" : "No"} {renderEditButton('featured')}</p>
        <p><strong>Published:</strong> {details.publish ? "Yes" : "No"} {renderEditButton('publish')}</p>
        <p><strong>Attempts Allowed:</strong> {details.attemptsAllowed} {renderEditButton('attemptsAllowed')}</p>
        <p><strong>Allow Review:</strong> {details.allowQuizReview ? "Yes" : "No"} {renderEditButton('allowQuizReview')}</p>
        <p><strong>Display Scores:</strong> {details.displayScores ? "Yes" : "No"} {renderEditButton('displayScores')}</p>
        {/* <p><strong>Item Display Scores:</strong> {details.itemdisplayScores ? "Yes" : "No"} {renderEditButton('displayScores')}</p> */}
        <p><strong>Show Feedback Form:</strong> {details.showFeedBackForm ? "Yes" : "No"} {renderEditButton('showFeedBackForm')}</p>

        <div className="my-4">
          <p><strong>Image:</strong> {renderEditButton('image')}</p>
          {details.image && (
            <img src={details.image} alt="Quiz" className="mt-2 w-64 h-auto rounded" />
          )}
        </div>
        <p><strong>Created At:</strong> {new Date(details.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(details.updatedAt).toLocaleString()}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Questions</h2>
        {details.questions && details.questions.map((q, index) => (
          <div key={index} className="border p-4 rounded-lg mb-4">
            <p><strong>Question {index + 1}:</strong> {q.question} {renderEditButton(`question-${index}`)}</p>
            {q.image && <img src={q.image} alt="Question" className="my-2 w-48 h-auto" />}
            <ul className="list-disc pl-5">
              {q.answers.map((ans, i) => (
                <li key={i}>{ans}</li>
              ))}
            </ul>
            <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
            <p><strong>Explanation:</strong> {q.explanation}</p>
            <button
              onClick={() => handleDeleteQuestion(index)}
              className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Delete Question
            </button>
          </div>
        ))}
        <button
          onClick={handleAddQuestion}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Question
        </button>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 capitalize">Edit {editingField}</h2>
            {editingField === 'image' ? (
              <div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-64 h-auto" />}
              </div>
            ) : ['featured', 'publish', 'allowQuizReview', 'displayScores', 'itemdisplayScores', 'showFeedBackForm'].includes(editingField) ? (
              <div className="flex items-center gap-2">
                <label className="font-medium capitalize">{editingField.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="checkbox"
                  name={editingField}
                  checked={!!formData[editingField]}
                  onChange={handleChange}
                />
              </div>
            ) : editingField === 'attemptsAllowed' ? (
              <div>
                <label className="block mb-1">Attempts Allowed:</label>
                <input
                  type="number"
                  name="attemptsAllowed"
                  value={formData.attemptsAllowed || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            ) : editingField.startsWith("question-") ? (
              <div className="space-y-4">
                <input
                  name="question"
                  value={formData.question || ''}
                  onChange={handleChange}
                  placeholder="Question"
                  className="w-full p-2 border rounded"
                />
                {formData.answers && formData.answers.map((ans, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={ans}
                      onChange={(e) => handleAnswerChange(i, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder={`Answer ${i + 1}`}
                    />
                    <input
                      type="checkbox"
                      checked={formData.correctAnswer === ans}
                      onChange={() => handleCorrectAnswerChange(i)}
                    />
                  </div>
                ))}
                <textarea
                  name="explanation"
                  value={formData.explanation || ''}
                  onChange={handleChange}
                  placeholder="Explanation"
                  className="w-full p-2 border rounded"
                />
                <div>
                  <label className="block mb-1">Question Image:</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-64 h-auto" />}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Image
                    </button>
                    {imageRemoved && (
                      <span className="text-xs text-red-600 self-center">Image will be removed</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <input
                name={editingField}
                value={formData[editingField] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
