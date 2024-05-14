'use client';
import { useState } from 'react';
import Questions from './Question';

type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
};
export default function ExaminationContent() {
  const [type, setType] = useState(0);
  const [content, setContent] = useState(1);
  const questions: Question[] = [
    {
      question: 'Question 1',
      answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: 'Answer 1',
      id: '1',
    },
    {
      question: 'Question 2',
      answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: 'Answer 2',
      id: '2',
    },
    {
      question: 'Question 3',
      answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: 'Answer 3',
      id: '3',
    },
  ];
  return (
    <>
      <div className="flex flex-col space-y-12 justify-center items-center">
        <h1 className="text-2xl font-bold">Examination</h1>
        <div className="flex flex-row flex-wrap justify-center space-x-6">
          <button
            onClick={() => {
              setType(1);
            }}
            className={`btn ${type == 1 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Multip Choice
          </button>
          <button
            onClick={() => {
              setType(2);
            }}
            className={`btn btn-disabled ${type == 2 ? 'btn-secondary' : ''} w-16 md:w-36 `}
          >
            T / F
          </button>
          <button
            onClick={() => {
              setType(3);
            }}
            className={`btn btn-disabled ${type == 3 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Short Answer
          </button>
          <button
            onClick={() => {
              setType(4);
            }}
            className={`btn btn-disabled ${type == 4 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Long Answer
          </button>
        </div>
        <div className="flex flex-row flex-wrap justify-center space-x-6">
          <button
            onClick={() => {
              setContent(1);
            }}
            className={`btn btn-disabled ${content == 1 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Grammar
          </button>
          <button
            onClick={() => {
              setContent(2);
            }}
            className={`btn btn-disabled ${content == 2 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Vocabulary
          </button>
          <button
            onClick={() => {
              setContent(3);
            }}
            className={`btn btn-disabled ${content == 3 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Topic
          </button>
          <button
            onClick={() => {
              setContent(4);
            }}
            className={`btn btn-disabled ${content == 4 ? 'btn-secondary' : ''} w-16 md:w-36`}
          >
            Review
          </button>
        </div>
        <button className={`btn btn-primary w-40 ${type == 0 || content == 0 ? 'btn-disabled' : ''}`}>Start</button>
        {/* <Questions questions={questions} /> */}
      </div>
    </>
  );
}
