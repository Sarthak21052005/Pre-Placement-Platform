import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getQuestionById } from "../services/api";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import axios from "axios";
import "../styles/questionsDetail.css";
import { LANGUAGES, TEMPLATES } from "../constants/editorTemplates";
import { useStopwatch } from "../hooks/useStopWatch";

function QuestionDetail() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [leftWidth, setLeftWidth] = useState(50);        // horizontal split %
  const [bottomHeight, setBottomHeight] = useState(280); // vertical bottom panel px
  const [testcases, setTestcases] = useState([]);
  const [activeCase, setActiveCase] = useState(0);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [verdict, setVerdict] = useState("");

  const editorRightRef = useRef(null);

  const { formatted, isRunning, start, stop, reset } = useStopwatch();

  // 📦 Fetch question
  useEffect(() => {
    getQuestionById(id)
      .then((res) => setQuestion(res.data))
      .catch(() => toast.error("Failed to load question"));
  }, [id]);

  // 💾 Load code
  useEffect(() => {
    const key = `code_${id}_${language}`;
    const saved = localStorage.getItem(key);
    setCode(saved?.trim() ? saved : TEMPLATES[language] || "");
  }, [id, language]);

  // 💾 Save code
  useEffect(() => {
    localStorage.setItem(`code_${id}_${language}`, code);
  }, [code, id, language]);

  // 🧪 Load testcases
  useEffect(() => {
    if (question?.testcases) {
      setTestcases(question.testcases);
    }
  }, [question]);

  // 🚀 RUN
  const handleRun = async () => {
    setRunLoading(true);
    setResults([]);
    setVerdict("");
    try {
      const res = await axios.post("http://localhost:8000/run", {
        question_id: id, code, language,
      });
      if (res.data.error) { toast.error(res.data.error); setRunLoading(false); return; }
      setResults(res.data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Execution failed");
    }
    setRunLoading(false);
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/submit", {
        question_id: id, code, language,
      });
      if (res.data.error) { toast.error(res.data.error); setSubmitLoading(false); return; }
      setResults(res.data.results || []);
      setVerdict(res.data.verdict);
      if (res.data.verdict !== "Accepted") {
        toast.error("Wrong Answer");
        setSubmitLoading(false);
        return;
      }
      const userId = parseInt(localStorage.getItem("user_id"));

      await axios.post("http://localhost:8000/attempts", {
        user_id: userId,
        question_id: id,
        question_name: question.title,
        company_names: question.company,
        difficulty: question.difficulty,
        status: verdict === "Accepted" ? "solved" : "attempted",
      });
      toast.success("Accepted 🎉");
    } catch (err) {
      toast.error("Submit failed");
    }
    setSubmitLoading(false);
  };

  // 🖱 HORIZONTAL RESIZER (left ↔ right panels)
  const handleHorizontalDrag = useCallback((e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  }, []);

  const handleHorizontalMouseDown = () => {
    document.addEventListener("mousemove", handleHorizontalDrag);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleHorizontalDrag);
    });
  };

  // 🖱 VERTICAL RESIZER (editor ↕ bottom panel)
  const handleVerticalDrag = useCallback((e) => {
    const container = editorRightRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    const minHeight = 100;
    const maxHeight = containerRect.height - 100; // always leave room for editor
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setBottomHeight(newHeight);
    }
  }, []);

  const handleVerticalMouseDown = useCallback((e) => {
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    const onMove = (e) => handleVerticalDrag(e);
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [handleVerticalDrag]);

  if (!question) return <p>Loading...</p>;

  const visibleTestcases = testcases.filter((tc) => !tc.hidden);

  return (
    <>
      <Navbar />
      <div className="detail-container">

        {/* ── LEFT PANEL ── */}
        <div className="question-left" style={{ width: `${leftWidth}%` }}>
          <h2>{question.title}</h2>

          <div className="meta">
            <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
            {question.company?.map((c, i) => <span key={i} className="company">{c}</span>)}
            <span className="topic">{question.topic}</span>
            {question.tags?.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
          </div>

          <p className="description">{question.description}</p>

          {question.full_description?.length > 0 && (
            <div className="section">
              <h3>Details</h3>
              <ul className="full-description">
                {question.full_description.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          )}

          {question.constraints?.length > 0 && (
            <div className="constraints-box">
              <h3>Constraints</h3>
              <ul>
                {question.constraints.map((c, i) => <li key={i}><code>{c}</code></li>)}
              </ul>
            </div>
          )}

          {question.testcases?.filter(tc => !tc.hidden).length > 0 && (
            <div className="section">
              <h3>Sample Testcases</h3>
              {question.testcases.filter(tc => !tc.hidden).map((tc, i) => (
                <div key={i} className="example-box">
                  <p><b>Input:</b></p>
                  <pre>{tc.input}</pre>
                  <p><b>Expected Output:</b></p>
                  <pre>{tc.expected_output}</pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── HORIZONTAL RESIZER ── */}
        <div className="resizer" onMouseDown={handleHorizontalMouseDown} />

        {/* ── RIGHT PANEL ── */}
        <div className="editor-right" ref={editorRightRef}>

          {/* Header */}
          <div className="editor-header">
            <div className="editor-header-left">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
              <div className={`stopwatch ${isRunning ? "running" : "paused"}`}>
                <span>⏱</span>
                <span>{formatted}</span>
                <button onClick={isRunning ? stop : start}>{isRunning ? "⏸" : "▶"}</button>
                <button onClick={reset}>↺</button>
              </div>
            </div>
            <div>
              <button onClick={handleRun} disabled={runLoading}>
                {runLoading ? "Running..." : "Run"}
              </button>
              <button onClick={handleSubmit} disabled={submitLoading}>
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>

          {/* Monaco Editor — fills all remaining space above bottom panel */}
          <div className="editor-container">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          </div>

          {/* ↕ VERTICAL RESIZER BAR */}
          <div className="vertical-resizer" onMouseDown={handleVerticalMouseDown}>
            <div className="vertical-resizer-dots" />
          </div>

          {/* Bottom panel — resizable height */}
          <div className="bottom-panel" style={{ height: `${bottomHeight}px` }}>

            {/* Testcases tab */}
            <div className="testcase-panel">
              <div className="testcase-tabs">
                {visibleTestcases.map((_, index) => (
                  <div
                    key={index}
                    className={`tab ${activeCase === index ? "active" : ""}`}
                    onClick={() => setActiveCase(index)}
                  >
                    Case {index + 1}
                  </div>
                ))}
              </div>
              {visibleTestcases.length > 0 && (
                <div className="io-row">
                  <div className="io-box">
                    <p>Input</p>
                    <textarea value={visibleTestcases[activeCase]?.input} readOnly />
                  </div>
                  <div className="io-box">
                    <p>Expected</p>
                    <textarea value={visibleTestcases[activeCase]?.expected_output} readOnly />
                  </div>
                </div>
              )}
            </div>

            {/* Output */}
            <div className="output-box">
              <h3>Results</h3>
              {results.map((r, i) => (
                <div key={i} className={`result-case ${r.passed ? "result-pass" : "result-fail"}`}>
                  <p className={r.passed ? "pass" : "fail"}>
                    {r.passed ? `✔ Case ${i + 1} Passed` : `✘ Case ${i + 1} Failed`}
                  </p>
                  {!r.passed && (
                    <>
                      <div className="output-row">
                        <div className="output-col">
                          <span className="output-label">Your Output</span>
                          <pre>{r.output || "(empty)"}</pre>
                        </div>
                        <div className="output-col">
                          <span className="output-label">Expected</span>
                          <pre>{r.expected || "(empty)"}</pre>
                        </div>
                      </div>
                      {r.compile_output && (
                        <div className="error-box">
                          <span className="output-label error-label">Compile Error</span>
                          <pre>{r.compile_output}</pre>
                        </div>
                      )}
                      {r.stderr && !r.compile_output && (
                        <div className="error-box">
                          <span className="output-label error-label">Runtime Error</span>
                          <pre>{r.stderr}</pre>
                        </div>
                      )}
                      {r.status && r.status !== "Accepted" && (
                        <p className="status-label">Status: {r.status}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
              {verdict && (
                <h2 className={verdict === "Accepted" ? "pass" : "fail"}>
                  {verdict === "Accepted" ? "✅ Accepted" : "❌ Wrong Answer"}
                </h2>
              )}
            </div>

          </div>{/* end bottom-panel */}
        </div>{/* end editor-right */}
      </div>
    </>
  );
}

export default QuestionDetail;