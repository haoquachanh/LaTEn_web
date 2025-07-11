'use client';
import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';

export type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
};

// Individual review question item component
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

    const handleFlagToggle = useCallback(() => {
      onFlagToggle(question.id);
    }, [onFlagToggle, question.id]);

    // Pre-render status badges for performance
    const statusBadge = useMemo(() => {
      if (isAnswered) {
        return <span className="badge badge-success badge-sm">Answered: {answer}</span>;
      }
      return <span className="badge badge-error badge-sm">Not answered</span>;
    }, [isAnswered, answer]);

    // Only render when necessary
    return (
      <div className="bg-base-200 rounded-lg hover:bg-base-300 transition-colors p-2 mb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary badge-md flex-shrink-0 w-8 h-8 text-lg flex items-center justify-center">
              {originalIndex + 1}
            </span>
            <p className="font-medium">{question.question}</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              {statusBadge}
              {isFlagged && <span className="badge badge-warning badge-sm">Flagged</span>}
            </div>

            <div className="flex gap-1">
              <button className="btn btn-sm btn-outline" onClick={handleGoToQuestion}>
                Go to
              </button>
              <button className="btn btn-sm btn-outline btn-warning" onClick={handleFlagToggle}>
                {isFlagged ? 'Unflag' : 'Flag'}
              </button>
            </div>
          </div>
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

ReviewQuestionItem.displayName = 'ReviewQuestionItem';

// Filter button component
const FilterButton = memo(
  ({
    active,
    type,
    count,
    onClick,
    variant,
  }: {
    active: boolean;
    type: string;
    count: number;
    onClick: () => void;
    variant: string;
  }) => (
    <button className={`btn btn-xs ${active ? `btn-${variant}` : 'btn-outline'} flex-1`} onClick={onClick}>
      {type} ({count})
    </button>
  ),
);

FilterButton.displayName = 'FilterButton';

// Main Review Modal Content Component
export interface ReviewModalContentProps {
  questions: Question[];
  userAnswers: { [key: string]: string };
  flaggedQuestions: string[];
  onClose: () => void;
  onSubmit: () => void;
  onGoToQuestion: (index: number) => void;
  onFlagToggle: (id: string) => void;
  getAnsweredCount: () => number;
}

function ReviewModalContent({
  questions,
  userAnswers,
  flaggedQuestions,
  onClose,
  onSubmit,
  onGoToQuestion,
  onFlagToggle,
  getAnsweredCount,
}: ReviewModalContentProps) {
  // Local state
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [renderedQuestions, setRenderedQuestions] = useState<Question[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Constants
  const itemsToShow = 10; // Reduced for better performance
  const itemHeight = 80; // Height of each question item in pixels

  // Memoized filtered questions
  const filteredQuestions = useMemo(() => {
    switch (activeFilter) {
      case 'answered':
        return questions.filter((q) => userAnswers[q.id]);
      case 'unanswered':
        return questions.filter((q) => !userAnswers[q.id]);
      case 'flagged':
        return questions.filter((q) => flaggedQuestions.includes(q.id));
      default:
        return questions;
    }
  }, [activeFilter, questions, userAnswers, flaggedQuestions]);

  // Handle scroll to update visible questions
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollTop = scrollRef.current.scrollTop;
      const newStartIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
      setVisibleStartIndex(newStartIndex);
    }
  }, [itemHeight]);

  // Update rendered questions whenever filtering changes or scroll position updates
  useEffect(() => {
    const startIdx = visibleStartIndex;
    const endIdx = Math.min(startIdx + itemsToShow, filteredQuestions.length);
    setRenderedQuestions(filteredQuestions.slice(startIdx, endIdx));
  }, [filteredQuestions, visibleStartIndex, itemsToShow]);

  // Attach scroll handler
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Calculate counts for filters
  const answeredCount = useMemo(() => Object.keys(userAnswers).length, [userAnswers]);
  const unansweredCount = useMemo(() => questions.length - answeredCount, [questions, answeredCount]);
  const flaggedCount = useMemo(() => flaggedQuestions.length, [flaggedQuestions]);

  // Set active filter
  const setFilter = useCallback((filter: string) => {
    setVisibleStartIndex(0);
    setActiveFilter(filter);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Calculate spacer heights for virtual scrolling
  const topSpacerHeight = visibleStartIndex * itemHeight;
  const bottomSpacerHeight = Math.max(0, (filteredQuestions.length - visibleStartIndex - itemsToShow) * itemHeight);

  return (
    <div className="modal modal-open">
      <div
        className="modal-box w-11/12 max-w-4xl h-5/6 max-h-[600px] animate-none"
        style={{ transform: 'none', transition: 'none' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">Review Answers</h3>
            <div className="flex gap-2">
              <div className="badge badge-neutral">
                {answeredCount} / {questions.length} answered
              </div>
              {unansweredCount > 0 && <div className="badge badge-error">{unansweredCount} unanswered</div>}
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <FilterButton
              active={activeFilter === 'all'}
              type="All"
              count={questions.length}
              onClick={() => setFilter('all')}
              variant="neutral"
            />
            <FilterButton
              active={activeFilter === 'answered'}
              type="Answered"
              count={answeredCount}
              onClick={() => setFilter('answered')}
              variant="success"
            />
            <FilterButton
              active={activeFilter === 'unanswered'}
              type="Unanswered"
              count={unansweredCount}
              onClick={() => setFilter('unanswered')}
              variant="error"
            />
            <FilterButton
              active={activeFilter === 'flagged'}
              type="Flagged"
              count={flaggedCount}
              onClick={() => setFilter('flagged')}
              variant="warning"
            />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 -mr-2" style={{ overscrollBehavior: 'contain' }}>
            {filteredQuestions.length === 0 ? (
              <div className="flex justify-center items-center h-full text-base-content/70">
                No questions match this filter
              </div>
            ) : (
              <>
                {/* Top spacer */}
                {topSpacerHeight > 0 && <div style={{ height: topSpacerHeight }}></div>}

                {/* Visible questions */}
                {renderedQuestions.map((question) => {
                  const originalIndex = questions.findIndex((q) => q.id === question.id);
                  const isAnswered = !!userAnswers[question.id];
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

                {/* Bottom spacer */}
                {bottomSpacerHeight > 0 && <div style={{ height: bottomSpacerHeight }}></div>}
              </>
            )}
          </div>

          <div className="flex justify-between mt-4 pt-2 border-t border-base-300">
            <button className="btn btn-outline" onClick={onClose}>
              Back to Exam
            </button>

            <button className="btn btn-primary" onClick={onSubmit}>
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModalContent;
