'use client';
import React, { useContext, useEffect, useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { ExaminationContext } from '@/contexts/ExaminationContext';

// Import components lazily to avoid loading them until needed
const ReviewModalContent = lazy(() => import('./ReviewModalContent'));
const SubmitConfirmModal = lazy(() => import('./SubmitConfirmModal'));

export type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
};

export default function ExaminationContent() {
  const [start, setStart] = useState(false);
  const [type, setType] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { page, numberOfQuestions, changePage, init, time, changeTime } = useContext(ExaminationContext);

  const questions = useMemo(
    () => [
      {
        question: 'Which of the following is the correct form of the present perfect tense?',
        answers: ['I have went', 'I have gone', 'I had gone', 'I will have gone'],
        correctAnswer: 'I have gone',
        id: '1',
      },
      {
        question: 'What is the opposite of "difficult"?',
        answers: ['Hard', 'Easy', 'Complex', 'Tough'],
        correctAnswer: 'Easy',
        id: '2',
      },
      {
        question: 'Which word is a synonym for "happy"?',
        answers: ['Sad', 'Angry', 'Joyful', 'Tired'],
        correctAnswer: 'Joyful',
        id: '3',
      },
      {
        question: 'Choose the correct article: "___ university"',
        answers: ['A', 'An', 'The', 'No article'],
        correctAnswer: 'A',
        id: '4',
      },
      {
        question: 'What does "procrastinate" mean?',
        answers: ['To do immediately', 'To delay', 'To organize', 'To complete'],
        correctAnswer: 'To delay',
        id: '5',
      },
    ],
    [],
  );

  const examTypes = [
    { id: 'multiple', label: 'Multiple Choice', icon: '📝', description: 'Choose from multiple options' },
    { id: 'truefalse', label: 'True or False', icon: '✓✗', description: 'Simple true/false questions' },
    { id: 'short', label: 'Short Answer', icon: '📄', description: 'Brief written responses' },
    { id: 'essay', label: 'Essay', icon: '📋', description: 'Detailed written answers' },
  ];

  const subjects = [
    { id: 'grammar', label: 'Grammar', icon: '📚', color: 'primary' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📖', color: 'secondary' },
    { id: 'reading', label: 'Reading', icon: '👁️', color: 'accent' },
    { id: 'listening', label: 'Listening', icon: '👂', color: 'info' },
  ];

  const handleStartExam = () => {
    if (!type || !content) return;
    setIsLoading(true);
    setTimeout(() => {
      setStart(true);
      init(time);
      setIsLoading(false);
    }, 1000);
  };

  const handleEndExam = () => {
    setStart(false);
    setShowReview(false);
    setShowSubmitConfirm(false);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    );
  };

  const handleReviewToggle = () => {
    setShowReview(!showReview);
  };

  const handleSubmitExam = () => {
    setShowSubmitConfirm(true);
  };

  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      handleEndExam();
      // Navigate to results
    }, 1500);
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const getUnansweredQuestions = () => {
    return questions
      .filter((q) => !userAnswers[q.id])
      .map((q) => ({ id: q.id, index: questions.findIndex((question) => question.id === q.id) }));
  };

  const handleNavigateQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const navigatorButtons = useMemo(() => {
    return questions.map((q, index) => {
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
  }, [questions, userAnswers, flaggedQuestions]);

  return (
    <div>
      {!start ? (
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-8">Examination Center</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - Exam Setup (Left/Center) */}
            <div className="w-full lg:w-2/3 space-y-6">
              <div className="bg-base-100 rounded-box p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Exam Setup</h2>

                {/* Exam Type Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select Exam Type</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {examTypes.map((examType) => (
                      <div
                        key={examType.id}
                        className={`flex flex-col items-center p-5 rounded-lg cursor-pointer transition-all duration-300 ${
                          type === examType.id
                            ? 'bg-primary text-primary-content shadow-lg scale-105'
                            : 'bg-base-200 hover:bg-base-300'
                        }`}
                        onClick={() => setType(examType.id)}
                      >
                        <div className="text-3xl mb-2">{examType.icon}</div>
                        <div className="font-medium text-center">{examType.label}</div>
                        <p className="text-xs text-center mt-2 opacity-80">{examType.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select Subject</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                          content === subject.id
                            ? `bg-${subject.color} text-${subject.color}-content shadow-lg`
                            : 'bg-base-200 hover:bg-base-300'
                        }`}
                        onClick={() => setContent(subject.id)}
                      >
                        <div className="text-2xl mr-3">{subject.icon}</div>
                        <div className="font-medium text-lg">{subject.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions & Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Number of Questions */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Number of Questions</h3>
                    <div className="flex gap-2">
                      {[10, 20, 30, 40].map((num) => (
                        <button
                          key={num}
                          className={`flex-1 btn ${numberOfQuestions === num ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => changePage(num)}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Time Limit</h3>
                    <div className="flex gap-2">
                      {[15, 30, 45, 60].map((minutes) => (
                        <button
                          key={minutes}
                          className={`flex-1 btn ${time === minutes ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => changeTime(minutes)}
                        >
                          {minutes} min
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={handleStartExam}
                  disabled={!type || !content || isLoading}
                >
                  {isLoading ? <span className="loading loading-spinner"></span> : 'Start Exam'}
                </button>
              </div>
            </div>

            {/* Sidebar Content (Right) */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Achievement/Progress Section */}
              <div className="bg-base-100 rounded-box p-4 shadow-lg">
                <h2 className="text-lg font-bold mb-3">Your Progress</h2>
                <div className="stats stats-vertical shadow w-full">
                  <div className="stat py-2">
                    <div className="stat-figure text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-6 h-6 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                      </svg>
                    </div>
                    <div className="stat-title text-sm">Completed Exams</div>
                    <div className="stat-value text-primary text-2xl">25</div>
                    <div className="stat-desc text-xs">12% more than last month</div>
                  </div>

                  <div className="stat py-2">
                    <div className="stat-figure text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block w-6 h-6 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                    </div>
                    <div className="stat-title text-sm">Average Score</div>
                    <div className="stat-value text-secondary text-2xl">85%</div>
                    <div className="stat-desc text-xs">5% improvement</div>
                  </div>
                </div>
              </div>

              {/* Recommended Exams */}
              <div className="bg-base-100 rounded-box p-4 shadow-lg">
                <h2 className="text-lg font-bold mb-3">Recommended</h2>
                <div className="space-y-3">
                  <div className="card bg-base-200">
                    <div className="card-body p-3">
                      <h3 className="card-title text-sm">Advanced Grammar</h3>
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className="badge badge-primary badge-xs">Grammar</span>
                        <span className="badge badge-outline badge-xs">45 min</span>
                      </div>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary btn-xs">Start</button>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body p-3">
                      <h3 className="card-title text-sm">Vocabulary Builder</h3>
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className="badge badge-secondary badge-xs">Vocabulary</span>
                        <span className="badge badge-outline badge-xs">30 min</span>
                      </div>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary btn-xs">Start</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-base-100 rounded-box p-4 shadow-lg">
                <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
                <div className="overflow-x-auto">
                  <table className="table table-xs table-zebra">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      <tr>
                        <td>Reading</td>
                        <td>92%</td>
                      </tr>
                      <tr>
                        <td>TOEFL</td>
                        <td>78%</td>
                      </tr>
                      <tr>
                        <td>Grammar</td>
                        <td>65%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto p-2 max-w-screen-lg">
          {/* Desktop View - Full Height Question Display with Right Sidebar */}
          <div className="hidden lg:flex flex-col h-[calc(100vh-5rem)]">
            <div className="flex-1 flex gap-4">
              {/* Left Side: Question Display */}
              <div className="flex-1 bg-base-100 rounded-box p-6 shadow-lg flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-neutral">{examTypes.find((t) => t.id === type)?.label || 'Exam'}</div>
                    <div className={`badge badge-${subjects.find((s) => s.id === content)?.color || 'neutral'}`}>
                      {subjects.find((s) => s.id === content)?.label || 'Subject'}
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {/* Question Content */}
                  <div className="mb-6">
                    <p className="text-xl font-medium">{currentQuestion?.question}</p>
                  </div>

                  {/* Answer Options */}
                  <div className="flex-1">
                    <div className="space-y-3">
                      {currentQuestion?.answers?.map((answer, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                            userAnswers[currentQuestion.id] === answer
                              ? 'bg-primary text-primary-content'
                              : 'bg-base-200 hover:bg-base-300'
                          }`}
                          onClick={() => handleAnswerChange(currentQuestion.id, answer)}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border border-current">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span>{answer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <button
                      className="btn btn-outline"
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous
                    </button>

                    <button
                      className={`btn ${flaggedQuestions.includes(currentQuestion?.id) ? 'btn-warning' : 'btn-outline'}`}
                      onClick={() => handleFlagQuestion(currentQuestion?.id)}
                    >
                      {flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag' : 'Flag'} Question
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                      <button className="btn btn-primary" onClick={handleReviewToggle}>
                        Review Answers
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={handleNextQuestion}>
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Question Navigator & Quick Actions */}
              <div className="w-72 flex flex-col gap-4">
                {/* Question Navigator */}
                <div className="bg-base-100 rounded-box p-4 shadow-lg">
                  <h3 className="font-bold mb-3">Question Navigator</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {navigatorButtons.map((btn) => (
                      <button
                        key={btn.id}
                        className={`btn btn-sm ${
                          currentQuestionIndex === btn.index
                            ? 'btn-secondary'
                            : btn.status === 'answered'
                              ? 'btn-success'
                              : btn.status === 'flagged'
                                ? 'btn-warning'
                                : btn.status === 'answeredAndFlagged'
                                  ? 'btn-warning border border-success'
                                  : 'btn-outline'
                        }`}
                        onClick={() => handleNavigateQuestion(btn.index)}
                      >
                        {btn.index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-base-100 rounded-box p-4 shadow-lg">
                  <h3 className="font-bold mb-3">Quick Actions</h3>
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
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Question Content */}
            <div className="flex-1 bg-base-100 rounded-box p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base">
                  Q{currentQuestionIndex + 1}/{questions.length}
                </h2>
                <div className="flex gap-1">
                  <div className="badge badge-xs badge-neutral">
                    {examTypes.find((t) => t.id === type)?.label || 'Exam'}
                  </div>
                  <div className={`badge badge-xs badge-${subjects.find((s) => s.id === content)?.color || 'neutral'}`}>
                    {subjects.find((s) => s.id === content)?.label || 'Subject'}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-4">
                <p className="text-base font-medium">{currentQuestion?.question}</p>
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                {currentQuestion?.answers?.map((answer, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      userAnswers[currentQuestion.id] === answer
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-200 hover:bg-base-300'
                    }`}
                    onClick={() => handleAnswerChange(currentQuestion.id, answer)}
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 flex items-center justify-center rounded-full mr-2 text-xs border border-current">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm">{answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls for Mobile */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                className={`btn btn-sm ${flaggedQuestions.includes(currentQuestion?.id) ? 'btn-warning' : 'btn-outline'}`}
                onClick={() => handleFlagQuestion(currentQuestion?.id)}
              >
                {flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag' : 'Flag'}
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button className="btn btn-sm btn-primary" onClick={handleReviewToggle}>
                  Review
                </button>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={handleNextQuestion}>
                  Next
                </button>
              )}
            </div>

            {/* Bottom Bar for Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-base-100 p-2 flex justify-between items-center shadow-lg border-t border-base-200 z-10">
              <div className="flex space-x-1">
                <button className="btn btn-sm" onClick={handleReviewToggle}>
                  Review
                </button>
                <span className="badge badge-sm self-center">
                  {getAnsweredCount()}/{questions.length}
                </span>
              </div>

              {/* Question Navigator - Mobile (horizontal scroll) */}
              <div className="flex space-x-1 overflow-x-auto hide-scrollbar pb-1 max-w-[50%]">
                {navigatorButtons.map((btn) => (
                  <button
                    key={btn.id}
                    className={`btn btn-xs w-6 h-6 min-h-0 ${
                      currentQuestionIndex === btn.index
                        ? 'btn-secondary'
                        : btn.status === 'answered'
                          ? 'btn-success'
                          : btn.status === 'flagged'
                            ? 'btn-warning'
                            : btn.status === 'answeredAndFlagged'
                              ? 'btn-warning border border-success'
                              : 'btn-outline'
                    }`}
                    onClick={() => handleNavigateQuestion(btn.index)}
                  >
                    {btn.index + 1}
                  </button>
                ))}
              </div>

              <button className="btn btn-sm btn-primary" onClick={handleSubmitExam}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showReview || showSubmitConfirm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Suspense fallback={<div className="loading loading-spinner text-primary"></div>}>
            {showReview && (
              <ReviewModalContent
                questions={questions}
                userAnswers={userAnswers}
                flaggedQuestions={flaggedQuestions}
                onGoToQuestion={(index) => {
                  setCurrentQuestionIndex(index);
                  setShowReview(false);
                }}
                onClose={() => setShowReview(false)}
                onSubmit={handleSubmitExam}
                onFlagToggle={handleFlagQuestion}
                getAnsweredCount={getAnsweredCount}
              />
            )}

            {showSubmitConfirm && (
              <SubmitConfirmModal
                getAnsweredCount={getAnsweredCount}
                questionsCount={questions.length}
                unansweredQuestions={getUnansweredQuestions()}
                onCancel={() => setShowSubmitConfirm(false)}
                onConfirm={handleConfirmSubmit}
                onReview={() => {
                  setShowSubmitConfirm(false);
                  setShowReview(true);
                }}
                isSubmitting={isSubmitting}
              />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
}
