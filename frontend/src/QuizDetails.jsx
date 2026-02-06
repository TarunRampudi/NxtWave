import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function QuizDetails() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!quiz) return <h2>Loading quiz...</h2>;

  return (
    <div className="container">
      <h1>{quiz.title}</h1>

      <h3>Summary</h3>
      <p>{quiz.summary}</p>

      <h3>Quiz Questions</h3>
      <pre>{JSON.stringify(quiz.quiz_data, null, 2)}</pre>
    </div>
  );
}

export default QuizDetails;
