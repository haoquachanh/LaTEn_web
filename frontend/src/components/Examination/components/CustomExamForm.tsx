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
}) => {
  return (
    <>
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
                content === subject.id ? 'bg-primary text-primary-content shadow-lg' : 'bg-base-200 hover:bg-base-300'
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
              const val = Math.max(1, Math.min(100, Number(e.target.value)));
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
          <h3 className="text-lg font-medium mb-2">Time Limit (minutes)</h3>
          <input
            type="number"
            min={1}
            max={180}
            className="input input-bordered rounded-none w-full"
            value={time}
            onChange={(e) => {
              const val = Math.max(1, Math.min(180, Number(e.target.value)));
              setTime(val);
            }}
            placeholder="Enter time in minutes"
          />
          <div className="flex gap-2 my-2">
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
        </div>
      </div>

      {/* Difficulty Level Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Difficulty Level</h3>
        <div className="flex gap-2">
          {['easy', 'medium', 'hard', 'expert'].map((diffLevel) => (
            <button
              key={diffLevel}
              className={`flex-1 btn ${level === diffLevel ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setLevel(diffLevel)}
            >
              {diffLevel.charAt(0).toUpperCase() + diffLevel.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default CustomExamForm;
