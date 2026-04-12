import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/admindashboard.css";

function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    company: "",
    topic: "",
    difficulty: "",
    description: "",
    tags: ""
  });

  const token = localStorage.getItem("token");

  const API = axios.create({
    baseURL: "http://localhost:8000"
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      window.location.href = "/login";
      return;
    }

    fetchQuestions();
    fetchUsers();
  }, []);

  // 🔹 FETCH QUESTIONS
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

  // 🔹 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users/all", authHeader);
      setUsers(res.data);
    } catch {
      toast.error("Unauthorized access");
    }
  };

  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 ADD QUESTION
  const handleAddQuestion = async () => {
    if (!newQuestion.title) return toast.error("Enter title");

    setActionLoading(true);

    const payload = {
      ...newQuestion,
      company: newQuestion.company.split(","),
      tags: newQuestion.tags.split(",")
    };

    try {
      await API.post("/admin/questions/add", payload, authHeader);
      toast.success("Question added");

      setNewQuestion({
        title: "",
        company: "",
        topic: "",
        difficulty: "",
        description: "",
        tags: ""
      });

      fetchQuestions();
    } catch {
      toast.error("Error adding question");
    }

    setActionLoading(false);
  };

  // 🔹 DELETE QUESTION
  const deleteQuestion = async (id) => {
    setActionLoading(true);

    try {
      await API.delete(`/admin/questions/${id}`, authHeader);
      toast.success("Question deleted");
      fetchQuestions();
    } catch {
      toast.error("Delete failed");
    }

    setActionLoading(false);
  };

  // 🔹 DELETE USER
  const deleteUser = async (id) => {
    setActionLoading(true);

    try {
      await API.delete(`/admin/users/${id}`, authHeader);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }

    setActionLoading(false);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* ADD QUESTION */}
      <div className="admin-section">
        <h2>Add Question</h2>

        <input className="admin-input" name="title" placeholder="Title" value={newQuestion.title} onChange={handleChange} />
        <input className="admin-input" name="company" placeholder="Company (comma separated)" value={newQuestion.company} onChange={handleChange} />
        <input className="admin-input" name="topic" placeholder="Topic" value={newQuestion.topic} onChange={handleChange} />
        <input className="admin-input" name="difficulty" placeholder="Difficulty" value={newQuestion.difficulty} onChange={handleChange} />
        <input className="admin-input" name="description" placeholder="Description" value={newQuestion.description} onChange={handleChange} />
        <input className="admin-input" name="tags" placeholder="Tags (comma separated)" value={newQuestion.tags} onChange={handleChange} />

        <button className="admin-btn" onClick={handleAddQuestion} disabled={actionLoading}>
          {actionLoading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* QUESTIONS */}
      <div className="admin-section">
        <h2>Questions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="admin-list">
            {questions.map((q) => (
              <div className="admin-card" key={q.id}>
                <b>{q.title}</b>
                <p>{q.topic}</p>
                <span className="admin-badge">{q.difficulty}</span>

                <button
                  className="admin-delete"
                  onClick={() => deleteQuestion(q.id)}
                  disabled={actionLoading}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* USERS */}
      <div className="admin-section">
        <h2>Users</h2>

        <div className="admin-list">
          {users.map((u) => (
            <div className="admin-card" key={u.id}>
              <b>{u.name}</b>
              <p>{u.email}</p>

              <button
                className="admin-delete"
                onClick={() => deleteUser(u.id)}
                disabled={actionLoading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;