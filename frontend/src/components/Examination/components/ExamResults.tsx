'use client';

import { Question } from '../types';
import Link from 'next/link';

interface ExamResultsProps {
  results: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedAnswers: number;
    timeSpent: number;
  };
  questions: Question[];
  userAnswers: { [key: string]: string };
  onRestartExam: () => void;
}

const ExamResults: React.FC<ExamResultsProps> = ({ results, questions, userAnswers, onRestartExam }) => {
  // Format time spent
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} minutes and ${secs} seconds`;
  };

  // Get score color and message
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent job!';
    if (score >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Results Summary Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold mb-4">Exam Results</h2>

          {/* Score Display */}
          <div className="flex flex-col items-center mb-6">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor(results.score)}`}>{results.score}%</div>
            <div className="text-lg">{getScoreMessage(results.score)}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Total Questions</div>
              <div className="stat-value">{results.totalQuestions}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Correct</div>
              <div className="stat-value text-success">{results.correctAnswers}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Incorrect</div>
              <div className="stat-value text-error">{results.incorrectAnswers}</div>
            </div>
            <div className="stat bg-base-200 rounded-box p-4">
              <div className="stat-title">Skipped</div>
              <div className="stat-value text-warning">{results.skippedAnswers}</div>
            </div>
          </div>

          <div className="text-lg mb-4">
            Time spent: <span className="font-medium">{formatTime(results.timeSpent)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end mt-4">
            <button className="btn btn-primary" onClick={onRestartExam}>
              Take Another Exam
            </button>
            <Link href="/dashboard" className="btn btn-outline">
              Back to Dashboard
            </Link>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Results
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title font-bold mb-4">Question Review</h3>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id] || 'Not answered';
              const isCorrect = userAnswer === question.correctAnswer;
              const isSkipped = !userAnswers[question.id];

              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isSkipped
                      ? 'border-warning bg-warning/10'
                      : isCorrect
                        ? 'border-success bg-success/10'
                        : 'border-error bg-error/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <div
                      className={`badge ${isSkipped ? 'badge-warning' : isCorrect ? 'badge-success' : 'badge-error'}`}
                    >
                      {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>

                  <p className="mb-4">{question.question}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-sm font-medium mb-1">Your Answer:</div>
                      <div className={`p-2 rounded bg-base-200 ${isSkipped ? 'italic text-base-content/70' : ''}`}>
                        {userAnswer}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Correct Answer:</div>
                      <div className="p-2 rounded bg-success/20">{question.correctAnswer}</div>
                    </div>
                  </div>

                  {/* Explanation would go here if added to the Question type */}
                  <div className="mt-3 p-3 bg-base-200 rounded">
                    <div className="text-sm font-medium mb-1">Explanation:</div>
                    <p className="text-sm">
                      {isCorrect ? "That's the correct answer!" : `The correct answer is ${question.correctAnswer}.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
