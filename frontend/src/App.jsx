import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tab, setTab] = useState("generate");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quizzes, setQuizzes] = useState([]);
  const [quiz, setQuiz] = useState(null);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  /* ---------- LOAD HISTORY ---------- */
  const loadHistory = () => {
    fetch("http://127.0.0.1:8000/history")
      .then((res) => res.json())
      .then(setQuizzes)
      .catch(console.error);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  /* ---------- GENERATE QUIZ ---------- */
  const generateQuiz = async () => {
    if (!url) {
      setError("Enter Wikipedia URL");
      return;
    }

    setLoading(true);
    setError("");
    setQuiz(null);
    setSubmitted(false);
    setAnswers({});

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/generate?url=${encodeURIComponent(url)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setQuiz(data);
      loadHistory();
    } catch {
      setError("Quiz generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OPEN FROM HISTORY ---------- */
  const openQuiz = (id) => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});

    fetch(`http://127.0.0.1:8000/quiz/${id}`)
      .then((res) => res.json())
      .then(setQuiz)
      .finally(() => setLoading(false));
  };

  /* ---------- ANSWER SELECT ---------- */
  const selectAnswer = (qIndex, option) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: option });
  };

  /* ---------- SUBMIT QUIZ ---------- */
  const submitQuiz = () => {
    let sc = 0;
    quiz.quiz_data.quiz.forEach((q, i) => {
      if (answers[i] === q.answer) sc++;
    });
    setScore(sc);
    setSubmitted(true);
  };

  return (
    <div className="container">
      <h1>Wiki Quiz Generator</h1>

      <div className="tabs">
        <button onClick={() => setTab("generate")}>Generate Quiz</button>
        <button onClick={() => setTab("history")}>History</button>
      </div>

      {tab === "generate" && (
        <>
          <div className="input-box">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste Wikipedia URL"
            />
            <button onClick={generateQuiz} disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}
          {quiz && (
            <QuizView
              quiz={quiz}
              answers={answers}
              submitted={submitted}
              selectAnswer={selectAnswer}
              submitQuiz={submitQuiz}
              score={score}
            />
          )}
        </>
      )}

      {tab === "history" && (
        <>
          <h2>Quiz History</h2>
          <table>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q.id}>
                  <td>{q.title}</td>
                  <td>
                    <button onClick={() => openQuiz(q.id)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {quiz && (
            <QuizView
              quiz={quiz}
              answers={answers}
              submitted={submitted}
              selectAnswer={selectAnswer}
              submitQuiz={submitQuiz}
              score={score}
            />
          )}
        </>
      )}
    </div>
  );
}

/* ---------- QUIZ VIEW ---------- */
function QuizView({ quiz, answers, submitted, selectAnswer, submitQuiz, score }) {
  return (
    <div className="quiz">
      <h2>{quiz.title}</h2>
      <p><strong>Summary:</strong> {quiz.summary}</p>

      {quiz.quiz_data.quiz.map((q, i) => (
        <div key={i} className="question">
          <p><strong>{i + 1}. {q.question}</strong></p>

          {q.options.map((opt) => (
            <button
              key={opt}
              className={`option ${
                submitted
                  ? opt === q.answer
                    ? "correct"
                    : opt === answers[i]
                    ? "wrong"
                    : ""
                  : answers[i] === opt
                  ? "selected"
                  : ""
              }`}
              onClick={() => selectAnswer(i, opt)}
            >
              {opt}
            </button>
          ))}

          {submitted && <p className="explanation">{q.explanation}</p>}
        </div>
      ))}

      {!submitted && (
        <button className="submit-btn" onClick={submitQuiz}>
          Submit Quiz
        </button>
      )}

      {submitted && (
        <h3>Score: {score} / {quiz.quiz_data.quiz.length}</h3>
      )}
    </div>
  );
}

export default App;
