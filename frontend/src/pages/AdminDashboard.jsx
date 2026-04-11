import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admindashboard.css";
function AdminDashboard() {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    company: "",
    topic: "",
    difficulty: "",
    description: "",
    tags: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    fetchQuestions();
    fetchUsers();
  }, []);

  const API = axios.create({
    baseURL: "http://localhost:8000"
  });

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchQuestions = () => {
    API.get("/admin/questions/all", authHeader)
      .then(res => setQuestions(res.data))
      .catch(() => alert("Unauthorized"));
  };

  const fetchUsers = () => {
    API.get("/admin/users/all", authHeader)
      .then(res => setUsers(res.data))
      .catch(() => alert("Unauthorized"));
  };

  const handleChange = (e) => {
    setNewQuestion({
      ...newQuestion,
      [e.target.name]: e.target.value
    });
  };

  const handleAddQuestion = () => {
    const payload = {
      ...newQuestion,
      company: newQuestion.company.split(","),
      tags: newQuestion.tags.split(",")
    };

    API.post("/admin/questions/add", payload, authHeader)
      .then(() => {
        fetchQuestions();
        alert("Question Added");
      })
      .catch(() => alert("Error adding question"));
  };

  const deleteQuestion = (id) => {
    API.delete(`/admin/questions/${id}`, authHeader)
      .then(() => fetchQuestions())
      .catch(() => alert("Delete failed"));
  };

  const deleteUser = (id) => {
    API.delete(`/admin/users/${id}`, authHeader)
      .then(() => fetchUsers())
      .catch(() => alert("Delete failed"));
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-section">
        <h2>Add Question</h2>

        <input className="admin-input" name="title" placeholder="Title" onChange={handleChange} />
        <input className="admin-input" name="company" placeholder="Company (comma separated)" onChange={handleChange} />
        <input className="admin-input" name="topic" placeholder="Topic" onChange={handleChange} />
        <input className="admin-input" name="difficulty" placeholder="Difficulty" onChange={handleChange} />
        <input className="admin-input" name="description" placeholder="Description" onChange={handleChange} />
        <input className="admin-input" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />

        <button className="admin-btn" onClick={handleAddQuestion}>Add</button>
      </div>

      <div className="admin-section">
        <h2>Questions</h2>

        <div className="admin-list">
          {questions.map(q => (
            <div className="admin-card" key={q.id}>
              <b>{q.title}</b>
              <p>{q.topic}</p>
            <span className="admin-badge">{q.difficulty}</span>
              <button className="admin-delete" onClick={() => deleteQuestion(q.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* USERS */}
      <div className="admin-section">
        <h2>Users</h2>

        <div className="admin-list">
          {users.map(u => (
            <div className="admin-card" key={u.id}>
              <b>{u.name}</b>
              <p>{u.email}</p>
              <button className="admin-delete" onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;