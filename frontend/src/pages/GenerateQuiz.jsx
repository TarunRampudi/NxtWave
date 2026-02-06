import { useState } from "react";
import api from "../services/api";

function GenerateQuiz() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!url) {
      setError("Please enter a Wikipedia URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuizData(null);

      const res = await api.post(`/generate?url=${encodeURIComponent(url)}`);
      setQuizData(res.data);
    } catch (err) {
      setError("Failed to generate quiz. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Quiz</h2>

      {/* Input Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Wikipedia URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 20px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Generate Quiz
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Generating quiz...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Quiz Display */}
      {quizData && (
        <div>

          {/* Summary Card */}
          <div className="card">
            <h3>{quizData.title}</h3>
            <p>{quizData.summary}</p>
          </div>

          {/* Quiz Cards */}
          <h3>Quiz</h3>
          <div>
            {quizData.quiz_data?.quiz?.map((q, index) => (
              <div key={index} className="quiz-card">
                <h4>
                  {index + 1}. {q.question}
                </h4>

                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>

                <p><b>Answer:</b> {q.answer}</p>
                <p><b>Difficulty:</b> {q.difficulty}</p>
                <p><b>Explanation:</b> {q.explanation}</p>
              </div>
            ))}
          </div>

          {/* Related Topics */}
          <h3>Related Topics</h3>
          <div className="topics">
            {quizData.quiz_data?.related_topics?.map((topic, i) => (
              <span key={i} className="topic-badge">{topic}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateQuiz;
