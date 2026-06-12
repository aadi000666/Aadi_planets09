import React, { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS } from '../data/planets';

const TOTAL = 10; // questions per round

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizModal({ onClose }) {
  const [phase, setPhase]         = useState('start');   // start | playing | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [score, setScore]         = useState(0);
  const [answered, setAnswered]   = useState(false);

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(QUIZ_QUESTIONS).slice(0, TOTAL));
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setPhase('playing');
  }, []);

  const handleOption = useCallback((idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].answer) setScore(s => s + 1);
  }, [answered, current, questions]);

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setPhase('results');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [current, questions.length]);

  const pct = Math.round((score / TOTAL) * 100);
  const resultMsg = pct >= 90 ? '🏆 Solar Genius!'
    : pct >= 70 ? '🚀 Space Explorer!'
    : pct >= 50 ? '🌍 Planet Student!'
    : '🌱 Keep Learning!';

  const letters = ['A','B','C','D'];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>🧠 Solar System Quiz</h2>

        {/* ── Start Screen ── */}
        {phase === 'start' && (
          <div className="quiz-start">
            <p>
              Test your Solar System knowledge!<br />
              {TOTAL} questions · Multiple choice · Instant feedback
            </p>
            <button className="btn-primary" onClick={startQuiz}>
              Start Quiz 🚀
            </button>
          </div>
        )}

        {/* ── Playing ── */}
        {phase === 'playing' && questions.length > 0 && (
          <>
            {/* Progress */}
            <div className="quiz-progress">
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-fill"
                  style={{ width: `${((current) / TOTAL) * 100}%` }}
                />
              </div>
              <span className="quiz-progress-text">{current + 1} / {TOTAL}</span>
            </div>

            {/* Question */}
            <p className="quiz-question">{questions[current].q}</p>

            {/* Options */}
            <div className="quiz-options">
              {questions[current].options.map((opt, idx) => {
                let cls = 'quiz-option';
                if (answered) {
                  if (idx === questions[current].answer) cls += ' correct';
                  else if (idx === selected)             cls += ' wrong';
                }
                return (
                  <button
                    key={idx}
                    className={cls}
                    onClick={() => handleOption(idx)}
                    disabled={answered}
                  >
                    <span className="option-letter">{letters[idx]}</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {answered && (
              <>
                <div className={`quiz-feedback ${selected === questions[current].answer ? 'correct-fb' : 'wrong-fb'}`}>
                  {selected === questions[current].answer
                    ? '✅ Correct! Well done!'
                    : `❌ The correct answer was: ${questions[current].options[questions[current].answer]}`}
                </div>
                <button className="btn-next" onClick={handleNext}>
                  {current + 1 >= TOTAL ? 'See Results 🏁' : 'Next Question →'}
                </button>
              </>
            )}
          </>
        )}

        {/* ── Results ── */}
        {phase === 'results' && (
          <div className="quiz-results">
            <div className="score-ring">
              <span className="score-number">{score}</span>
              <span className="score-total">/ {TOTAL}</span>
            </div>
            <p className="score-msg">{resultMsg}</p>
            <p className="score-sub">
              You got {score} out of {TOTAL} correct ({pct}%)
            </p>
            <div className="quiz-result-buttons">
              <button className="btn-primary" onClick={startQuiz}>Play Again 🔄</button>
              <button className="btn-secondary" onClick={onClose}>Back to Explorer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
