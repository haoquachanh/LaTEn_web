'use client';

import { Question } from '../types';

interface MobileQuestionDisplayProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  questions: Question[];
  userAnswers: { [key: string]: string };
  flaggedQuestions: string[];
  handleAnswerChange: (questionId: string, answer: string) => void;
  handleFlagQuestion: (questionId: string) => void;
  handlePrevQuestion: () => void;
  handleNextQuestion: () => void;
  handleReviewToggle: () => void;
  setShowSubmitConfirm: (show: boolean) => void;
  type: string;
  content: string;
  getAnsweredCount: () => number;
  handleNavigateQuestion: (index: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
}

const MobileQuestionDisplay: React.FC<MobileQuestionDisplayProps> = ({
  currentQuestion,
  currentQuestionIndex,
  questions,
  userAnswers,
  flaggedQuestions,
  handleAnswerChange,
  handleFlagQuestion,
  handlePrevQuestion,
  handleNextQuestion,
  handleReviewToggle,
  setShowSubmitConfirm,
  type,
  content,
  getAnsweredCount,
  handleNavigateQuestion,
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
    <>
      {/* Question Content */}
      <div className="flex-1 bg-base-100 rounded-box p-3 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <h2 className="font-bold text-sm">
              Q{currentQuestionIndex + 1}/{questions.length}
            </h2>
            {/* Flag icon button */}
            <button
              onClick={() => handleFlagQuestion(currentQuestion?.id)}
              className={`flex items-center justify-center h-5 w-5 rounded-full ${
                flaggedQuestions.includes(currentQuestion?.id)
                  ? 'bg-warning text-warning-content'
                  : 'bg-base-200 text-base-content/70 hover:bg-base-300'
              } transition-colors duration-200`}
              title={flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag question' : 'Flag question for review'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill={flaggedQuestions.includes(currentQuestion?.id) ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-1">
            <div className="badge badge-xs badge-neutral text-xs">{type}</div>
            <div className="badge badge-xs badge-accent text-xs">{content}</div>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-3">
          <p className="text-sm font-medium leading-relaxed">{currentQuestion?.question}</p>
        </div>

        {/* Answer Options */}
        <div className="space-y-2">
          {currentQuestion?.answers?.map((answer, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg cursor-pointer transition-all duration-300 ${
                userAnswers[currentQuestion.id] === answer
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => handleAnswerChange(currentQuestion.id, answer)}
            >
              <div className="flex items-center">
                <div className="w-4 h-4 flex items-center justify-center rounded-full mr-2 text-xs border border-current flex-shrink-0">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-xs leading-relaxed">{answer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls for Mobile */}
      <div className="grid grid-cols-4 gap-1.5 mt-2 px-1">
        <button
          className="btn btn-xs btn-outline text-xs h-8"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          ← Prev
        </button>
        <button
          className="btn btn-xs btn-outline text-xs h-8"
          onClick={() => {
            const unanswered = questions.findIndex((q) => !userAnswers[q.id]);
            if (unanswered !== -1) setCurrentQuestionIndex(unanswered);
          }}
          disabled={getAnsweredCount() === questions.length}
        >
          Skip
        </button>
        <button className="btn btn-xs btn-outline text-xs h-8" onClick={handleReviewToggle}>
          Review
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button className="btn btn-xs btn-primary text-xs h-8" onClick={() => setShowSubmitConfirm(true)}>
            Submit
          </button>
        ) : (
          <button className="btn btn-xs btn-primary text-xs h-8" onClick={handleNextQuestion}>
            Next →
          </button>
        )}
      </div>

      {/* Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-base-100 p-1.5 flex justify-between items-center shadow-lg border-t border-base-200 z-10">
        <div className="flex space-x-1 items-center">
          <button className="btn btn-xs btn-outline text-xs h-7" onClick={handleReviewToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Review
          </button>
          <span className="badge badge-xs self-center text-xs">
            {getAnsweredCount()}/{questions.length}
          </span>
        </div>

        {/* Question Navigator - Mobile (horizontal scroll) */}
        <div className="flex-1 flex flex-col items-center">
          <div className="text-xs text-base-content/70 mb-1">
            {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar pb-1 max-w-full">
            {navigatorButtons.map((btn) => (
              <button
                key={btn.id}
                className={`btn btn-xs relative flex-shrink-0 ${
                  currentQuestionIndex === btn.index
                    ? 'btn-secondary ring-1 ring-secondary/50'
                    : btn.status === 'answered'
                      ? 'btn-success'
                      : btn.status === 'flagged'
                        ? 'btn-warning'
                        : btn.status === 'answeredAndFlagged'
                          ? 'btn-success border border-warning'
                          : 'btn-outline'
                } w-6 h-6 min-h-0 text-xs p-0`}
                onClick={() => handleNavigateQuestion(btn.index)}
              >
                {btn.index + 1}
                {(btn.status === 'flagged' || btn.status === 'answeredAndFlagged') && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-warning rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-xs btn-primary text-xs h-7" onClick={() => setShowSubmitConfirm(true)}>
          Submit
        </button>
      </div>
    </>
  );
};

export default MobileQuestionDisplay;
