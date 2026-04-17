import { useEffect, useState } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import Navbar from "../components/Navbar";
import "../styles/profile.css";

function Profile() {
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;
    axios
      .get(`http://localhost:8000/attempts/heatmap/${userId}`)
      .then((res) => {
        const formatted = Object.entries(res.data).map(([date, count]) => ({
          date,
          count,
        }));
        setHeatmap(formatted);
      })
      .catch((err) => console.log("Heatmap error:", err));
  }, []);

  const totalSubmissions = heatmap.reduce((sum, d) => sum + d.count, 0);
  const activeDays = heatmap.length;

  const getStreak = (data) => {
    let streak = 0;
    let today = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = today.toISOString().slice(0, 10);
      const found = data.find((d) => d.date === dateStr);
      if (found && found.count > 0) streak++;
      else break;
      today.setDate(today.getDate() - 1);
    }
    return streak;
  };

  const streak = getStreak(heatmap);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="heatmap-card">

          <div className="card-header">
            <div className="header-text">
              <span className="label">ACTIVITY</span>
              <h3>Submission Heatmap</h3>
            </div>
            <div className="header-glow" />
          </div>

          <div className="stats-row">
            <div className="stat-pill">
              <span className="stat-icon">🔥</span>
              <div>
                <span className="stat-value">{streak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-icon">📅</span>
              <div>
                <span className="stat-value">{activeDays}</span>
                <span className="stat-label">Active Days</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-pill">
              <span className="stat-icon">📊</span>
              <div>
                <span className="stat-value">{totalSubmissions}</span>
                <span className="stat-label">Total Submissions</span>
              </div>
            </div>
          </div>

          <div className="heatmap-wrap">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={heatmap}
              titleForValue={(value) => {
                if (!value || !value.date) return "No activity";
                return `${value.count || 0} submissions on ${value.date}`;
              }}
              classForValue={(value) => {
                if (!value || value.count === 0) return "color-empty";
                if (value.count === 1) return "color-scale-1";
                if (value.count === 2) return "color-scale-2";
                if (value.count <= 4) return "color-scale-3";
                return "color-scale-4";
              }}
            />
          </div>

          <div className="legend">
            <span className="legend-label">Less</span>
            <span className="legend-cell color-empty" />
            <span className="legend-cell color-scale-1" />
            <span className="legend-cell color-scale-2" />
            <span className="legend-cell color-scale-3" />
            <span className="legend-cell color-scale-4" />
            <span className="legend-label">More</span>
          </div>

        </div>
      </div>
    </>
  );
}

export default Profile;