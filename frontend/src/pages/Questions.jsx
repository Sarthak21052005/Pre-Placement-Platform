import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getQuestionsByCompany } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/questions.css";

function Questions() {
  const { company } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestionsByCompany(company)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else {
          setQuestions([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setQuestions([]);
      });
  }, [company]);

  return (
    <>
      <Navbar />

      <div className="questions-container">
        <h1>Top {company} Questions</h1>

        {questions.length === 0 ? (
          <p>No questions found</p>
        ) : (
          questions.map((q) => (
            <div
              className="question-card"
              key={q._id}
              onClick={() => navigate(`/questions/${q._id}`)}
              style={{ cursor: "pointer" }}
            >
              {/* LEFT */}
              <h3>{q.title}</h3>

              {/* RIGHT */}
              <div className="question-meta">
                <span
                  className={`dot ${q.difficulty.toLowerCase()}`}
                ></span>

                <p
                  className={`difficulty ${q.difficulty.toLowerCase()}`}
                >
                  {q.difficulty}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Questions;