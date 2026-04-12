import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import toast  from "react-hot-toast";
import { getQuestionById } from "../services/api";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/questionsDetail.css";
import { LANGUAGES , TEMPLATES } from "../constants/editorTemplates";
function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [leftWidth, setLeftWidth] = useState(50);
  const isChangingLanguage = useRef(false);
const [submitLoading, setSubmitLoading] = useState(false);
const [runLoading, setRunLoading] = useState(false);


  useEffect(() => {
    getQuestionById(id)
      .then((res) => setQuestion(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ LOAD CODE (FIXED TEMPLATE LOGIC)
  useEffect(() => {
    isChangingLanguage.current = true;

    const key = `code_${id}_${language}`;
    const savedCode = localStorage.getItem(key);

    let toLoad;
    if (savedCode && savedCode.trim() !== "") {
      toLoad = savedCode;
    } else {
      toLoad = TEMPLATES[language] ?? "";
      localStorage.setItem(key, toLoad); // store template initially
    }

    setCode(toLoad);

    setTimeout(() => {
      isChangingLanguage.current = false;
    }, 0);
  }, [id, language]);

  // ✅ SAVE CODE (FIXED DEPENDENCIES)
  useEffect(() => {
    if (isChangingLanguage.current) return;
    localStorage.setItem(`code_${id}_${language}`, code);
  }, [code, id, language]);

  // ✅ LANGUAGE CHANGE
  const handleLanguageChange = (lang) => {
    const savedCode = localStorage.getItem(`code_${id}_${language}`);
    const isModified =
      savedCode !== null &&
      savedCode !== (TEMPLATES[language] ?? "");

    if (isModified) {
    const confirmSwitch = window.confirm("Switch language?");
      if (!confirmSwitch) return;
    }

    setLanguage(lang);
  };

  const handleReset = () => {
  const confirmReset = window.confirm("Reset code?");
  if (!confirmReset) return;

  const template = TEMPLATES[language] ?? "";
  setCode(template);
  localStorage.setItem(`code_${id}_${language}`, template);

  toast.success("Code reset");
};

  // ✅ RESIZE
  const handleDrag = useCallback((e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleDrag]);

  const handleMouseDown = useCallback(() => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleDrag, handleMouseUp]);
const handleSubmit = async () => {
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    toast.error("Please login first");
    return;
  }

  setSubmitLoading(true);

  try {
    await axios.post("http://localhost:8000/attempts", {
      user_id: userId,
      question_id: id,
      status: "solved",
    });

    toast.success("Submitted successfully");
  } catch {
    toast.error("Submission failed");
  }

  setSubmitLoading(false);
};

const handleRun = async () => {
  setRunLoading(true);

  try {
    console.log(code);
    toast.success("Code executed");
  } catch {
    toast.error("Execution failed");
  }

  setRunLoading(false);
};

if (!question) return <p className="loading">Loading question...</p>;

  return (
    <>
      <Navbar />
      <div className="detail-container">

        {/* LEFT */}
        <div className="question-left" style={{ width: `${leftWidth}%` }}>
          <h2>{question.title}</h2>
          <div className="meta">
            <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
            <span className="company">{question.company}</span>
          </div>
          <p className="description">{question.description}</p>
        </div>

        {/* RESIZER */}
        <div className="resizer" onMouseDown={handleMouseDown} />

        {/* RIGHT */}
        <div className="editor-right">
          <div className="editor-header">
            <select
              className="language-select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            <div className="editor-actions">
              <button onClick={handleReset}>Reset</button>
             <button className="run-btn" onClick={handleRun} disabled={runLoading}>
              {runLoading ? "Running..." : "Run"}
              </button>

              <button className="submit-btn" onClick={handleSubmit} disabled={submitLoading}>
              {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                quickSuggestions: false,
                 quickSuggestions: false,
                 suggestOnTriggerCharacters: false,
                 acceptSuggestionOnEnter: "off",
                tabCompletion: "off",
                wordBasedSuggestions: "off",
                parameterHints: { enabled: false },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionDetail;