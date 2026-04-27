import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leaderboard.css";

function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/leaderboard")
      .then((res) => {
        console.log("LEADERBOARD:", res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="info-text">Loading leaderboard...</p>
      </>
    );
  }

  return (
    <div className="dashboard-root">
      <Navbar />

      <div className="dashboard-grid">
        <div className="card leaderboard-card">
          <h2 className="leaderboard-title">🏆 Leaderboard</h2>

          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Solved</th>
                <th>Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {data.map((user, index) => (
                <tr
                  key={user.user_id || index}
                  className={index < 3 ? "top-row" : ""}
                >
                  {/* 🔥 Rank (from backend) */}
                  <td className="rank-cell">
                    {user.rank === 1 && "🥇"}
                    {user.rank === 2 && "🥈"}
                    {user.rank === 3 && "🥉"}
                    {user.rank > 3 && `#${user.rank}`}
                  </td>

                  {/* Name */}
                  <td className="name-cell">{user.name}</td>

                  {/* Solved */}
                  <td className="score-cell">
                    <span className="score-badge">
                      {user.solved}
                    </span>
                  </td>

                  {/* 🔥 Accuracy */}
                  <td className="accuracy-cell">
                    {user.accuracy !== undefined
                      ? `${user.accuracy}%`
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {data.length === 0 && (
            <p className="info-text">No leaderboard data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;