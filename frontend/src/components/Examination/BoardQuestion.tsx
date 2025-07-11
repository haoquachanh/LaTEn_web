'use client';
import { useContext, useState } from 'react';
import { Icon } from '../Icons';
import { ExaminationContext } from '@/contexts/ExaminationContext';
type Props = {
  numOfQuestions: number;
};
export default function BoardQuestion({ numOfQuestions }: Props) {
  const [show, setShow] = useState(true);
  const { answers, numberOfQuestions, changePage } = useContext(ExaminationContext);
  const qs = Array.from({ length: numOfQuestions });
  return (
    <div className="flex justify-start flex-row-reverse z-20">
      <div className=" mx-2 flex">
        <button onClick={() => setShow(!show)} className="!py-0 lg:hidden">
          <Icon kind={`${!show ? 'app' : 'closebox'}`} size={24}></Icon>
        </button>
      </div>
      <div
        className={`${show ? 'flex' : 'hidden'} right-20 top-20 w-64 border-2 rounded-xl border-neutral-400 mx-2 mb-2`}
      >
        <div className="flex flex-row flex-wrap m-3 items-center justify-around">
          {qs.map((item, index) => (
            <div className="flex flex-col items-center m-1" key={index}>
              <button
                onClick={() => changePage(Math.floor(index / numberOfQuestions))}
                className={`kbd ${answers[index + 1] ? 'bg-primary' : ''} hover:scale-105`}
              >
                {index + 1}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
}
