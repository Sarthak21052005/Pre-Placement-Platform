import { useEffect, useState, useCallback } from "react";
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
  const [leftWidth, setLeftWidth] = useState(50);
  const [testcases, setTestcases] = useState([]);
  const [activeCase, setActiveCase] = useState(0);
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [verdict, setVerdict] = useState("");

  // ✅ Stopwatch ONLY controlled by buttons
  const { formatted, isRunning, start, stop, reset } = useStopwatch();

  // ❌ NO AUTO START HERE (IMPORTANT FIX)

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

  // 🚀 RUN (NO TIMER INTERFERENCE)
  const handleRun = async () => {
    setRunLoading(true);
    setResults([]);
    setVerdict("");

    try {
      const res = await axios.post("http://localhost:8000/run", {
        question_id: id,
        code,
        language,
      });

      if (res.data.error) {
        toast.error(res.data.error);
        setVerdict("Error");
        return;
      }

      setResults(res.data.results || []);
      setVerdict(res.data.final_verdict || "Error");
    } catch (err) {
      console.error(err);
      toast.error("Execution failed");
      setVerdict("Error");
    }

    setRunLoading(false);
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    if (verdict !== "Accepted")
      return toast.error("Run & pass all testcases first");

    const userId = localStorage.getItem("user_id");
    if (!userId) return toast.error("Login required");

    setSubmitLoading(true);

    try {
      await axios.post("http://localhost:8000/attempts", {
        user_id: userId,
        question_id: id,
        question_name: question.title,
        company_names: JSON.stringify(question.company),
        difficulty: question.difficulty,
        status: "solved",
      });

      toast.success("Submitted successfully!");
    } catch (err) {
      toast.error("Submit failed");
    }

    setSubmitLoading(false);
  };

  // 🖱 RESIZER
  const handleDrag = useCallback((e) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
  }, []);

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleDrag);
    });
  };

  if (!question) return <p>Loading...</p>;

  const visibleTestcases = testcases.filter((tc) => !tc.hidden);

  return (
    <>
      <Navbar />

      <div className="detail-container">

        {/* LEFT PANEL */}
        <div className="question-left" style={{ width: `${leftWidth}%` }}>

  <h2>{question.title}</h2>

  {/* META */}
  <div className="meta">
    <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
      {question.difficulty}
    </span>

    {question.company?.map((c, i) => (
      <span key={i} className="company">{c}</span>
    ))}

    <span className="topic">{question.topic}</span>

    {question.tags?.map((tag, i) => (
      <span key={i} className="tag">{tag}</span>
    ))}
  </div>

  {/* DESCRIPTION */}
  <p className="description">{question.description}</p>

  {/* 🔥 FULL DESCRIPTION */}
  {question.full_description?.length > 0 && (
    <div className="section">
      <h3>Details</h3>
      <ul className="full-description">
        {question.full_description.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  )}

  {/* 🔥 CONSTRAINTS */}
  {question.constraints?.length > 0 && (
    <div className="constraints-box">
      <h3>Constraints</h3>
      <ul>
        {question.constraints.map((c, i) => (
          <li key={i}><code>{c}</code></li>
        ))}
      </ul>
    </div>
  )}

  {/* 🔥 SAMPLE TESTCASES (VISIBLE ONLY) */}
  {question.testcases?.filter(tc => !tc.hidden).length > 0 && (
    <div className="section">
      <h3>Sample Testcases</h3>

      {question.testcases
        .filter(tc => !tc.hidden)
        .map((tc, i) => (
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
        <div className="resizer" onMouseDown={handleMouseDown} />

        {/* RIGHT PANEL */}
        <div className="editor-right">

          {/* HEADER */}
          <div className="editor-header">

            <div className="editor-header-left">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>

              {/* ✅ STOPWATCH (MANUAL CONTROL ONLY) */}
              <div className={`stopwatch ${isRunning ? "running" : "paused"}`}>
                <span>⏱</span>
                <span>{formatted}</span>

                <button onClick={isRunning ? stop : start}>
                  {isRunning ? "⏸" : "▶"}
                </button>

                <button onClick={reset}>↺</button>
              </div>
            </div>

            <div>
              <button onClick={handleRun}>
                {runLoading ? "Running..." : "Run"}
              </button>

              <button onClick={handleSubmit}>
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>

          </div>

          {/* EDITOR */}
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
              }}
            />
          </div>

          {/* TESTCASES */}
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

          {/* OUTPUT */}
          <div className="output-box">
            <h3>Results</h3>

            {results.map((r, i) => (
              <div key={i} className="result-case">
                <p className={r.passed ? "pass" : "fail"}>
                  {r.passed ? "✔ Passed" : "✘ Failed"}
                </p>
              </div>
            ))}

            {verdict && (
              <h2 className={verdict === "Accepted" ? "pass" : "fail"}>
                {verdict}
              </h2>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default QuestionDetail;