import { useNavigate, useParams} from "react-router-dom";
import {useState , useEffect} from "react";
import { getQuestionsByCompany } from "../services/api";
import "../styles/questions.css";
function Questions() {
  const { company } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestionsByCompany(company)
      .then(res => setQuestions(res.data))
      .catch(err => console.log(err));
  }, [company]);

  return (
    <div className="questions-container">
      <h1>Top {company} Questions</h1>

      {Array.isArray(questions) &&
        questions.map(q => (
          <div
            className="question-card"
            key={q._id}
            onClick={() => navigate(`/questions/${q._id}`)}
          >
            <h3>{q.title}</h3>
            <p>{q.difficulty}</p>
          </div>
        ))}
    </div>
  );
}
export default Questions;