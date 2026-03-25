import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function DashBoard() {
  const [stats, setStats] = useState(null);

  const userId = 1; // later from auth

  useEffect(() => {
    axios
      .get(`http://localhost:8000/attempts/stats/${userId}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const total = stats.total || 1;

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        {/* 👤 USER CARD */}
        <div className="user-card">
          <img src="/logos/profile.jpg" alt="user" />
          <h2>Sarthak</h2>
          <p>Placement Preparation 🚀</p>
        </div>

        {/* 📊 STATS */}
        <div className="stats-card">
          <h1>{stats.total}</h1>
          <p>Problems Solved</p>

          <div className="difficulty">
            <span className="easy">Easy {stats.easy}</span>
            <span className="medium">Medium {stats.medium}</span>
            <span className="hard">Hard {stats.hard}</span>
          </div>
        </div>

        {/* 📈 LINEAR BAR */}
        <div className="progress-bar">
          <div
            className="easy-bar"
            style={{ width: `${(stats.easy / total) * 100}%` }}
          ></div>
          <div
            className="medium-bar"
            style={{ width: `${(stats.medium / total) * 100}%` }}
          ></div>
          <div
            className="hard-bar"
            style={{ width: `${(stats.hard / total) * 100}%` }}
          ></div>
        </div>

        {/* 📚 TOPICS */}
        <div className="topics-card">
          <h3>Topic Progress</h3>
          {Object.entries(stats.topics).map(([topic, count]) => (
            <div key={topic} className="bar-row">
              <span>{topic}</span>
              <div className="bar">
                <div style={{ width: `${count * 5}%` }}></div>
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>

        {/* 🏢 COMPANIES */}
        <div className="companies-card">
          <h3>Company Progress</h3>
          {Object.entries(stats.companies).map(([company, count]) => (
            <div key={company} className="bar-row">
              <span>{company}</span>
              <div className="bar">
                <div style={{ width: `${count * 5}%` }}></div>
              </div>
              <span>{count}</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default DashBoard;