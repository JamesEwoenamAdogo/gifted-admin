import { useState, useEffect, useRef } from "react";
import axios from "axios";
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Import ReactQuill with error handling
let ReactQuill;
try {
  ReactQuill = require('react-quill').default;
  require('react-quill/dist/quill.snow.css');
} catch (error) {
  console.error('Failed to import ReactQuill:', error);
  ReactQuill = null;
}

if (typeof window !== 'undefined') {
  // Make KaTeX available to Quill's formula module
  // Quill expects window.katex to render formulas
  // eslint-disable-next-line no-undef
  window.katex = katex;
}

// Reusable rich text editor with HTML toggle and counters
const RichTextEditor = ({ value, onChange, placeholder, modules, formats }) => {
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
          ReactQuill ? (
            <ReactQuill
              ref={editorRef}
              theme="snow"
              value={value}
              onChange={(html) => onChange(html)}
              modules={modules}
              formats={formats}
              placeholder={placeholder}
            />
          ) : (
            <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
              {/* <p className="font-semibold">Rich Text Editor Unavailable</p> */}
              {/* <p className="text-sm">Please install react-quill package: npm install react-quill</p> */}
              <textarea
                className="w-full p-2 mt-2 border rounded"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          )
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
};

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
  const [contest,setContest] = useState(false)
  const [contestType, setContestType] = useState("")
  const [pointsPerQuestion, setPointsPerQuestion] = useState("")
  const [bonusTimeLimit, setBonusTimeLimit] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [instructor,setInstructor] = useState("")
  const [level,setLevel]= useState("")
  const [difficulty, setDifficulty] = useState("")
  const [courseInfo, setCourseInfo]= useState({
    tags:[],
    features:[]
  })
  const [examMode, setExamMode] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [timePerQuestion, setTimePerQuestion] = useState("");
  const [examLink, setExamLink] = useState(`https://www.giftededu.tech/exam`);
  const [isSubmittingExcel, setIsSubmittingExcel] = useState(false);
  const [excelResponse, setExcelResponse] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [excelPreview, setExcelPreview] = useState(null);
  const [excelValidationErrors, setExcelValidationErrors] = useState([]);

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
    // Send grade as a JSON string for backends that JSON.parse this field
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
    formData.append("contest",contest)
    formData.append("contestType", contestType);
    formData.append("pointsPerQuestion", pointsPerQuestion);
    formData.append("bonusTimeLimit", bonusTimeLimit);
    formData.append("estimatedTime", estimatedTime);
    formData.append("endTime", endTime);
    formData.append("questions", JSON.stringify(questions));
    formData.append("type","assessment")
    formData.append("level",level)
    formData.append("difficulty", difficulty)
    formData.append("instructor",instructor)
    formData.append("tags",JSON.stringify(courseInfo.tags))
    formData.append("features",JSON.stringify(courseInfo.features))
    formData.append("examMode", examMode);
    formData.append("timePerQuestion", timePerQuestion);
    formData.append("instructions", JSON.stringify(instructions));
    // if (excelFile) {
    //   formData.append("excelFile", excelFile);
    // }

    

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
      setExamLink(prev=> `${prev}/${response.data.id}`)
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

  // Handle instructions management
  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index, value) => {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  };

  const removeInstruction = (index) => {
    const updatedInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(updatedInstructions);
  };

  // Function to validate Excel file content
  const validateExcelFile = async (file) => {
    const errors = [];
    const warnings = [];
    
    try {
      // Create a simple file reader to check if it's a valid Excel file
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = (e) => {
          const data = e.target.result;
          
          // Basic Excel file validation
          if (file.name.toLowerCase().endsWith('.xlsx')) {
            // Check for Excel 2007+ format signature
            const xlsxSignature = data.slice(0, 4);
            if (xlsxSignature !== 'PK\x03\x04') {
              errors.push('Invalid .xlsx file format - file may be corrupted or not a real Excel file');
              warnings.push('This file has a .xlsx extension but is not a valid Excel file');
              warnings.push('The file may have been created with a different program or corrupted');
            } else {
              // Check for potential issues in XLSX files
              warnings.push('XLSX file detected - ensure it was created with Excel 2007 or later');
            }
          } else if (file.name.toLowerCase().endsWith('.xls')) {
            // Check for Excel 97-2003 format signature
            const xlsSignature = data.slice(0, 8);
            if (xlsSignature !== '\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1') {
              errors.push('Invalid .xls file format');
            } else {
              warnings.push('XLS file detected - older format may cause compatibility issues');
            }
          }
          
          // Check file size for potential issues
          if (file.size < 1024) {
            warnings.push('File is very small - may be empty or corrupted');
          } else if (file.size > 5 * 1024 * 1024) {
            warnings.push('Large file size - may cause processing delays');
          }
          
          resolve({ errors, warnings });
        };
        
        reader.onerror = () => {
          errors.push('Could not read file');
          resolve({ errors, warnings });
        };
        
        // Read first 1KB to check file signature
        reader.readAsArrayBuffer(file.slice(0, 1024));
      });
    } catch (error) {
      errors.push('File validation error: ' + error.message);
      return { errors, warnings };
    }
  };

  // Function to handle Excel file selection
  const handleExcelFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setExcelFile(null);
      setExcelPreview(null);
      setExcelValidationErrors([]);
      return;
    }

    setExcelFile(file);
    
    // Validate file
    const validation = await validateExcelFile(file);
    setExcelValidationErrors(validation.errors);
    
    if (validation.errors.length === 0) {
      setExcelPreview({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        warnings: validation.warnings
      });
    }
  };

  // Handle Excel file submission
  const handleExcelSubmit = async () => {
    if (!excelFile || !title) {
      alert('Please upload an Excel file and enter a title first.');
      return;
    }

    // Validate file before submission
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/excel',
      'application/x-excel',
      'application/x-msexcel'
    ];
    
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = excelFile.name.toLowerCase().substring(excelFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(excelFile.type) && !validExtensions.includes(fileExtension)) {
      alert(`Invalid file type. Please upload an Excel file (.xlsx or .xls).\nDetected type: ${excelFile.type}\nDetected extension: ${fileExtension}`);
      return;
    }
    
    if (excelFile.size === 0) {
      alert('The selected file is empty. Please choose a valid Excel file.');
      return;
    }
    
    if (excelFile.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size is too large. Please choose an Excel file smaller than 10MB.');
      return;
    }

    setIsSubmittingExcel(true);
    try {
      const formData = new FormData();
      formData.append('file', excelFile);

      console.log('Submitting Excel file:', {
        fileName: excelFile.name,
        fileSize: excelFile.size,
        fileType: excelFile.type,
        title: title,
        url: `http://localhost:10000/api/v1/add-exam-students/${encodeURIComponent(title)}`
      });

      const response = await axios.post(
        `http://localhost:10000/api/v1/add-exam-students/${encodeURIComponent(title)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', // Important for file downloads
        }
      );

      console.log('Excel upload successful:', response);

      // Create a blob URL for the downloaded file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      
      setExcelResponse({
        url: url,
        filename: `processed_${title}_${Date.now()}.xlsx`
      });

    } catch (error) {
      console.error('Error submitting Excel file:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        
        // Try to read the error response as text if it's a blob
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            console.error('Error response text:', errorText);
            
            // Handle specific error messages
            if (errorText.includes('No valid records found') || errorText.includes('no valid records')) {
              alert(`Excel Processing Error: No valid records found in your Excel file.\n\nPlease check that your Excel file has:\n• Column headers: "name", "school", "grade" (exact spelling, plain text)\n• Remove ALL formatting (bold, italic, colors, etc.)\n• Data starting from row 2\n• No empty rows between header and data\n• At least one row of student data\n\nCommon issues:\n• Bold/italic headers can cause parsing errors\n• Extra spaces in column names\n• Case sensitivity (use lowercase)\n\nError details: ${errorText}`);
            } else {
              alert(`Server Error: ${error.response.status} - ${errorText}`);
            }
          } catch (e) {
            console.error('Could not read error response as text');
            alert(`Server Error: ${error.response.status} - Bad Request`);
          }
        } else {
          const errorData = JSON.stringify(error.response.data);
          if (errorData.includes('No valid records found') || errorData.includes('no valid records')) {
            alert(`Excel Processing Error: No valid records found in your Excel file.\n\nPlease check that your Excel file has:\n• Column headers: "name", "school", "grade" (exact spelling, plain text)\n• Remove ALL formatting (bold, italic, colors, etc.)\n• Data starting from row 2\n• No empty rows between header and data\n• At least one row of student data\n\nCommon issues:\n• Bold/italic headers can cause parsing errors\n• Extra spaces in column names\n• Case sensitivity (use lowercase)\n\nError details: ${errorData}`);
          } else {
            alert(`Server Error: ${error.response.status} - ${errorData}`);
          }
        }
      } else if (error.request) {
        console.error('Request error:', error.request);
        alert('Network Error: Could not reach the server. Please check if the server is running on localhost:10000');
      } else {
        console.error('Error setting up request:', error.message);
        alert(`Request Error: ${error.message}`);
      }
    } finally {
      setIsSubmittingExcel(false);
    }
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

      {/* Exam Mode Toggle */}
      <div className="mb-6 p-4 border rounded bg-blue-50">
        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={examMode}
            onChange={(e) => {setExamMode(e.target.checked)}}
            className="w-4 h-4"
          />
          <span className="text-lg font-semibold">Exam Mode</span>
        </label>

        {examMode && (
          <div className="space-y-4">
            {/* Excel Upload Section */}
            <div className="p-4 bg-white border rounded">
              <h3 className="text-md font-semibold mb-2">Student Data Upload</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload an Excel sheet with student information. The sheet should have the following columns:
              </p>
              <ul className="text-sm text-gray-600 mb-3 list-disc list-inside">
                <li><strong>name</strong> - Student's full name</li>
                <li><strong>school</strong> - School name</li>
                <li><strong>grade</strong> - Student's grade level</li>
              </ul>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="w-full p-2 border rounded"
                onChange={handleExcelFileChange}
              />
              {excelFile && (
                <div className="mt-3">
                  {/* File validation errors */}
                  {excelValidationErrors.length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded mb-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">File Validation Errors:</h4>
                      <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                        {excelValidationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* File information */}
                  <div className="p-3 bg-gray-50 border rounded mb-3">
                    <p className={`text-sm mb-2 ${excelValidationErrors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {excelValidationErrors.length > 0 ? '⚠️ File has issues:' : '✓ File selected:'} {excelFile.name}
                    </p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>File size:</strong> {(excelFile.size / 1024).toFixed(2)} KB</p>
                      <p><strong>File type:</strong> {excelFile.type || 'Unknown'}</p>
                      <p><strong>Last modified:</strong> {new Date(excelFile.lastModified).toLocaleString()}</p>
                    </div>
                    
                    {/* Warnings display */}
                    {excelPreview?.warnings && excelPreview.warnings.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">⚠️ File Warnings:</p>
                        <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                          {excelPreview.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Excel file requirements */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-3">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Required Excel Format:</h4>
                    <div className="text-sm text-blue-700">
                      <p className="mb-2">Your Excel file must have these exact column headers in the first row:</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border">name</div>
                        <div className="bg-white p-2 rounded border">school</div>
                        <div className="bg-white p-2 rounded border">grade</div>
                      </div>
                      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">⚠️ Formatting Requirements:</p>
                        <p className="text-xs">• Column names are case-sensitive</p>
                        <p className="text-xs">• Remove ALL formatting (bold, italic, colors, etc.)</p>
                        <p className="text-xs">• Use plain text only</p>
                        <p className="text-xs">• Data should start from row 2</p>
                        <p className="text-xs">• No empty rows between header and data</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Troubleshooting for files from other sources */}
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded mb-3">
                    <h4 className="text-sm font-semibold text-orange-800 mb-2">🔧 Files from Other Sources:</h4>
                    <div className="text-sm text-orange-700">
                      <p className="mb-2">If this file was created by someone else or on a different computer:</p>
                      <div className="space-y-1 text-xs">
                        <p>• <strong>Save As:</strong> Open the file and "Save As" a new Excel file</p>
                        <p>• <strong>Copy Data:</strong> Copy all data to a new Excel file</p>
                        <p>• <strong>Remove Formatting:</strong> Select all cells and clear formatting</p>
                        <p>• <strong>Check Encoding:</strong> Ensure file is saved as UTF-8 compatible</p>
                        <p>• <strong>Version Issues:</strong> Older Excel versions may create compatibility issues</p>
                      </div>
                      <div className="mt-2 p-2 bg-white border rounded">
                        <p className="text-xs font-semibold text-orange-800 mb-1">Quick Fix Steps:</p>
                        <ol className="text-xs text-orange-700 list-decimal list-inside space-y-1">
                          <li>Open the problematic file in Excel</li>
                          <li>Select all data (Ctrl+A)</li>
                          <li>Copy (Ctrl+C)</li>
                          <li>Create a new Excel file</li>
                          <li>Paste (Ctrl+V)</li>
                          <li>Save the new file</li>
                          <li>Try uploading the new file</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  {/* Invalid Excel file format troubleshooting */}
                  {excelValidationErrors.some(error => error.includes('Invalid .xlsx file format')) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded mb-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-2">🚨 Invalid Excel File Format:</h4>
                      <div className="text-sm text-red-700">
                        <p className="mb-2">This file has a .xlsx extension but is not a valid Excel file. Common causes:</p>
                        <div className="space-y-1 text-xs">
                          <p>• <strong>Wrong Program:</strong> File was created with LibreOffice, Google Sheets, or other programs</p>
                          <p>• <strong>Corrupted File:</strong> File was damaged during transfer or storage</p>
                          <p>• <strong>Fake Extension:</strong> File was renamed but isn't actually an Excel file</p>
                          <p>• <strong>Export Issues:</strong> File was exported incorrectly from another program</p>
                        </div>
                        <div className="mt-3 p-2 bg-white border rounded">
                          <p className="text-xs font-semibold text-red-800 mb-1">🔧 How to Fix:</p>
                          <ol className="text-xs text-red-700 list-decimal list-inside space-y-1">
                            <li><strong>Try opening in Excel:</strong> If it opens, use "Save As" to create a new file</li>
                            <li><strong>If it won't open:</strong> Ask the sender to re-save the file properly</li>
                            <li><strong>Alternative:</strong> Ask them to send as .xls format instead</li>
                            <li><strong>Last resort:</strong> Ask them to copy data to a new Excel file</li>
                          </ol>
                        </div>
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs font-semibold text-yellow-800 mb-1">💡 For the Sender:</p>
                          <p className="text-xs text-yellow-700">Ask them to: Open the file → File → Save As → Choose "Excel Workbook (.xlsx)" → Save</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleExcelSubmit}
                    disabled={isSubmittingExcel || excelValidationErrors.length > 0}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmittingExcel ? 'Processing...' : 'Process Excel File'}
                  </button>
                  
                  {excelValidationErrors.length > 0 && (
                    <p className="text-xs text-red-600 mt-2">
                      Please fix the file validation errors before processing.
                    </p>
                  )}
                </div>
              )}
              
              {/* Display processed file */}
              {excelResponse && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <h4 className="text-sm font-semibold text-green-800 mb-2">Processed File Ready</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Your Excel file has been processed successfully!
                  </p>
                  <a
                    href={excelResponse.url}
                    download={excelResponse.filename}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Processed File
                  </a>
                </div>
              )}
            </div>

            {/* Time Per Question */}
            <div className="p-4 bg-white border rounded">
              <label className="block mb-2 font-semibold">Time Per Question (minutes)</label>
              <input
                type="number"
                min="1"
                className="w-full p-2 border rounded"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(e.target.value)}
                placeholder="Enter time in minutes"
              />
            </div>


            {/* Exam Link Section */}
            <div className="p-4 bg-white border rounded">
              <h3 className="text-md font-semibold mb-2">Exam Link</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={examLink}
                  readOnly
                  className="flex-1 p-2 border rounded bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(examLink);
                    alert('Link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Copy Link
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Share this link with students to start the exam
              </p>
            </div>
          </div>
        )}
      </div>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={contest}
          onChange={(e) => setContest(e.target.checked)}
        />
        <span>Use As Contest</span>
      </label>

      {!contest && (
        <>
          <label className="block mb-2">Instructor</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            onChange={(e) => setInstructor(e.target.value)}
          />
        </>
      )}
      <label className="block mb-2">Level</label>
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setLevel(e.target.value)}
      />

      <label className="block mb-2">Difficulty</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Select difficulty...</option>
        <option value="easy">Easy</option>
        <option value="intermediate">Intermediate</option>
        <option value="hard">Hard</option>
      </select>

      <label className="block mb-2">Description</label>
      <textarea
        className="w-full p-2 border rounded mb-4"
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Instructions Section */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Instructions</label>
        <p className="text-sm text-gray-600 mb-3">
          Add specific instructions for students taking this quiz/exam.
        </p>
        
        {instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 items-start mb-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder={`Instruction ${index + 1}`}
                className="w-full p-2 border rounded"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 flex-shrink-0"
              title="Remove instruction"
            >
              ×
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addInstruction}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-3"
        >
          + Add Instruction
        </button>
        
        {instructions.length > 0 && (
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-semibold mb-2">Preview:</h4>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              {instructions.map((instruction, index) => (
                <li key={index}>
                  {instruction || <span className="text-gray-400 italic">Empty instruction</span>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

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

      {contest && (
        <div className="border p-4 rounded mb-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Contest Configuration</h3>
          
          <label className="block mb-2">Contest Type</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={contestType}
            onChange={(e) => setContestType(e.target.value)}
            placeholder="e.g., Math Olympiad, Science Fair, etc."
          />

          <label className="block mb-2">Points Per Question</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={pointsPerQuestion}
            onChange={(e) => setPointsPerQuestion(e.target.value)}
            placeholder="Points awarded for each correct answer"
            min="1"
          />

          <label className="block mb-2">Bonus Time Limit (minutes)</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={bonusTimeLimit}
            onChange={(e) => setBonusTimeLimit(e.target.value)}
            placeholder="Extra time allowed for bonus questions"
            min="0"
          />

          <label className="block mb-2">Estimated Time (minutes)</label>
          <input
            type="number"
            className="w-full p-2 border rounded mb-4"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            placeholder="Expected time to complete the contest"
            min="1"
          />

          <label className="block mb-2">End Time</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="e.g., 7 hours from now , 2 weeks from now, etc."
          />
        </div>
      )}

      <label className="block mb-2">Attempts Allowed</label>
      <input
        type="number"
        min="1"
        className="w-full p-2 border rounded mb-4"
        value={attemptsAllowed}
        onChange={(e) => setAttemptsAllowed(e.target.value)}
      />

      {!contest && (
        <>
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
        </>
      )}
       {/* Tags input */}
      {!contest && (
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
      )}
       {/* Features input */}
      {!contest && (
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
      )}

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
