// File: Questions.jsx
'use client';
import { useContext, useState } from 'react';
import { Question } from './Examination';
import { ExaminationContext } from '@/contexts/ExaminationContext';

type Props = {
  questions: Question[];
};

export default function MultipChoice({ questions }: Props) {
  // const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const { page, answers, handleChange } = useContext(ExaminationContext);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
  //   setAnswers({
  //     ...answers,
  //     [key]: event.target.value,
  //   });
  // };

  return (
    <div className="flex flex-col space-y-8 w-[95%] h-full justify-start my-8">
      {questions.map(
        (item, index) =>
          index >= page * 3 &&
          index < (page + 1) * 3 && (
            <div className="flex flex-col items-center w-full" key={index}>
              <div className="flex flex-col items-start space-y-2 w-full">
                <h1 className="text-xl ml-5">
                  Question {index + 1}: {item.question}
                </h1>
                {item.answers?.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex justify-center items-center ml-14">
                    <input
                      type="radio"
                      className="radio mr-5"
                      name={item.id}
                      value={answer}
                      onChange={(e) => handleChange(e, item.id)}
                    />
                    <label className="text-lg">{answer}</label>
                  </div>
                ))}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
