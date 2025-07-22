'use client';
import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useExamination } from '@/hooks/useExamination';
import { evaluateScore } from '@/utils/testEvaluation';
import Image from 'next/image';

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

  // Use the modern examination context
  const { currentPage: page, totalTime: examDuration, goToPage: changePage, resetExamination: init } = useExamination();

  // Local state for exam setup
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [time, setTime] = useState(15);
  const changeTime = setTime;

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
      {
        question: 'Which sentence is grammatically correct?',
        answers: [
          "She don't like coffee.",
          "She doesn't likes coffee.",
          "She doesn't like coffee.",
          'She not like coffee.',
        ],
        correctAnswer: "She doesn't like coffee.",
        id: '6',
      },
      {
        question: 'What is the past tense of "go"?',
        answers: ['Goed', 'Gone', 'Went', 'Going'],
        correctAnswer: 'Went',
        id: '7',
      },
      {
        question: 'Choose the correct comparative form of "good"',
        answers: ['Gooder', 'More good', 'Better', 'Best'],
        correctAnswer: 'Better',
        id: '8',
      },
      {
        question: 'Which word is NOT a preposition?',
        answers: ['On', 'Under', 'Before', 'Running'],
        correctAnswer: 'Running',
        id: '9',
      },
      {
        question: 'What is the plural form of "child"?',
        answers: ['Childs', 'Childes', 'Children', 'Childern'],
        correctAnswer: 'Children',
        id: '10',
      },
      {
        question: 'Choose the correct spelling',
        answers: ['Recieve', 'Receive', 'Receeve', 'Receve'],
        correctAnswer: 'Receive',
        id: '11',
      },
      {
        question: 'Which word is a countable noun?',
        answers: ['Water', 'Bread', 'Rice', 'Book'],
        correctAnswer: 'Book',
        id: '12',
      },
      {
        question: 'What is the meaning of "ubiquitous"?',
        answers: ['Found everywhere', 'Very rare', 'Extremely large', 'Completely transparent'],
        correctAnswer: 'Found everywhere',
        id: '13',
      },
      {
        question: 'The idiom "piece of cake" means:',
        answers: ['Something delicious', 'Something very easy', 'Something incomplete', 'Something sweet'],
        correctAnswer: 'Something very easy',
        id: '14',
      },
      {
        question: 'Complete the sentence: "If I _____ rich, I would buy a mansion."',
        answers: ['am', 'was', 'were', 'had been'],
        correctAnswer: 'were',
        id: '15',
      },
      {
        question: 'Which of these is NOT a phrasal verb?',
        answers: ['Look up', 'Turn down', 'Give away', 'Beautiful'],
        correctAnswer: 'Beautiful',
        id: '16',
      },
      {
        question: 'What does the prefix "un-" typically indicate?',
        answers: ['Repetition', 'Negation', 'Greatness', 'Together'],
        correctAnswer: 'Negation',
        id: '17',
      },
      {
        question: 'Choose the sentence with correct punctuation:',
        answers: ['Where are you going?', 'Where are you going.', 'Where, are you going?', 'Where are you going!'],
        correctAnswer: 'Where are you going?',
        id: '18',
      },
      {
        question: 'What is the correct order of adjectives in English?',
        answers: [
          'Opinion, size, age, shape, color, origin, material, purpose',
          'Size, color, age, shape, origin, material, purpose, opinion',
          'Purpose, material, origin, shape, age, size, color, opinion',
          'Opinion, purpose, material, origin, age, shape, size, color',
        ],
        correctAnswer: 'Opinion, size, age, shape, color, origin, material, purpose',
        id: '19',
      },
      {
        question: 'Which of the following is a subordinating conjunction?',
        answers: ['And', 'But', 'Or', 'Although'],
        correctAnswer: 'Although',
        id: '20',
      },
    ],
    [],
  );

  const examTypes = [
    {
      id: 'multiple',
      label: 'Multiple Choice',
      icon: '/icons/testing.png',
      description: 'Choose from multiple options',
    },
    {
      id: 'truefalse',
      label: 'True or False',
      icon: '/icons/true-or-false.png',
      description: 'Simple true/false questions',
    },
    { id: 'short', label: 'Short Answer', icon: '/icons/form.png', description: 'Brief written responses' },
    // { id: 'essay', label: 'Essay', icon: '/icons/essay.png', description: 'Detailed written answers' },
  ];

  const subjects = [
    { id: 'reading', label: 'Reading', color: 'accent' },
    { id: 'listening', label: 'Listening', color: 'accent' },
  ];

  const handleStartExam = () => {
    if (!type || !content) return;
    setIsLoading(true);
    setTimeout(() => {
      setStart(true);
      init(); // Reset the examination state
      setTime(time); // Set our local time state
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
                  <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
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
                        <div className="font-medium text-center">{examType.label}</div>
                        {/* <div className="text-3xl mb-2">{examType.icon}</div> */}
                        <p className="text-xs text-center my-2 opacity-80">{examType.description}</p>
                        <Image src={examType.icon} alt="" width={40} height={40} />
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
                        <div className="font-medium text-lg">{subject.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions & Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Number of Questions */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Number of Questions</h3>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="input input-bordered rounded-none w-full"
                      value={numberOfQuestions}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(questions.length, Number(e.target.value)));
                        setNumberOfQuestions(val);
                        changePage(val);
                      }}
                      placeholder="Enter number of questions"
                    />
                    <div className="flex gap-2 my-2">
                      {[10, 20, 30, 40].map((num) => (
                        <button
                          key={num}
                          className={`flex-1 btn ${numberOfQuestions === num ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => {
                            setNumberOfQuestions(num);
                            changePage(num);
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Time Limit (minutes)</h3>
                    <div className="flex gap-2 mb-2">
                      {[15, 30, 45, 60].map((minutes) => (
                        <button
                          key={minutes}
                          className={`flex-1 btn ${time === minutes ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setTime(minutes)}
                        >
                          {minutes} min
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      className="input input-bordered w-full"
                      value={time}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(180, Number(e.target.value)));
                        setTime(val);
                      }}
                      placeholder="Enter time in minutes"
                    />
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
                    <div className="stat-value text-primary text-2xl">{/* Will be populated from API */}</div>
                    <div className="stat-desc text-xs">{/* Comparison will come from API */}</div>
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
                    <div className="stat-value text-secondary text-2xl">{/* Will be populated from API */}</div>
                    <div className="stat-desc text-xs">{/* Comparison will come from API */}</div>
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
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg">
                      Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                    </h2>
                    {/* Flag icon button */}
                    <button
                      onClick={() => handleFlagQuestion(currentQuestion?.id)}
                      className={`flex items-center justify-center h-8 w-8 rounded-full ${
                        flaggedQuestions.includes(currentQuestion?.id)
                          ? 'bg-warning text-warning-content'
                          : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                      } transition-colors duration-200`}
                      title={
                        flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag question' : 'Flag question for review'
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden flex flex-col min-h-[calc(100vh-4rem)]">
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
                    title={
                      flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag question' : 'Flag question for review'
                    }
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
                  <div className="badge badge-xs badge-neutral text-xs">
                    {examTypes.find((t) => t.id === type)?.label || 'Exam'}
                  </div>
                  <div
                    className={`badge badge-xs badge-${subjects.find((s) => s.id === content)?.color || 'neutral'} text-xs`}
                  >
                    {subjects.find((s) => s.id === content)?.label || 'Subject'}
                  </div>
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

              <button className="btn btn-xs btn-primary text-xs h-7" onClick={handleSubmitExam}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showReview || showSubmitConfirm) && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${showReview ? 'review-modal-container' : ''}`}
        >
          <Suspense fallback={<div className="loading loading-spinner text-primary"></div>}>
            {showReview && (
              <div className="review-modal">
                <ReviewModalContent
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  userAnswers={userAnswers}
                  flaggedQuestions={flaggedQuestions}
                  onGoToQuestion={(index) => {
                    setCurrentQuestionIndex(index);
                    setShowReview(false);
                  }}
                  onClose={() => setShowReview(false)}
                  onFlagToggle={handleFlagQuestion}
                />
              </div>
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
