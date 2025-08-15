'use client';

import { Question } from '../types';
import { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ReviewModalContent from './ReviewModalContent';
import ConfirmNavigation from '@/components/Common/ConfirmNavigation';
import { useExamContext } from '@/contexts/ExamContext';

interface ExamContainerProps {
  questions: Question[];
  examConfig: {
    type: string;
    content: string;
    timeInMinutes: number;
    questionsCount: number;
    level: string;
  };
  onSubmitExam: (answers: { [key: string]: string }) => void;
  onCancelExam: () => void;
  onBackToSetup?: () => void; // Add new prop for navigation back to setup
}

const ExamContainer: React.FC<ExamContainerProps> = ({
  questions,
  examConfig,
  onSubmitExam,
  onCancelExam,
  onBackToSetup,
}) => {
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(examConfig.timeInMinutes * 60);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];
  const { type, content } = examConfig;

  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  // Use the navigation blocker hook to prevent accidental navigation
  const clearSessionStorage = useCallback(() => {
    // Clean up when navigation is confirmed
    sessionStorage.removeItem('exam-type');
    sessionStorage.removeItem('exam-content');
    sessionStorage.removeItem('exam-questions');
    sessionStorage.removeItem('exam-time');
  }, []);

  // Get exam state from context
  const { examInProgress, startExam, endExam, setShouldBlockNavigation } = useExamContext();

  // Xử lý việc thoát bài kiểm tra
  const handleExitExam = useCallback(() => {
    setShowExitConfirm(true);
  }, []);

  // Set exam in progress when component mounts
  useEffect(() => {
    startExam();
    setShouldBlockNavigation(true);

    // Thêm event listener cho phím Escape để hiện dialog thoát
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleExitExam();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      endExam();
      setShouldBlockNavigation(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [startExam, endExam, setShouldBlockNavigation, handleExitExam]);

  // Submit handlers
  const handleSubmitExam = useCallback(() => {
    onSubmitExam(userAnswers);
  }, [userAnswers, onSubmitExam]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitExam]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation handlers
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleNavigateQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  // Answer handlers
  const handleAnswerChange = useCallback((questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleFlagQuestion = useCallback((questionId: string) => {
    setFlaggedQuestions((prev) => {
      if (prev.includes(questionId)) {
        return prev.filter((id) => id !== questionId);
      }
      return [...prev, questionId];
    });
  }, []);

  const getAnsweredCount = useCallback(() => {
    return Object.keys(userAnswers).length;
  }, [userAnswers]);

  const handleReviewToggle = useCallback(() => {
    setShowReviewModal(true);
  }, []);

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

  // Import necessary components
  const { default: QuestionDisplay } = require('./QuestionDisplay');
  const { default: QuestionNavigator } = require('./QuestionNavigator');
  const { default: MobileQuestionDisplay } = require('./MobileQuestionDisplay');

  return (
    <div className="flex flex-col h-full w-full">
      {/* Navigation blocker */}
      <ConfirmNavigation
        when={examInProgress}
        message="You have an exam in progress. If you leave this page, your progress may be lost. Are you sure you want to continue?"
      />

      {/* Top bar with timer and progress */}
      <div className="flex justify-between items-center p-2 bg-base-100 border-b border-base-200 mb-2 w-full">
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-ghost hover:bg-error hover:text-white"
            onClick={handleExitExam}
            title="Exit examination"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Exit
          </button>
          <div className="flex items-center">
            <div className="text-sm font-medium">Progress:</div>
            <div className="ml-2 text-sm">
              {getAnsweredCount()}/{questions.length} questions answered
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div
              className={`text-sm font-medium ${timeLeft < 60 ? 'text-error animate-pulse' : ''}`}
              title="Time remaining"
            >
              {formatTime(timeLeft)}
            </div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowSubmitConfirm(true)}>
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main content container - conditionally render based on view size */}
      {isMobileView ? (
        <MobileQuestionDisplay
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          userAnswers={userAnswers}
          flaggedQuestions={flaggedQuestions}
          handleAnswerChange={handleAnswerChange}
          handleFlagQuestion={handleFlagQuestion}
          handlePrevQuestion={handlePrevQuestion}
          handleNextQuestion={handleNextQuestion}
          handleReviewToggle={handleReviewToggle}
          setShowSubmitConfirm={setShowSubmitConfirm}
          type={type}
          content={content}
          getAnsweredCount={getAnsweredCount}
          handleNavigateQuestion={handleNavigateQuestion}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      ) : (
        <div className="flex flex-1 gap-3 px-3 w-full overflow-hidden">
          {/* Left side - Question navigator */}
          <div className="w-1/4 bg-base-100 p-4 rounded-box shadow-md">
            <QuestionNavigator
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              handleNavigateQuestion={handleNavigateQuestion}
              isReviewMode={isReviewMode}
              handleReviewToggle={handleReviewToggle}
              getAnsweredCount={getAnsweredCount}
              handleSubmitExam={() => setShowSubmitConfirm(true)}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
          </div>

          {/* Right side - Question display */}
          <div className="w-3/4 overflow-auto">
            <QuestionDisplay
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              questions={questions}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              handleAnswerChange={handleAnswerChange}
              handleFlagQuestion={handleFlagQuestion}
              handlePrevQuestion={handlePrevQuestion}
              handleNextQuestion={handleNextQuestion}
              handleReviewToggle={handleReviewToggle}
              setShowSubmitConfirm={setShowSubmitConfirm}
              type={type}
              content={content}
            />
          </div>
        </div>
      )}

      {/* Submit confirmation modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-base-100 p-6 rounded-box shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-2">Submit Exam</h3>
            <p className="py-2">
              You have answered {getAnsweredCount()} out of {questions.length} questions.
              {getAnsweredCount() < questions.length && (
                <span className="text-warning">
                  {' '}
                  There are {questions.length - getAnsweredCount()} unanswered questions.
                </span>
              )}
            </p>
            <p className="py-2">Are you sure you want to submit your exam?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-outline" onClick={() => setShowSubmitConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmitExam}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review questions modal */}
      {showReviewModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <ReviewModalContent
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onClose={() => setShowReviewModal(false)}
            onGoToQuestion={(index) => {
              setCurrentQuestionIndex(index);
              setShowReviewModal(false);
            }}
            onFlagToggle={handleFlagQuestion}
          />
        </div>
      )}

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-base-100 p-6 rounded-box shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-2">Exit Examination?</h3>
            <p className="py-2">
              <span className="text-warning font-medium">Warning:</span> If you exit now, your progress will not be
              saved.
            </p>
            <div className="flex flex-col md:flex-row justify-end gap-3 mt-6">
              <button className="btn btn-primary" onClick={() => setShowExitConfirm(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue Exam
              </button>
              <button className="btn btn-error" onClick={onCancelExam}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamContainer;
