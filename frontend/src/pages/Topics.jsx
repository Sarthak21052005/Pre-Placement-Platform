import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/topics.css";

function Topics() {
  const navigate = useNavigate();

  const topics = [
    "array",
    "two pointers",
    "sliding window",
    "linked list",
    "stack",
    "queue",
    "tree",
    "graph",
    "dynamic programming",
    "greedy",
    "Back-tracking",
    "Seg"
  ];

  return (
    <>
      <Navbar />

      <div className="topics-container">
        <h1>Topics</h1>

        <div className="topics-grid">
          {topics.map((topic) => (
            <div
              key={topic}
              className="topic-card"
              onClick={() => navigate(`/topics/${topic}`)}
            >
              {topic.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Topics;