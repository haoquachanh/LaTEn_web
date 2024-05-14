// File: Questions.jsx
'use client';
import { useState } from 'react';

type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
};

type Props = {
  questions: Question[];
};

export default function Questions({ questions }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [key]: event.target.value,
    });
  };

  const getCorrectAnswersCount = () => {
    console.log(JSON.stringify(selectedAnswers));
    return questions.reduce((count, question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  return (
    <div className="flex flex-col space-y-8">
      {questions.map((item, index) => (
        <div className="flex flex-col items-center" key={index}>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-xl">{item.question}</h1>
            {item.answers?.map((answer, answerIndex) => (
              <div key={answerIndex} className="flex justify-center items-center">
                <input
                  type="radio"
                  className="radio"
                  name={item.id}
                  value={answer}
                  onChange={(e) => handleChange(e, item.id)}
                />
                <label>{answer}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-4">
        <button onClick={() => alert(`Correct answers: ${getCorrectAnswersCount()}`)}>Submit</button>
      </div>
    </div>
  );
}
