import { useState } from "react";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", "", "", ""], correctAnswer: null }]);
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
    updatedQuestions[qIndex].correctAnswer = aIndex;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      
      <label className="block mb-2">Title</label>
      <input type="text" className="w-full p-2 border rounded mb-4" />
      
      <label className="block mb-2">Description</label>
      <textarea className="w-full p-2 border rounded mb-4"></textarea>
      
      <label className="block mb-2">Image</label>
      <input type="file" className="w-full p-2 border rounded mb-4" />
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={addQuestion}>
        Add New Question
      </button>
      
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded mb-4">
          <label className="block mb-2">Question</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded mb-4" 
            value={q.question} 
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
          />
          
          {q.answers.map((a, aIndex) => (
            <div key={aIndex} className="flex items-center mb-2">
              <input 
                type="text" 
                className="w-full p-2 border rounded mr-2" 
                value={a} 
                onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
              />
              <input 
                type="checkbox" 
                checked={q.correctAnswer === aIndex} 
                onChange={() => selectCorrectAnswer(qIndex, aIndex)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
