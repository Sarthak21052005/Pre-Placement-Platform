import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

function DashBoard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(localStorage.getItem("user_name"));
  const userId = localStorage.getItem("user_id");

  console.log("User ID:", userId);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8000/attempts/stats/${userId}`)
      .then((res) => {
        console.log("Stats:", res.data);
        setStats(res.data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        setStats({
          total: 0,
          easy: 0,
          medium: 0,
          hard: 0,
          topics: {},
          companies: {}
        });
      });
  }, [userId]);

  if (!userId) return <p>Please login first</p>;

  if (!stats) return <p>Loading...</p>;

  const total = stats.total > 0 ? stats.total : 1;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">

        <div className="user-card">
          <img src="/logos/user.png" alt="user" />
          <h1>{user || "User"}</h1>
        </div>

        <div className="stats-card">
          <h1>{stats.total}</h1>
          <p>Problems Solved</p>

          <div className="difficulty">
            <span className="easy">Easy {stats.easy || 0}</span>
            <span className="medium">Medium {stats.medium || 0}</span>
            <span className="hard">Hard {stats.hard || 0}</span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="easy-bar"
            style={{ width: `${(stats.easy / total) * 100}%` }}
          />
          <div
            className="medium-bar"
            style={{ width: `${(stats.medium / total) * 100}%` }}
          />
          <div
            className="hard-bar"
            style={{ width: `${(stats.hard / total) * 100}%` }}
          />
        </div>

        <div className="topics-card">
          <h3>Topic Progress</h3>
          {stats.topics &&
            Object.entries(stats.topics).map(([topic, count]) => (
              <div key={topic} className="bar-row">
                <span>{topic}</span>
                <div className="bar">
                  <div style={{ width: `${count * 5}%` }}></div>
                </div>
                <span>{count}</span>
              </div>
            ))}
        </div>

        <div className="companies-card">
          <h3>Company Progress</h3>
          {stats.companies &&
            Object.entries(stats.companies).map(([company, count]) => (
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
