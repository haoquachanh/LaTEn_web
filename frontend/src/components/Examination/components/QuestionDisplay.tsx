'use client';

import { Question } from '../types';
import { examTypes, subjects } from '../data/examData';

// Extend Question type to include specific properties we need
interface ExtendedQuestion extends Question {
  options?: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  answers?: string[];
}

interface QuestionDisplayProps {
  currentQuestion: ExtendedQuestion;
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
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
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
}) => {
  return (
    <div className="flex-1 bg-base-100 rounded-box p-6 shadow-lg flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">
            Question {currentQuestionIndex + 1} / {questions.length}
          </h2>
          {/* Flag icon button */}
          <button
            onClick={() => handleFlagQuestion(currentQuestion?.id)}
            className={`flex items-center justify-center h-8 w-8 rounded-full ${
              flaggedQuestions.includes(currentQuestion?.id)
                ? 'bg-warning text-warning-content'
                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
            } transition-colors duration-200`}
            title={flaggedQuestions.includes(currentQuestion?.id) ? 'Unflag question' : 'Flag question for review'}
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
            {/* Handle true-false questions */}
            {currentQuestion?.type === 'true_false' ? (
              <>
                {/* True option */}
                <div
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    userAnswers[currentQuestion.id] === 'true'
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, 'true')}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border border-current">
                      T
                    </div>
                    <span>True</span>
                  </div>
                </div>
                {/* False option */}
                <div
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    userAnswers[currentQuestion.id] === 'false'
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, 'false')}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border border-current">
                      F
                    </div>
                    <span>False</span>
                  </div>
                </div>
              </>
            ) : /* Handle multiple choice questions */
            currentQuestion?.options ? (
              // Sử dụng options nếu có
              currentQuestion.options.map((option, idx: number) => (
                <div
                  key={option.id || idx}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    userAnswers[currentQuestion.id] === option.id
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                  onClick={() => handleAnswerChange(currentQuestion.id, option.id)}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full mr-3 border border-current">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))
            ) : (
              // Sử dụng answers nếu không có options (tương thích ngược)
              currentQuestion?.answers?.map((answer: any, idx: number) => (
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
              ))
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button className="btn btn-outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>

          <div className="flex gap-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <button className="btn btn-outline" onClick={handleReviewToggle}>
                  Review Answers
                </button>
                <button className="btn btn-primary" onClick={() => setShowSubmitConfirm(true)}>
                  Submit Exam
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleNextQuestion}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
