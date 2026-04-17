import { useEffect, useState } from "react";
import axios from "axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import fireicon from  "../assets/fire.png";
import calendericon from  "../assets/calendar.png";
import tasklisticon from "../assets/task-list.png";
import Navbar from "../components/Navbar";
import "../styles/profile.css";

function Profile() {
  const [heatmap, setHeatmap] = useState([]);

  // 🔥 FETCH DATA
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

  // 🧠 TOTAL SUBMISSIONS
  const totalSubmissions = heatmap.reduce((sum, d) => sum + d.count, 0);

  // 📅 ACTIVE DAYS
  const activeDays = heatmap.length;

  // 🔥 STREAK LOGIC
  const getStreak = (data) => {
    let streak = 0;
    let today = new Date();

    for (let i = 0; i < 365; i++) {
      const dateStr = today.toISOString().slice(0, 10);
      const found = data.find((d) => d.date === dateStr);

      if (found && found.count > 0) {
        streak++;
      } else {
        break;
      }

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

          {/* 🔥 HEADER */}
          <h3>Submission Activity</h3>

          {/* 📊 STATS */}
          <div className="heatmap-stats">
         <p>
        <img src={fireicon} alt="streak" className="stat-icon" />
        Streak: <b>{streak}</b> days
        </p>
        <p>
        <img src={calendericon} alt="active days" className="stat-icon" />
        Active Days: <b>{activeDays}</b>
        </p>
        <p>
        <img src={tasklisticon} alt="total submissions" className="stat-icon" />
        Total: <b>{totalSubmissions}</b>
        </p>
        </div>

          {/* 📅 HEATMAP */}
          <CalendarHeatmap
            startDate={
              new Date(new Date().setFullYear(new Date().getFullYear() - 1))
            }
            endDate={new Date()}
            values={heatmap}

            // 🔥 TOOLTIP
            titleForValue={(value) => {
              if (!value || !value.date) return "No activity";
              return `${value.count || 0} submissions on ${value.date}`;
            }}

            // 🎨 COLOR SCALE
            classForValue={(value) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count === 1) return "color-scale-1";
              if (value.count === 2) return "color-scale-2";
              if (value.count <= 4) return "color-scale-3";
              return "color-scale-4";
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Profile;