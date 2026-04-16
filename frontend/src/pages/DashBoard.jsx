import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
} from "recharts";

import "../styles/dashboard.css";

const COLORS = { easy: "#34d399", medium: "#fbbf24", hard: "#f87171" };

function DashBoard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = localStorage.getItem("user_name");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8000/attempts/stats/${userId}`)
      .then((res) => setStats(res.data))
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return <p className="info-text">Please login first.</p>;
  if (loading) return <p className="info-text">Loading dashboard…</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!stats) return <p className="info-text">No data found.</p>;

  const total = stats.total || 0;

  const diffData = [
    { name: "Easy", value: stats.easy || 0 },
    { name: "Medium", value: stats.medium || 0 },
    { name: "Hard", value: stats.hard || 0 },
  ];

  const topicData = Object.entries(stats.topics || {}).map(([topic, count]) => ({
    topic,
    count,
  }));

const companyData = Object.entries(stats.companies || {}).map(
  ([company, count]) => ({
    company,
    count,
  })
);

  return (
    <>
      <Navbar />

      <div className="dashboard-root">
        <div className="dashboard-grid">

          {/* 👤 USER CARD */}
          <div className="card user-card-modern">
            <img src="/logos/user.png" alt="avatar" className="avatar" />
            <h1 className="username">{user || "User"}</h1>

            <div>
              <span className="badge easy">Easy {stats.easy}</span>
              <span className="badge medium">Medium {stats.medium}</span>
              <span className="badge hard">Hard {stats.hard}</span>
            </div>

            <div className="divider" />

            {/* 📚 TOPICS MINI */}
            <div className="full-width">
              <p className="section-title">Topics</p>
              {Object.entries(stats.topics || {}).map(([topic, count]) => {
                const percent = total ? (count / total) * 100 : 0;

                return (
                  <div key={topic} className="bar-row">
                    <span className="bar-label">{topic}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="bar-count">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="divider" />

            {/* 🏢 COMPANIES MINI */}
            <div className="full-width">
              <p className="section-title">Companies</p>
              {Object.entries(stats.companies || {}).map(([co, count]) => {
                const percent = total ? (count / total) * 100 : 0;

                return (
                  <div key={co} className="bar-row">
                    <span className="bar-label">{co}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill purple"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📊 STATS */}
          <div className="card">
            <p className="stat-label">Problems Solved</p>
            <div className="stat-number">{total}</div>

            <div className="stat-row">
              {diffData.map((d) => (
                <div key={d.name}>
                  <div className={`stat-value ${d.name.toLowerCase()}`}>
                    {d.value}
                  </div>
                  <div className="stat-sub">{d.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 📊 CHARTS */}
        {/* 📊 CHARTS */}
<div className="charts-row">

  {/* 🥧 PIE */}
  <div className="card">
    <p className="section-title">Difficulty Split</p>

    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={diffData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          dataKey="value"
        >
          {diffData.map((_, i) => (
            <Cell key={i} fill={Object.values(COLORS)[i]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>

  {/* 📊 TOPIC BAR */}
  <div className="card">
    <p className="section-title">Topic Breakdown</p>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={topicData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="topic" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* 🏢 COMPANY BAR (NEW) */}
  <div className="card">
    <p className="section-title">Company Breakdown</p>

    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={companyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="company" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#a78bfa" />
      </BarChart>
    </ResponsiveContainer>
  </div>
        </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;