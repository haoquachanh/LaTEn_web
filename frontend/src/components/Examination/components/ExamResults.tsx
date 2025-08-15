'use client';

import { useState, useEffect } from 'react';
import { Question } from '../types';
import Link from 'next/link';
import examinationAttemptService from '@/services/examination-attempt.service';

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
  onBackToDashboard?: () => void; // Add navigation option to go back to dashboard
  examId?: number | string; // Added examId to fetch details from API
}

const ExamResults: React.FC<ExamResultsProps> = ({
  results,
  questions,
  userAnswers,
  onRestartExam,
  onBackToDashboard,
  examId,
}) => {
  const [loading, setLoading] = useState(false);
  const [detailedResults, setDetailedResults] = useState<any[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: string]: boolean }>({}); // Expansion state for each question

  // Function to handle expanding/collapsing a specific question
  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Fetch exam details from API if examId exists
  useEffect(() => {
    const fetchDetailedResults = async () => {
      if (!examId) return;

      try {
        setLoading(true);
        // Get detailed exam results from API
        const result = await examinationAttemptService.getExaminationDetail(examId);

        if (result && result.detailedResults) {
          console.log('Detailed results fetched:', result.detailedResults);
          setDetailedResults(result.detailedResults);
        }
      } catch (error) {
        console.error('Error fetching detailed results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedResults();
  }, [examId]);

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

  // Function to get correct answer for a question
  const getCorrectAnswer = (questionId: string) => {
    try {
      // If we have detailedResults from API, use them first
      if (detailedResults && detailedResults.length > 0) {
        const detailedResult = detailedResults.find(
          (r) =>
            r.questionId === parseInt(questionId) ||
            r.questionId === questionId ||
            r.examinationQuestionId === parseInt(questionId) ||
            r.examinationQuestionId === questionId,
        );
        if (detailedResult) {
          // Try different fields
          if (detailedResult.correctOption !== undefined) {
            return detailedResult.correctOption;
          } else if (detailedResult.question?.correctAnswer !== undefined) {
            return detailedResult.question.correctAnswer;
          } else if (detailedResult.correctAnswer !== undefined) {
            return detailedResult.correctAnswer;
          }

          // Find in options which one is marked as isCorrect
          const correctOpt =
            detailedResult.options?.find((opt: any) => opt.isCorrect) ||
            detailedResult.question?.options?.find((opt: any) => opt.isCorrect);
          if (correctOpt) {
            return correctOpt.id?.toString() || correctOpt.text || '';
          }
        }
      }

      // If not found in API, get from questions list
      const question = questions.find((q) => q.id === questionId);

      // If question has correctAnswer, return that value
      if (question?.correctAnswer) {
        return question.correctAnswer;
      }

      // If question has correctOption, return that value
      if (question?.correctOption) {
        return question.correctOption;
      }

      // Check in options which one is marked as isCorrect
      if (question?.options && Array.isArray(question.options)) {
        const correctOpt = question.options.find((opt: any) => typeof opt !== 'string' && opt.isCorrect === true);
        if (correctOpt) {
          return typeof correctOpt === 'string' ? correctOpt : correctOpt.id?.toString() || correctOpt.text || '';
        }
      }

      return '';
    } catch (error) {
      console.error('Error getting correct answer:', error);
      return '';
    }
  };

  // Function to get explanation for a question
  const getExplanation = (questionId: string) => {
    try {
      // If we have detailedResults from API, use them first
      if (detailedResults && detailedResults.length > 0) {
        const detailedResult = detailedResults.find(
          (r) =>
            r.questionId === parseInt(questionId) ||
            r.questionId === questionId ||
            r.examinationQuestionId === parseInt(questionId) ||
            r.examinationQuestionId === questionId,
        );

        if (detailedResult) {
          // Check multiple possible paths to get explanation
          const explanation =
            detailedResult.question?.explanation ||
            detailedResult.explanation ||
            (detailedResult.question?.options &&
              Array.isArray(detailedResult.question.options) &&
              detailedResult.question.options.find(
                (o: any) =>
                  o.id?.toString() === detailedResult.correctOption?.toString() ||
                  o.text === detailedResult.correctOption,
              )?.explanation);

          if (explanation) return explanation;
        }
      }

      // If not found in API, get from questions list
      const question = questions.find((q) => q.id === questionId);
      return question?.explanation || '';
    } catch (error) {
      console.error('Error getting explanation:', error);
      return '';
    }
  };

  // Define CSS for better scrolling experience
  const scrollStyles = {
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent',
    msOverflowStyle: 'none',
  } as React.CSSProperties;

  return (
    <div className="w-full p-0">
      {/* Results Summary Card - with thicker border, wider shadow and rounded corners */}
      <div className="card border-2 border-base-300 rounded-xl mb-8 shadow-lg">
        <div className="card-body p-3 sm:p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold">Exam Results</h2>
              <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(results.score)}`}>{results.score}%</div>
              <span className="text-xs ml-1">({getScoreMessage(results.score)})</span>
            </div>

            <div className="flex items-center gap-2">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="btn btn-ghost btn-sm flex items-center gap-1"
                  aria-label="Back to dashboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 md:grid-cols-4 gap-1 sm:gap-2 mb-2 text-center">
            <div className="stat border-2 border-base-300 rounded-lg p-2 shadow-md">
              <div className="stat-title text-xs">Total</div>
              <div className="stat-value text-sm">{results.totalQuestions}</div>
            </div>
            <div className="stat border-2 border-base-300 rounded-lg p-2 shadow-md">
              <div className="stat-title text-xs">Correct</div>
              <div className="stat-value text-sm text-success">{results.correctAnswers}</div>
            </div>
            <div className="stat border-2 border-base-300 rounded-lg p-2 shadow-md">
              <div className="stat-title text-xs">Incorrect</div>
              <div className="stat-value text-sm text-error">{results.incorrectAnswers}</div>
            </div>
            <div className="stat border-2 border-base-300 rounded-lg p-2 shadow-md">
              <div className="stat-title text-xs">Skipped</div>
              <div className="stat-value text-sm text-warning">{results.skippedAnswers}</div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center mt-2 gap-2">
            <div className="text-xs">
              Time: <span className="font-medium">{formatTime(results.timeSpent)}</span>
            </div>
            <div className="flex gap-1">
              <button className="btn btn-xs btn-primary" onClick={onRestartExam}>
                Take Another Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question Review - With simple scrollbar, thicker border, wider shadow and rounded corners */}
      <div className="card border-2 border-base-300 rounded-xl shadow-lg">
        <div className="card-body pt-3 p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Question Review</h3>
              <span className="badge badge-sm badge-neutral">{questions.length}</span>
            </div>
            <div className="text-xs text-base-content/70 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Scroll for all
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center p-4 flex-grow">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar" style={scrollStyles}>
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id] || 'Not answered';
                const correctAnswer = getCorrectAnswer(question.id);
                const isSkipped = !userAnswers[question.id];

                // More flexible logic for checking correct/incorrect answers
                const isCorrect = (() => {
                  // If question is skipped, it's not correct
                  if (isSkipped) return false;

                  // Direct string comparison
                  if (userAnswer === correctAnswer) return true;

                  // Compare ID vs ID or text vs text
                  if (question.options && Array.isArray(question.options)) {
                    const selectedOption = question.options.find((opt: any) => {
                      const optId = typeof opt === 'string' ? opt : opt.id?.toString();
                      const optText = typeof opt === 'string' ? opt : opt.text || (opt as any).content || '';

                      return userAnswer === optId || userAnswer === optText;
                    });

                    // If selected option is found, check if it's the correct answer
                    if (selectedOption) {
                      const optId = typeof selectedOption === 'string' ? selectedOption : selectedOption.id?.toString();
                      const optText =
                        typeof selectedOption === 'string'
                          ? selectedOption
                          : selectedOption.text || (selectedOption as any).content || '';

                      // Check if this option is the correct answer
                      if (typeof selectedOption === 'string') {
                        return correctAnswer === selectedOption;
                      } else if (selectedOption.isCorrect === true) {
                        return true;
                      } else {
                        return optId === correctAnswer || optText === correctAnswer;
                      }
                    }
                  }

                  return false;
                })();
                const explanation = getExplanation(question.id);

                // Check if question is currently expanded
                const isExpanded = expandedQuestions[question.id] === true;

                return (
                  <div
                    key={question.id}
                    className={`rounded-md border-2 mb-2 shadow-md ${
                      isSkipped
                        ? 'border-warning bg-warning/5'
                        : isCorrect
                          ? 'border-success bg-success/5'
                          : 'border-error bg-error/5'
                    }`}
                  >
                    {/* Question header - collapsible */}
                    <div
                      className="p-2 flex justify-between items-center cursor-pointer hover:bg-base-100/50"
                      onClick={() => toggleQuestionExpanded(question.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`badge badge-sm ${
                            isSkipped ? 'badge-warning' : isCorrect ? 'badge-success' : 'badge-error'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium line-clamp-1">{question.question || question.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            isSkipped ? 'text-warning' : isCorrect ? 'text-success' : 'text-error'
                          }`}
                        >
                          {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <button className="btn btn-sm btn-ghost btn-circle p-0 min-h-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Detailed content - only shown when expanded */}
                    {isExpanded && (
                      <div className="p-2 pt-0 border-t border-base-200">
                        <p className="mb-2 mt-1 text-sm">{question.question || question.content}</p>

                        {/* Display options if available */}
                        {question.options && question.options.length > 0 && (
                          <div className="mb-2 grid gap-1">
                            {question.options.map((option: any, optIndex: number) => {
                              const optionText =
                                typeof option === 'string' ? option : option.text || option.content || '';
                              const optionValue =
                                typeof option === 'string' ? option : option.id?.toString() || optIndex.toString();
                              // More flexible checking for different cases
                              const isUserAnswer =
                                userAnswer === optionValue ||
                                userAnswer === optionText ||
                                (option.id && userAnswer === option.id.toString());

                              const isCorrectOption =
                                correctAnswer === optionValue ||
                                correctAnswer === optionText ||
                                (typeof option !== 'string' && option.isCorrect === true);

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-1 rounded-md text-xs shadow ${
                                    isCorrectOption
                                      ? 'border-2 border-success/70'
                                      : isUserAnswer && !isCorrectOption
                                        ? 'border-2 border-error/70'
                                        : 'border-2 border-base-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-1">
                                    {isCorrectOption && (
                                      <span className="text-success">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrectOption && (
                                      <span className="text-error">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                          />
                                        </svg>
                                      </span>
                                    )}
                                    <span>{optionText}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Explanation - Compact */}
                        {(explanation || correctAnswer) && (
                          <div className="mt-1 p-1 border-2 border-base-300 rounded text-xs shadow">
                            <div className="font-medium">Explanation:</div>
                            <p className="text-[10px] leading-relaxed">
                              {explanation ||
                                (isCorrect ? "That's the correct answer!" : `The correct answer is ${correctAnswer}.`)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamResults;
