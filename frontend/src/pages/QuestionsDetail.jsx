import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuestionById } from "../services/api";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/questionsDetail.css";
import { LANGUAGES, TEMPLATES } from "../constants/editorTemplates";

/* 🔥 SIMPLE MODAL COMPONENT */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function QuestionDetail() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [leftWidth, setLeftWidth] = useState(50);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [runLoading, setRunLoading] = useState(false);

  // ✅ FIX: missing output state
  const [output, setOutput] = useState("");

  // 🔥 TEST CASES
  const [activeCase, setActiveCase] = useState(0);
  const [testCases, setTestCases] = useState([{ input: "" }]);

  const [modal, setModal] = useState(null);
  const isChangingLanguage = useRef(false);

  // ✅ LOAD QUESTION
  useEffect(() => {
    getQuestionById(id)
      .then((res) => setQuestion(res.data))
      .catch(() => toast.error("Failed to load question"));
  }, [id]);

  // ✅ LOAD CODE
  useEffect(() => {
    isChangingLanguage.current = true;

    const key = `code_${id}_${language}`;
    const savedCode = localStorage.getItem(key);

    const toLoad =
      savedCode && savedCode.trim() !== ""
        ? savedCode
        : TEMPLATES[language] ?? "";

    localStorage.setItem(key, toLoad);
    setCode(toLoad);

    setTimeout(() => {
      isChangingLanguage.current = false;
    }, 0);
  }, [id, language]);

  // ✅ SAVE CODE
  useEffect(() => {
    if (isChangingLanguage.current) return;
    localStorage.setItem(`code_${id}_${language}`, code);
  }, [code, id, language]);

  // 🔥 LANGUAGE CHANGE
  const handleLanguageChange = (lang) => {
    const savedCode = localStorage.getItem(`code_${id}_${language}`);
    const isModified =
      savedCode !== null && savedCode !== (TEMPLATES[language] ?? "");

    if (isModified) {
      setModal({
        message: "Switch language? Your code will be saved.",
        onConfirm: () => {
          setLanguage(lang);
          setModal(null);
        },
        onCancel: () => setModal(null),
      });
    } else {
      setLanguage(lang);
    }
  };

  // 🔥 RESET
  const handleReset = () => {
    setModal({
      message: "Reset code?",
      onConfirm: () => {
        const template = TEMPLATES[language] ?? "";
        setCode(template);
        localStorage.setItem(`code_${id}_${language}`, template);
        toast.success("Code reset");
        setModal(null);
      },
      onCancel: () => setModal(null),
    });
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

  // ✅ SUBMIT
  const handleSubmit = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return toast.error("Please login first");

    setSubmitLoading(true);

    try {
      await axios.post("http://localhost:8000/attempts", {
        user_id: userId,
        question_id: id,
        status: "solved",
        difficulty: question.difficulty,
      });

      toast.success("Submitted successfully");
    } catch {
      toast.error("Submission failed");
    }

    setSubmitLoading(false);
  };

  // 🔥 RUN
  const handleRun = async () => {
    setRunLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/run", {
        code,
        language,
        input: testCases[activeCase]?.input || "",
      });

      setOutput(res.data.output);
    } catch {
      setOutput("Error running code");
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
            {question.company?.map((c, i) => (
  <span key={i} className="company">{c}</span>
))}
          </div>

         {/* DESCRIPTION */}
<p className="description">{question.description}</p>

{/* FULL DESCRIPTION */}
{question.full_description?.length > 0 && (
  <div className="section">
    <h3>Details</h3>
    <ul>
      {question.full_description.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  </div>
)}

{/* EXAMPLES */}
{question.examples?.length > 0 && (
  <div className="section">
    <h3>Examples</h3>
    {question.examples.map((ex, index) => (
      <div key={index} className="example-box">
        <p><strong>Input:</strong> {ex.input}</p>
        <p><strong>Output:</strong> {ex.output}</p>
        {ex.explanation && (
          <p><strong>Explanation:</strong> {ex.explanation}</p>
        )}
      </div>
    ))}
  </div>
)}

{/* CONSTRAINTS */}
{question.constraints?.length > 0 && (
  <div className="section">
    <h3>Constraints</h3>
    <ul>
      {question.constraints.map((c, i) => (
        <li key={i}>{c}</li>
      ))}
    </ul>
  </div>
)}
        </div>

        {/* RESIZER */}
        <div className="resizer" onMouseDown={handleMouseDown} />

        {/* RIGHT */}
        <div className="editor-right">

          {/* HEADER */}
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

              <button
                className="run-btn"
                onClick={handleRun}
                disabled={runLoading}
              >
                {runLoading ? "Running..." : "Run"}
              </button>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={submitLoading}
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* EDITOR */}
          <div style={{ height: "60%" }}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                automaticLayout: true,
              }}
            />
          </div>

          {/* TESTCASE PANEL */}
          <div className="testcase-panel">

            <div className="testcase-tabs">
              {testCases.map((_, index) => (
                <div
                  key={index}
                  className={`tab ${activeCase === index ? "active" : ""}`}
                  onClick={() => setActiveCase(index)}
                >
                  Case {index + 1}

                  {testCases.length > 1 && (
                    <span
                      className="close"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = testCases.filter((_, i) => i !== index);
                        setTestCases(updated);
                        setActiveCase(0);
                      }}
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}

              <button
                className="add-case"
                onClick={() => {
                  setTestCases([...testCases, { input: "" }]);
                  setActiveCase(testCases.length);
                }}
              >
                +
              </button>
            </div>

            {/* INPUT */}
            <textarea
              value={testCases[activeCase]?.input || ""}
              onChange={(e) => {
                const updated = [...testCases];
                updated[activeCase].input = e.target.value;
                setTestCases(updated);
              }}
              placeholder="Enter input..."
            />

            {/* OUTPUT */}
            <div className="output-box">
              <h4>Output</h4>
              <pre>{output || "Run code to see output..."}</pre>
            </div>

          </div>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}
    </>
  );
}

export default QuestionDetail;