'use client';

import { Question } from '../types';

interface QuestionNavigatorProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: { [key: string]: string };
  flaggedQuestions: string[];
  handleNavigateQuestion: (index: number) => void;
  getAnsweredCount: () => number;
  handleReviewToggle: () => void;
  handleSubmitExam: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  isReviewMode?: boolean;
}

const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  flaggedQuestions,
  handleNavigateQuestion,
  getAnsweredCount,
  handleReviewToggle,
  handleSubmitExam,
  setCurrentQuestionIndex,
}) => {
  // Status badges for each question button
  const navigatorButtons = questions.map((q, index) => {
    let status = 'default';
    if (userAnswers[q.id]) status = 'answered';
    if (flaggedQuestions.includes(q.id)) status = 'flagged';
    if (userAnswers[q.id] && flaggedQuestions.includes(q.id)) status = 'answeredAndFlagged';

    return {
      index,
      id: q.id,
      status,
    };
  });

  return (
    <div className="w-72 flex flex-col gap-4">
      {/* Question Navigator */}
      <div className="bg-base-100 rounded-box p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">Question Navigator</h3>
          <div className="text-xs text-base-content/70">
            {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>Flagged</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span>Current</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto question-navigator-grid">
          {navigatorButtons.map((btn) => (
            <button
              key={btn.id}
              className={`btn btn-sm relative ${
                currentQuestionIndex === btn.index
                  ? 'btn-secondary ring-2 ring-secondary/50'
                  : btn.status === 'answered'
                    ? 'btn-success'
                    : btn.status === 'flagged'
                      ? 'btn-warning'
                      : btn.status === 'answeredAndFlagged'
                        ? 'btn-success border-2 border-warning'
                        : 'btn-outline hover:btn-primary'
              }`}
              onClick={() => handleNavigateQuestion(btn.index)}
              title={`Question ${btn.index + 1} - ${
                btn.status === 'answered'
                  ? 'Answered'
                  : btn.status === 'flagged'
                    ? 'Flagged for review'
                    : btn.status === 'answeredAndFlagged'
                      ? 'Answered & Flagged'
                      : 'Not answered'
              }`}
            >
              {btn.index + 1}
              {btn.status === 'flagged' || btn.status === 'answeredAndFlagged' ? (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full"></div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-box p-4 shadow-lg">
        <h3 className="font-bold mb-3">Quick Actions</h3>

        {/* Quick Jump Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            className="btn btn-outline btn-xs"
            onClick={() => {
              const unanswered = questions.findIndex((q) => !userAnswers[q.id]);
              if (unanswered !== -1) setCurrentQuestionIndex(unanswered);
            }}
            disabled={getAnsweredCount() === questions.length}
          >
            Next Unanswered
          </button>
          <button
            className="btn btn-outline btn-xs"
            onClick={() => {
              if (flaggedQuestions.length > 0) {
                const flaggedIndex = questions.findIndex((q) => q.id === flaggedQuestions[0]);
                if (flaggedIndex !== -1) setCurrentQuestionIndex(flaggedIndex);
              }
            }}
            disabled={flaggedQuestions.length === 0}
          >
            First Flagged
          </button>
        </div>

        <div className="space-y-2">
          <button className="btn btn-outline btn-block btn-sm" onClick={handleReviewToggle}>
            Review All Answers
          </button>
          <button className="btn btn-primary btn-block btn-sm" onClick={handleSubmitExam}>
            Submit Exam
          </button>
        </div>

        {/* Progress Summary */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Answered</span>
            <span className="font-medium">
              {getAnsweredCount()}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Flagged</span>
            <span className="font-medium">
              {flaggedQuestions.length}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5">
            <div
              className="bg-warning h-2.5 rounded-full"
              style={{ width: `${(flaggedQuestions.length / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
