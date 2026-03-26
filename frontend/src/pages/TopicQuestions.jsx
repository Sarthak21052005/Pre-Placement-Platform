import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/questions.css";
function TopicQuestions() {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:8000/questions/topic/${topic}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else {
          setQuestions([]);
        }
      })
      .catch((err) => console.log(err));
  }, [topic]);

  return (
    <>
      <Navbar />

      <div className="questions-container">
        <h1>{topic.toUpperCase()} Questions</h1>

        {questions.length === 0 ? (
          <p>No questions found</p>
        ) : (
         questions.map((q) => (
          <div
              key={q._id}
              className="question-card"
              onClick={() => navigate(`/questions/${q._id}`)}
              style={{ cursor: "pointer" }} // optional
          >
              <h3>{q.title}</h3>
              <p className={q.difficulty.toLowerCase()}>
              {q.difficulty}
              </p>
              </div>
      ))
        )}
      </div>
    </>
  );
}

export default TopicQuestions;