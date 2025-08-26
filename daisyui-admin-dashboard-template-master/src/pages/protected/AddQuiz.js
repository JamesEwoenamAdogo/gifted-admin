import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'katex/dist/katex.min.css';
import katex from 'katex';

if (typeof window !== 'undefined') {
  // Make KaTeX available to Quill's formula module
  // Quill expects window.katex to render formulas
  // eslint-disable-next-line no-undef
  window.katex = katex;
}

// Reusable rich text editor with HTML toggle and counters
function RichTextEditor({ value, onChange, placeholder, modules, formats }) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef(null);

  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
  };

  const textOnly = stripHtml(value || '');
  const charCount = textOnly.length;
  const wordCount = textOnly.length === 0 ? 0 : textOnly.split(' ').length;

  const insertAtCursor = (text) => {
    if (isHtmlMode) {
      const next = (value || '') + text;
      onChange(next);
      return;
    }
    const quill = editorRef?.current?.getEditor?.();
    if (!quill) return;
    const selection = quill.getSelection(true);
    const index = selection ? selection.index : quill.getLength();
    quill.insertText(index, text, 'user');
    quill.setSelection(index + text.length, 0, 'user');
  };

  const insertFormula = (latex) => {
    if (isHtmlMode) {
      const safeLatex = (latex || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      const span = `<span class="ql-formula" data-value="${safeLatex}"></span>`;
      onChange((value || '') + span);
      return;
    }
    const quill = editorRef?.current?.getEditor?.();
    if (!quill) return;
    const selection = quill.getSelection(true);
    const index = selection ? selection.index : quill.getLength();
    quill.insertEmbed(index, 'formula', latex, 'user');
    quill.setSelection(index + 1, 0, 'user');
  };

  const mathSymbols = [
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'γ', latex: '\\gamma' },
    { label: 'Δ', latex: '\\Delta' },
    { label: 'θ', latex: '\\theta' },
    { label: 'λ', latex: '\\lambda' },
    { label: 'π', latex: '\\pi' },
    { label: 'Σ', latex: '\\sum' },
    { label: '∫', latex: '\\int' },
    { label: '∞', latex: '\\infty' },
    { label: '√', latex: '\\sqrt{}' },
    { label: '≈', latex: '\\approx' },
    { label: '≠', latex: '\\neq' },
    { label: '≤', latex: '\\leq' },
    { label: '≥', latex: '\\geq' },
    { label: '⋅', latex: '\\cdot' },
    { label: '×', latex: '\\times' },
    { label: '÷', latex: '\\div' },
    { label: '±', latex: '\\pm' },
    { label: '∂', latex: '\\partial' },
    { label: '∇', latex: '\\nabla' },
    { label: '∈', latex: '\\in' },
    { label: '∉', latex: '\\notin' },
    { label: '∪', latex: '\\cup' },
    { label: '∩', latex: '\\cap' },
    { label: '⊂', latex: '\\subset' },
    { label: '⊆', latex: '\\subseteq' },
    { label: '⊇', latex: '\\supseteq' },
  ];

  const templates = [
    { label: 'Fraction', latex: '\\frac{a}{b}' },
    { label: 'Power', latex: 'x^{n}' },
    { label: 'Subscript', latex: 'x_{i}' },
    { label: 'Limit', latex: '\\lim_{x \\to 0} f(x)' },
    { label: 'Sum', latex: '\\sum_{i=1}^{n} x_i' },
    { label: 'Integral', latex: '\\int_{a}^{b} f(x) \\mathrm{d}x' },
    { label: 'Matrix 2x2', latex: '\\begin{bmatrix} a & b \\ \\ c & d \\end{bmatrix}' },
    { label: 'Vector', latex: '\\vec{x}' },
    { label: 'Casework', latex: '\\begin{cases} a, & x>0 \\ \\ b, & x\\le 0 \\end{cases}' },
  ];

  return (
    <div className="border rounded">
      <div className="flex items-center justify-between px-2 py-1 border-b bg-gray-50">
        <div className="text-xs text-gray-600">
          <span className="mr-3">Words: <span className="font-semibold">{wordCount}</span></span>
          <span>Chars: <span className="font-semibold">{charCount}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Mode:</span>
          <button
            type="button"
            className={`text-xs px-2 py-1 rounded ${!isHtmlMode ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setIsHtmlMode(false)}
          >
            Rich
          </button>
          <button
            type="button"
            className={`text-xs px-2 py-1 rounded ${isHtmlMode ? 'bg-blue-600 text-white' : 'bg-white border'}`}
            onClick={() => setIsHtmlMode(true)}
          >
            HTML
          </button>
        </div>
      </div>

      {/* Math palette */}
      <div className="flex flex-wrap gap-1 px-2 py-2 border-b bg-white">
        {mathSymbols.map((s, i) => (
          <button
            key={i}
            type="button"
            className="text-sm px-2 py-1 border rounded hover:bg-gray-50"
            title={s.latex}
            onClick={() => insertFormula(s.latex)}
          >
            {s.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          {templates.map((t, i) => (
            <button
              key={i}
              type="button"
              className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
              title={t.latex}
              onClick={() => insertFormula(t.latex)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-0">
        {isHtmlMode ? (
          <textarea
            className="w-full p-2 min-h-[120px] outline-none"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <ReactQuill
            ref={editorRef}
            theme="snow"
            value={value}
            onChange={(html) => onChange(html)}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
          />
        )}
      </div>

      {/* Quick text symbols for plain insertion (non-formula) */}
      <div className="flex flex-wrap gap-1 px-2 py-2 border-t bg-gray-50">
        {['≤','≥','≠','≈','±','·','→','↔','∴','∵'].map((sym, i) => (
          <button
            key={i}
            type="button"
            className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
            onClick={() => insertAtCursor(sym)}
          >
            {sym}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [grade, setGrade] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allCompetitions, setAllCompetitions] = useState([]);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [image, setImage] = useState({});
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [attemptsAllowed, setAttemptsAllowed] = useState(1);
  const [allowReview, setAllowReview] = useState(false);
  const [displayScores, setDisplayScores] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [instructor,setInstructor] = useState("")
  const [level,setLevel]= useState("")
  const [courseInfo, setCourseInfo]= useState({
    tags:[],
    features:[]
  })

  // Fetch all competitions for program selection
  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get("/all-competitions");
        setAllCompetitions(response.data.AllCompetitions || []);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };
    fetchCompetitions();
  }, []);

  // Handle grade checkbox changes
  const handleGradeChange = (gradeNumber) => {
    setGrade(prev => {
      if (prev.includes(gradeNumber)) {
        return prev.filter(g => g !== gradeNumber);
      } else {
        return [...prev, gradeNumber];
      }
    });
  };

  // Handle program checkbox changes
  const handleProgramChange = (program) => {
    setPrograms(prev => {
      if (prev.includes(program)) {
        return prev.filter(p => p !== program);
      } else {
        return [...prev, program];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("time", time);
    formData.append("numberOfQuestions", numberOfQuestions);
    formData.append("grade", JSON.stringify(grade));
    formData.append("programs", JSON.stringify(programs));
    formData.append("image", image);
    formData.append("featured", isFeatured);
    formData.append("publish", isPublished);
    formData.append("attemptsAllowed", attemptsAllowed);
    formData.append("allowQuizReview", allowReview);
    formData.append("displayScores", displayScores);
    formData.append("showFeedBackForm", showFeedbackForm);
    formData.append("shuffleQuestions", shuffleQuestions);
    formData.append("questions", JSON.stringify(questions));
    formData.append("type","assessment")
    formData.append("level",level)
    formData.append("instructor",instructor)
    formData.append("tags",JSON.stringify(courseInfo.tags))
    formData.append("features",JSON.stringify(courseInfo.features))

    

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
        hasImage: false,
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
    updatedQuestions[qIndex].image = file || null;
    updatedQuestions[qIndex].hasImage = !!file;
    setQuestions(updatedQuestions);
  };

  const updateExplanation = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].explanation = value;
    setQuestions(updatedQuestions);
  };
   const addTag = () => {
    setCourseInfo((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };
  const updateTag = (index, value) => {
    setCourseInfo((prev) => {
      const t = [...prev.tags];
      t[index] = value;
      return { ...prev, tags: t };
    });
  };
  const removeTag = (index) => {
    setCourseInfo((prev) => {
      const t = prev.tags.filter((_, i) => i !== index);
      return { ...prev, tags: t };
    });
  };
  const addFeature = () => {
    setCourseInfo((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };
  const updateFeature = (index, value) => {
    setCourseInfo((prev) => {
      const f = [...prev.features];
      f[index] = value;
      return { ...prev, features: f };
    });
  };
  const removeFeature = (index) => {
    setCourseInfo((prev) => {
      const f = prev.features.filter((_, i) => i !== index);
      return { ...prev, features: f };
    });
  };

  useEffect(() => {
    console.log(
      title,
      description,
      time,
      numberOfQuestions,
      grade,
      programs,
      isFeatured,
      isPublished,
      attemptsAllowed,
      allowReview,
      displayScores,
      showFeedbackForm,
      shuffleQuestions,
      questions
    );
  }, [
    title,
    description,
    time,
    numberOfQuestions,
    grade,
    programs,
    isFeatured,
    isPublished,
    attemptsAllowed,
      allowReview,
      displayScores,
      showFeedbackForm,
      shuffleQuestions,
      questions,
  ]);

  // Advanced editor configuration for questions and answers
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'formula'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'script',
    'list',
    'bullet',
    'indent',
    'color',
    'background',
    'align',
    'link',
    // 'image',
    // 'video',
    'formula',
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>

      <label className="block mb-2">Title</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block mb-2">Instructor</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setInstructor(e.target.value)}
      />
      <label className="block mb-2">Level</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setLevel(e.target.value)}
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
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
          <label key={g} className="flex items-center">
            <input
              type="checkbox"
              value={g}
              checked={grade.includes(g)}
              onChange={() => handleGradeChange(g)}
              className="mr-1"
            />
            Grade {g}
          </label>
        ))}
      </div>

             <label className="block mb-2">Program</label>
       <div className="relative mb-6">
         <button
           type="button"
           onClick={() => setProgramsOpen(!programsOpen)}
           className="w-full p-2 border rounded bg-white text-left flex items-center justify-between"
         >
           <span>
             {programs.length === 0 
               ? "Select programs..." 
               : `${programs.length} program${programs.length !== 1 ? 's' : ''} selected`
             }
           </span>
           <svg className={`w-4 h-4 transition-transform ${programsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
         </button>
         
         {programsOpen && (
           <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
             {allCompetitions.map((program) => (
               <label key={program.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                 <input
                   type="checkbox"
                   value={program.name}
                   checked={programs.includes(program.name)}
                   onChange={() => handleProgramChange(program.name)}
                   className="mr-2"
                 />
                 <span className="text-sm">{program.name}</span>
               </label>
             ))}
           </div>
         )}
       </div>

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
      
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={shuffleQuestions}
          onChange={(e) => setShuffleQuestions(e.target.checked)}
        />
        <span>Shuffle Questions</span>
      </label>
       {/* Tags input */}
      <div className="space-y-2">
        <label className="font-medium">Tags</label>
        {courseInfo.tags.map((tag, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Tag"
              className="border rounded p-2 flex-1"
              value={tag}
              onChange={(e) => updateTag(idx, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTag}
          className="mt-1 ml-1 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + Add Tag
        </button>
      </div>
       {/* Features input */}
      <div className="space-y-2">
        <label className="font-medium">Features</label>
        {courseInfo.features.map((feat, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Feature"
              className="border rounded p-2 flex-1"
              value={feat}
              onChange={(e) => updateFeature(idx, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeFeature(idx)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="mt-1 ml-1 mb-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          + Add Feature
        </button>
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded mb-4 mt-4">
          <label className="block mb-2">Question</label>
          <RichTextEditor
            value={q.question}
            onChange={(value) => updateQuestion(qIndex, value)}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Type the question here... You can use headings, colors, lists, formulas, images, videos, and code."
          />

          <label className="block mb-2 mt-4">Question Image</label>
          <input
            type="file"
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => updateQuestionImage(qIndex, e.target.files[0])}
          />

          {q.answers.map((a, aIndex) => (
  <div key={aIndex} className="mb-4">
    <div className="flex items-start gap-2">
      <div className="w-full">
        <RichTextEditor
          value={a}
          onChange={(value) => updateAnswer(qIndex, aIndex, value)}
          modules={quillModules}
          formats={quillFormats}
          placeholder={`Answer option ${aIndex + 1}... (rich formatting supported)`}
        />
      </div>
      <div className="mt-2 ml-2">
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
