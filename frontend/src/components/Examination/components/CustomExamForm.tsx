'use client';

import Image from 'next/image';
import { examTypes, subjects } from '../data/examData';

interface CustomExamFormProps {
  type: string;
  setType: (type: string) => void;
  content: string;
  setContent: (content: string) => void;
  numberOfQuestions: number;
  setNumberOfQuestions: (num: number) => void;
  time: number;
  setTime: (time: number) => void;
  level?: string;
  setLevel?: (level: string) => void;
  changePage: (page: number) => void;
  handleStartExam?: () => void; // Optional prop for the start button
}

const CustomExamForm: React.FC<CustomExamFormProps> = ({
  type = 'multiple',
  setType,
  content = 'reading',
  setContent,
  numberOfQuestions,
  setNumberOfQuestions,
  time,
  setTime,
  level = 'medium',
  setLevel = () => {},
  changePage,
  handleStartExam = () => {},
}) => {
  return (
    <>
      {/* Exam Type Selection */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 text-primary mr-2 text-xs md:text-sm">
            1
          </span>
          Select Exam Type
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {examTypes.map((examType) => (
            <div
              key={examType.id}
              className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                type === examType.id
                  ? 'bg-primary text-primary-content shadow-md ring-1 ring-primary/50 transform scale-[1.02]'
                  : 'bg-base-200 hover:bg-base-300 hover:shadow'
              }`}
              onClick={() => setType(examType.id)}
            >
              <div className="mb-2">
                <Image
                  src={examType.icon}
                  alt={examType.label}
                  width={36}
                  height={36}
                  className={`transition-transform duration-300 ${type === examType.id ? 'scale-110' : ''}`}
                />
              </div>
              <div className="font-medium text-center">{examType.label}</div>
              <p className="text-xs text-center mt-1 opacity-80">{examType.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Selection */}
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 flex items-center">
          <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 text-primary mr-2 text-xs md:text-sm">
            2
          </span>
          Select Subject
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                content === subject.id
                  ? 'bg-primary text-primary-content shadow-md ring-1 ring-primary/50'
                  : 'bg-base-200 hover:bg-base-300 hover:shadow'
              }`}
              onClick={() => setContent(subject.id)}
            >
              {/* Subject icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  content === subject.id ? 'bg-primary-focus' : 'bg-base-300'
                }`}
              >
                {subject.id === 'reading' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                )}
                {subject.id === 'writing' && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <div className="font-medium">{subject.label}</div>
                <p className="text-xs opacity-80 mt-1">
                  {subject.id === 'reading' ? 'Reading comprehension and vocabulary' : 'Written expression and grammar'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions & Time Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        {/* Number of Questions */}
        <div className="bg-base-200 p-3 md:p-4 rounded-lg shadow-sm">
          <h3 className="text-base md:text-lg font-medium mb-2 flex items-center">
            <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/20 text-primary mr-2 text-xs md:text-sm">
              3
            </span>
            Number of Questions
          </h3>
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2% text-primary"
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
            <input
              type="number"
              min={1}
              max={100}
              className="input input-bordered w-full focus:ring-1 focus:ring-primary/50"
              value={numberOfQuestions}
              onChange={(e) => {
                const val = Math.max(1, Math.min(100, Number(e.target.value)));
                setNumberOfQuestions(val);
                changePage(val);
              }}
              placeholder="Enter number of questions"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 30, 40].map((num) => (
              <button
                key={num}
                className={`btn btn-sm ${numberOfQuestions === num ? 'btn-primary shadow-md' : 'btn-outline hover:shadow'}`}
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
        <div className="bg-base-200 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
              4
            </span>
            Time Limit (minutes)
          </h3>
          <div className="flex items-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2% text-primary"
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
            <input
              type="number"
              min={1}
              max={180}
              className="input input-bordered w-full focus:ring-1 focus:ring-primary/50"
              value={time}
              onChange={(e) => {
                const val = Math.max(1, Math.min(180, Number(e.target.value)));
                setTime(val);
              }}
              placeholder="Enter time in minutes"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((minutes) => (
              <button
                key={minutes}
                className={`btn btn-sm ${time === minutes ? 'btn-primary shadow-md' : 'btn-outline hover:shadow'}`}
                onClick={() => setTime(minutes)}
              >
                {minutes}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty Level Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
            5
          </span>
          Difficulty Level
        </h3>
        <div className="bg-base-200 p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['easy', 'medium', 'hard', 'expert'].map((diffLevel, index) => (
              <button
                key={diffLevel}
                className={`btn btn-sm ${level === diffLevel ? 'btn-primary shadow-md' : 'btn-outline hover:shadow'} flex items-center justify-center gap-1`}
                onClick={() => setLevel(diffLevel)}
              >
                {diffLevel === 'easy' && <span className="text-sm">🟢</span>}
                {diffLevel === 'medium' && <span className="text-sm">🟡</span>}
                {diffLevel === 'hard' && <span className="text-sm">🟠</span>}
                {diffLevel === 'expert' && <span className="text-sm">🔴</span>}
                {diffLevel.charAt(0).toUpperCase() + diffLevel.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for mobile view to ensure content isn't hidden behind fixed button */}
      <div className="h-15vh md:hidden"></div>
    </>
  );
};

export default CustomExamForm;
