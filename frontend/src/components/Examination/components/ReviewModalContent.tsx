'use client';
import React, { useState, useMemo, useCallback, memo } from 'react';
import { Question } from '../types';

// Individual review question item component - row style with status icons
const ReviewQuestionItem = memo(
  ({
    question,
    originalIndex,
    isAnswered,
    isFlagged,
    answer,
    onGoToQuestion,
    onFlagToggle,
  }: {
    question: Question;
    originalIndex: number;
    isAnswered: boolean;
    isFlagged: boolean;
    answer: string | undefined;
    onGoToQuestion: (index: number) => void;
    onFlagToggle: (id: string) => void;
  }) => {
    // Use callbacks for event handlers
    const handleGoToQuestion = useCallback(() => {
      onGoToQuestion(originalIndex);
    }, [onGoToQuestion, originalIndex]);

    const handleFlagToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onFlagToggle(question.id);
      },
      [onFlagToggle, question.id],
    );

    return (
      <div
        className="flex items-center justify-between py-1.5 px-3 my-0.5 rounded-md bg-base-200 border border-base-300 shadow-sm hover:bg-base-300 cursor-pointer transition-colors"
        onClick={handleGoToQuestion}
      >
        {/* Question number */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
            {originalIndex + 1}
          </div>

          {/* Question status label */}
          <div className="text-sm font-medium">Question {originalIndex + 1}</div>
        </div>

        {/* Status icons */}
        <div className="flex items-center gap-2">
          {/* Answered/Unanswered status */}
          {isAnswered ? (
            <div className="text-success tooltip tooltip-left" data-tip="Answered">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="text-error tooltip tooltip-left" data-tip="Not answered">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          {/* Flag icon if flagged */}
          {isFlagged && (
            <div className="text-warning tooltip tooltip-left" data-tip="Flagged for review" onClick={handleFlagToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
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
            </div>
          )}

          {/* Flag toggle button (small, always present) */}
          {!isFlagged && (
            <div
              className="text-base-content/30 hover:text-warning tooltip tooltip-left"
              data-tip="Flag for review"
              onClick={handleFlagToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
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
            </div>
          )}
        </div>
      </div>
    );
  },
  // Custom comparison to prevent unnecessary rerenders
  (prevProps, nextProps) => {
    return (
      prevProps.isAnswered === nextProps.isAnswered &&
      prevProps.isFlagged === nextProps.isFlagged &&
      prevProps.answer === nextProps.answer
    );
  },
);

// Add displayName
ReviewQuestionItem.displayName = 'ReviewQuestionItem';

interface ReviewModalContentProps {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  flaggedQuestions: string[];
  onClose: () => void;
  onGoToQuestion: (index: number) => void;
  onFlagToggle: (id: string) => void;
}

// Filter options for the review modal
type FilterOption = 'all' | 'answered' | 'unanswered' | 'flagged';

const ReviewModalContent: React.FC<ReviewModalContentProps> = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  flaggedQuestions,
  onClose,
  onGoToQuestion,
  onFlagToggle,
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');

  // Calculate stats for the review modal
  const stats = useMemo(() => {
    const total = questions.length;
    const answered = Object.keys(userAnswers).length;
    const unanswered = total - answered;
    const flagged = flaggedQuestions.length;

    return { total, answered, unanswered, flagged };
  }, [questions, userAnswers, flaggedQuestions]);

  // Filter questions based on the selected filter
  const filteredQuestions = useMemo(() => {
    return questions.filter((question, index) => {
      const isAnswered = Boolean(userAnswers[question.id]);
      const isFlagged = flaggedQuestions.includes(question.id);

      switch (filter) {
        case 'answered':
          return isAnswered;
        case 'unanswered':
          return !isAnswered;
        case 'flagged':
          return isFlagged;
        default:
          return true;
      }
    });
  }, [questions, userAnswers, flaggedQuestions, filter]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: FilterOption) => {
    setFilter(newFilter);
  }, []);

  return (
    <div className="modal-box max-w-none xl:w-[60vw] lg:w-[60vw] md:w-[65vw] sm:w-[70vw] w-[85vw] min-w-[600px] h-[80vh] p-6 bg-base-100 shadow-lg rounded-lg">
      <div className="flex flex-col h-full">
        {/* Header with title and filter options */}
        <div className="mb-4 border-b pb-3">
          <h3 className="font-bold text-2xl mb-2">Review Questions</h3>

          {/* Stats summary */}
          <div className="stats stats-sm shadow bg-base-200 w-full mb-3 border border-base-300">
            <div className="stat">
              <div className="stat-title font-medium">Total</div>
              <div className="stat-value text-lg">{stats.total}</div>
            </div>
            <div className="stat">
              <div className="stat-title font-medium">Answered</div>
              <div className="stat-value text-lg text-success">{stats.answered}</div>
            </div>
            <div className="stat">
              <div className="stat-title font-medium">Unanswered</div>
              <div className="stat-value text-lg text-error">{stats.unanswered}</div>
            </div>
            <div className="stat">
              <div className="stat-title font-medium">Flagged</div>
              <div className="stat-value text-lg text-warning">{stats.flagged}</div>
            </div>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleFilterChange('all')}
            >
              All ({stats.total})
            </button>
            <button
              className={`btn btn-sm ${filter === 'answered' ? 'btn-success' : 'btn-outline btn-success'}`}
              onClick={() => handleFilterChange('answered')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Answered ({stats.answered})
            </button>
            <button
              className={`btn btn-sm ${filter === 'unanswered' ? 'btn-error' : 'btn-outline btn-error'}`}
              onClick={() => handleFilterChange('unanswered')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Unanswered ({stats.unanswered})
            </button>
            <button
              className={`btn btn-sm ${filter === 'flagged' ? 'btn-warning' : 'btn-outline btn-warning'}`}
              onClick={() => handleFilterChange('flagged')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill={filter === 'flagged' ? 'currentColor' : 'none'}
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
              Flagged ({stats.flagged})
            </button>
          </div>
        </div>

        {/* Question list with enhanced overflow scrolling */}
        <div
          className="flex-1 overflow-y-auto pr-2 bg-base-100 rounded-lg p-2 border border-base-300 custom-scrollbar"
          style={{
            height: 'calc(80vh - 180px)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(100, 116, 139, 0.5) rgba(241, 245, 249, 0.1)',
          }}
        >
          {filteredQuestions.length > 0 ? (
            <div className="space-y-1">
              {filteredQuestions.map((question) => {
                const originalIndex = questions.findIndex((q) => q.id === question.id);
                const isAnswered = Boolean(userAnswers[question.id]);
                const isFlagged = flaggedQuestions.includes(question.id);

                return (
                  <ReviewQuestionItem
                    key={question.id}
                    question={question}
                    originalIndex={originalIndex}
                    isAnswered={isAnswered}
                    isFlagged={isFlagged}
                    answer={userAnswers[question.id]}
                    onGoToQuestion={onGoToQuestion}
                    onFlagToggle={onFlagToggle}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-base-content/50">No questions match the selected filter</p>
            </div>
          )}
        </div>

        {/* Footer with close button */}
        <div className="mt-auto pt-3 border-t flex justify-between items-center text-sm">
          <div className="text-base-content/70">Click on any question to navigate directly to it</div>
          <button className="btn btn-sm btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModalContent;
