import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/attempts.css";

function MyAttempts() {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (!userId) return;

    axios
      .get(`http://localhost:8000/attempts/user/${userId}`)
      .then((res) => setAttempts(res.data || []))
      .catch((err) => console.log(err));
  }, []);

  const difficultyConfig = {
    easy: { label: "Easy", icon: "◈" },
    medium: { label: "Medium", icon: "◈" },
    hard: { label: "Hard", icon: "◈" },
  };

  return (
    <>
      <Navbar />

      <div className="attempts-container">
        {/* Header */}
        <div className="attempts-header">
          <div className="header-left">
            <span className="header-eyebrow">Dashboard</span>
            <h1 className="header-title">My Attempts</h1>
          </div>

          <div className="attempts-count">
            {attempts.length} <span>total</span>
          </div>
        </div>

        {/* Grid */}
        <div className="attempts-grid">
          {attempts.map((a, i) => {
            const difficultyKey = a.difficulty?.toLowerCase() || "easy";

            return (
              <div
                key={a.id}
                className="attempt-card"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="card-top">
                  <span className={`difficulty-badge ${difficultyKey}`}>
                    {difficultyConfig[difficultyKey]?.icon}{" "}
                    {difficultyConfig[difficultyKey]?.label ||
                      a.difficulty}
                  </span>

                  <span className="date">
                    {a.date
                      ? new Date(a.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>

                <h3 className="card-title">{a.title || "Untitled"}</h3>

               <div className="card-footer">
                {a.companies?.map((c, idx) => (
                <span key={idx} className="company-badge">
                {c}
            </span>
              ))} 
            </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {attempts.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">⊘</span>
            <p>No attempts yet. Start solving!</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MyAttempts;