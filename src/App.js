import React, { useState, useEffect } from "react";
import { HashRouter as Router } from 'react-router-dom';
import "./App.css";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch("/api/Uw5CrX")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          throw new Error("Invalid data structure");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (isCorrect, index) => {
    setSelectedOption(index);
    if (isCorrect) setScore(score + 1);
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1000);
  };

  if (loading) return <h2 className="loading">Loading Quiz...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <Router> {/* Wrapping everything inside HashRouter */}
      <div className="quiz-container">
        <h1>Quiz Game</h1>
        {quizCompleted ? (
          <div>
            <h2>Quiz Completed!</h2>
            <p>Your Score: {score} / {questions.length}</p>
            <button className="restart-btn" onClick={() => window.location.reload()}>
              Restart Quiz
            </button>
          </div>
        ) : (
          questions.length > 0 ? (
            <div>
              <h3>{questions[currentQuestion]?.description}</h3>
              {questions[currentQuestion]?.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.is_correct, index)}
                  className={`option-btn ${
                    selectedOption === index
                      ? option.is_correct
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                >
                  {option.description}
                </button>
              ))}
              <p>Score: {score}</p>
            </div>
          ) : (
            <h2>No questions available.</h2>
          )
        )}
      </div>
    </Router>
  );
};

export default App;
