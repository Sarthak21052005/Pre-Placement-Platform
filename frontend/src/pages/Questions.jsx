import { useEffect, useState } from "react";
import { getQuestions } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/questions.css";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestions()
      .then(res => {
        console.log(res.data); // 🔍 debug
        setQuestions(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="questions-container">
      <h2>Questions</h2>

      {Array.isArray(questions) &&
        questions.map(q => (
          <div
            className="question-card"
            key={q._id}
            onClick={() => navigate(`/questions/${q._id}`)}
          >
            <h3>{q.title}</h3>
            <p>{q.company}</p>
          </div>
        ))}
    </div>
  );
}

export default Questions;