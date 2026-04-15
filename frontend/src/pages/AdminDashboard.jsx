import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/admindashboard.css";

// Defined OUTSIDE the component so it's never recreated on re-render
const Field = ({ label, name, value, onChange, textarea, placeholder, hint }) => (
  <div className="field-group">
    <label className="field-label">{label}{hint && <span className="field-hint">{hint}</span>}</label>
    {textarea
      ? <textarea className="admin-input admin-textarea" name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4} />
      : <input className="admin-input" name={name} value={value} onChange={onChange} placeholder={placeholder} />
    }
  </div>
);

const EMPTY_QUESTION = {
  title: "",
  company: "",
  topic: "",
  difficulty: "",
  description: "",
  full_description: "",
  constraints: "",
  tags: "",
  function_name: "",
  return_type: "",
  input_format: "",   // JSON string, e.g. [{"name":"nums","type":"vector<int>"}]
  testcases: ""       // JSON string array of {input, expected_output, hidden}
};

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [newQuestion, setNewQuestion] = useState({ ...EMPTY_QUESTION });

  // Edit modal state
  const [editingQuestion, setEditingQuestion] = useState(null); // null = closed
  const [editForm, setEditForm] = useState({ ...EMPTY_QUESTION });

  // Confirm modal state: { type: "question"|"user", id, name }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const token = localStorage.getItem("token");

  const API = axios.create({ baseURL: "http://localhost:8000" });
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      window.location.href = "/login";
      return;
    }
    fetchQuestions();
    fetchUsers();
  }, []);

  // ── FETCH ────────────────────────────────────────────────────────────────
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/questions/all", authHeader);
      setQuestions(res.data);
    } catch {
      toast.error("Unauthorized access");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users/all", authHeader);
      setUsers(res.data);
    } catch {
      toast.error("Unauthorized access");
    }
  };

  // ── HELPERS ──────────────────────────────────────────────────────────────
  // Convert question object → flat form strings for editing
  const questionToForm = (q) => ({
    title: q.title || "",
    company: Array.isArray(q.company) ? q.company.join(", ") : q.company || "",
    topic: Array.isArray(q.topic) ? q.topic.join(", ") : q.topic || "",
    difficulty: q.difficulty || "",
    description: q.description || "",
    full_description: Array.isArray(q.full_description) ? q.full_description.join("\n") : q.full_description || "",
    constraints: Array.isArray(q.constraints) ? q.constraints.join("\n") : q.constraints || "",
    tags: Array.isArray(q.tags) ? q.tags.join(", ") : q.tags || "",
    function_name: q.function_name || "",
    return_type: q.return_type || "",
    input_format: q.input_format ? JSON.stringify(q.input_format, null, 2) : "[]",
    testcases: q.testcases ? JSON.stringify(q.testcases, null, 2) : "[]"
  });

  // Convert form strings → payload for API
  const formToPayload = (form) => {
    let input_format = [];
    let testcases = [];

    try { input_format = JSON.parse(form.input_format); } catch { toast.error("input_format is not valid JSON"); throw new Error("json"); }
    try { testcases = JSON.parse(form.testcases); } catch { toast.error("testcases is not valid JSON"); throw new Error("json"); }

    return {
      title: form.title,
      company: form.company.split(",").map(s => s.trim()).filter(Boolean),
      topic: form.topic.includes(",")
        ? form.topic.split(",").map(s => s.trim()).filter(Boolean)
        : form.topic.trim(),
      difficulty: form.difficulty,
      description: form.description,
      full_description: form.full_description.split("\n").map(s => s.trim()).filter(Boolean),
      constraints: form.constraints.split("\n").map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      function_name: form.function_name,
      return_type: form.return_type,
      input_format,
      testcases
    };
  };

  // ── ADD QUESTION ─────────────────────────────────────────────────────────
  const handleAddQuestion = async () => {
    if (!newQuestion.title) return toast.error("Enter a title");
    setActionLoading(true);
    try {
      const payload = formToPayload(newQuestion);
      await API.post("/admin/questions/add", payload, authHeader);
      toast.success("Question added");
      setNewQuestion({ ...EMPTY_QUESTION });
      fetchQuestions();
    } catch (e) {
      if (e.message !== "json") toast.error("Error adding question");
    }
    setActionLoading(false);
  };

  // ── OPEN EDIT MODAL ───────────────────────────────────────────────────────
  const openEdit = (q) => {
    setEditingQuestion(q);
    setEditForm(questionToForm(q));
  };

  // ── SAVE EDIT ────────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editingQuestion) return;
    setActionLoading(true);
    try {
      const payload = formToPayload(editForm);
      await API.put(`/admin/questions/${editingQuestion.id}`, payload, authHeader);
      toast.success("Question updated");
      setEditingQuestion(null);
      fetchQuestions();
    } catch (e) {
      if (e.message !== "json") toast.error("Error updating question");
    }
    setActionLoading(false);
  };

  // ── DELETE (after confirm) ────────────────────────────────────────────────
  const handleConfirmedDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    try {
      if (confirmDelete.type === "question") {
        await API.delete(`/admin/questions/${confirmDelete.id}`, authHeader);
        toast.success("Question deleted");
        fetchQuestions();
      } else {
        await API.delete(`/admin/users/${confirmDelete.id}`, authHeader);
        toast.success("User deleted");
        fetchUsers();
      }
    } catch {
      toast.error("Delete failed");
    }
    setConfirmDelete(null);
    setActionLoading(false);
  };

  const makeHandler = (setter) => (e) =>
    setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* ── ADD QUESTION ─────────────────────────────────────────────── */}
      <div className="admin-section">
        <h2>Add Question</h2>
        <div className="form-grid">
          <Field label="Title" name="title" value={newQuestion.title} onChange={makeHandler(setNewQuestion)} placeholder="Two Sum" />
          <Field label="Difficulty" name="difficulty" value={newQuestion.difficulty} onChange={makeHandler(setNewQuestion)} placeholder="Easy / Medium / Hard" />
          <Field label="Company" name="company" value={newQuestion.company} onChange={makeHandler(setNewQuestion)} placeholder="Amazon, Google" hint="comma separated" />
          <Field label="Topic" name="topic" value={newQuestion.topic} onChange={makeHandler(setNewQuestion)} placeholder="Arrays, Sliding Window" hint="comma separated for multiple" />
          <Field label="Tags" name="tags" value={newQuestion.tags} onChange={makeHandler(setNewQuestion)} placeholder="array, hashmap" hint="comma separated" />
          <Field label="Function Name" name="function_name" value={newQuestion.function_name} onChange={makeHandler(setNewQuestion)} placeholder="twoSum" />
          <Field label="Return Type" name="return_type" value={newQuestion.return_type} onChange={makeHandler(setNewQuestion)} placeholder="vector<int>" />
        </div>

        <Field label="Short Description" name="description" value={newQuestion.description} onChange={makeHandler(setNewQuestion)} placeholder="Brief one-line problem summary" textarea />
        <Field label="Full Description" name="full_description" value={newQuestion.full_description} onChange={makeHandler(setNewQuestion)} placeholder="Each line becomes a separate paragraph" textarea hint="one item per line" />
        <Field label="Constraints" name="constraints" value={newQuestion.constraints} onChange={makeHandler(setNewQuestion)} placeholder={"2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9"} textarea hint="one per line" />
        <Field
          label="Input Format"
          name="input_format"
          value={newQuestion.input_format}
          onChange={makeHandler(setNewQuestion)}
          textarea
          placeholder={'[{"name":"nums","type":"vector<int>"},{"name":"target","type":"int"}]'}
          hint="JSON array"
        />
        <Field
          label="Test Cases"
          name="testcases"
          value={newQuestion.testcases}
          onChange={makeHandler(setNewQuestion)}
          textarea
          placeholder={'[{"input":"[2,7,11,15]\\n9","expected_output":"[0,1]","hidden":false}]'}
          hint="JSON array"
        />

        <button className="admin-btn" onClick={handleAddQuestion} disabled={actionLoading}>
          {actionLoading ? "Adding..." : "+ Add Question"}
        </button>
      </div>

      {/* ── QUESTIONS LIST ────────────────────────────────────────────── */}
      <div className="admin-section">
        <h2>Questions <span className="count-badge">{questions.length}</span></h2>
        {loading ? (
          <p className="loading-text">Loading questions…</p>
        ) : (
          <div className="admin-list">
            {questions.map((q) => (
              <div className="admin-card" key={q.id}>
                <span className={`diff-badge diff-${(q.difficulty || "").toLowerCase()}`}>{q.difficulty}</span>
                <b>{q.title}</b>
                <p className="card-topic">{Array.isArray(q.topic) ? q.topic.join(", ") : q.topic}</p>
                <p className="card-company">{Array.isArray(q.company) ? q.company.join(", ") : q.company}</p>
                {q.testcases?.length > 0 && (
                  <p className="card-meta">{q.testcases.length} test case{q.testcases.length !== 1 ? "s" : ""} · {q.testcases.filter(t => t.hidden).length} hidden</p>
                )}
                <div className="card-actions">
                  <button className="admin-edit" onClick={() => openEdit(q)}>Edit</button>
                  <button
                    className="admin-delete"
                    onClick={() => setConfirmDelete({ type: "question", id: q.id, name: q.title })}
                    disabled={actionLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── USERS LIST ────────────────────────────────────────────────── */}
      <div className="admin-section">
        <h2>Users <span className="count-badge">{users.length}</span></h2>
        <div className="admin-list">
          {users.map((u) => (
            <div className="admin-card admin-user-card" key={u.id}>
              <div className="user-avatar">{u.name?.[0]?.toUpperCase()}</div>
              <b>{u.name}</b>
              <p>{u.email}</p>
              <div className="card-actions">
                <button
                  className="admin-delete"
                  onClick={() => setConfirmDelete({ type: "user", id: u.id, name: u.name })}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── EDIT MODAL ────────────────────────────────────────────────── */}
      {editingQuestion && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingQuestion(null); }}>
          <div className="modal">
            <div className="modal-header">
              <h3>Edit: {editingQuestion.title}</h3>
              <button className="modal-close" onClick={() => setEditingQuestion(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <Field label="Title" name="title" value={editForm.title} onChange={makeHandler(setEditForm)} />
                <Field label="Difficulty" name="difficulty" value={editForm.difficulty} onChange={makeHandler(setEditForm)} />
                <Field label="Company" name="company" value={editForm.company} onChange={makeHandler(setEditForm)} hint="comma separated" />
                <Field label="Topic" name="topic" value={editForm.topic} onChange={makeHandler(setEditForm)} hint="comma separated for multiple" />
                <Field label="Tags" name="tags" value={editForm.tags} onChange={makeHandler(setEditForm)} hint="comma separated" />
                <Field label="Function Name" name="function_name" value={editForm.function_name} onChange={makeHandler(setEditForm)} />
                <Field label="Return Type" name="return_type" value={editForm.return_type} onChange={makeHandler(setEditForm)} />
              </div>
              <Field label="Short Description" name="description" value={editForm.description} onChange={makeHandler(setEditForm)} textarea />
              <Field label="Full Description" name="full_description" value={editForm.full_description} onChange={makeHandler(setEditForm)} textarea hint="one item per line" />
              <Field label="Constraints" name="constraints" value={editForm.constraints} onChange={makeHandler(setEditForm)} textarea hint="one per line" />
              <Field label="Input Format" name="input_format" value={editForm.input_format} onChange={makeHandler(setEditForm)} textarea hint="JSON array" />
              <Field label="Test Cases" name="testcases" value={editForm.testcases} onChange={makeHandler(setEditForm)} textarea hint="JSON array" />
            </div>
            <div className="modal-footer">
              <button className="admin-btn-outline" onClick={() => setEditingQuestion(null)}>Cancel</button>
              <button className="admin-btn" onClick={handleSaveEdit} disabled={actionLoading}>
                {actionLoading ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE MODAL ──────────────────────────────────────── */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div className="modal modal-confirm">
            <div className="confirm-icon">🗑️</div>
            <h3>Delete {confirmDelete.type === "user" ? "User" : "Question"}?</h3>
            <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="admin-btn-outline" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="admin-delete-confirm" onClick={handleConfirmedDelete} disabled={actionLoading}>
                {actionLoading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;