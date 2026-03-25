import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionById } from "../services/api";
import "../styles/questionsDetail.css";
<div className="detail-container"></div>

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    getQuestionById(id)
      .then(res => setQuestion(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h2>{question.title}</h2>

      <p><b>Company:</b> {question.company}</p>
      <p><b>Difficulty:</b> {question.difficulty}</p>

      <p>{question.description}</p>
    </div>
  );
}

export default QuestionDetail;