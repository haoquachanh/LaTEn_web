'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function BuyStep() {
  const [step, setStep] = useState(1);
  const steps = ['Login', 'Choose course', 'Pay', 'Study'];
  return (
    <>
      <div className="flex flex-col w-full lg:h-full items-center">
        <div className="flex flex-col flex-wrap w-full shadow-xl border-t-2 border-base-200 rounded-lg justify-center items-center py-6 m-5 mb-0">
          <h1 className="text-md lg:text-2xl font-bold mt-1">Instructions for purchasing courses</h1>
          <ul className="steps mx-0 py-3 flex w-full justify-center">
            {steps.map((item, index) => (
              <li
                key={index}
                onClick={() => setStep(index + 1)}
                className={`step w-6 lg:w-44 ${step >= index + 1 ? 'step-primary' : 'step'} ${step === index + 1 ? 'font-bold' : ''}`}
              >
                {item}
              </li>
            ))}
          </ul>

          <div className={`flex justify-center items-center w-full ${step !== 1 ? 'hidden' : ''}`}>
            <p>Go to login packages: </p>
            <Link href={'/login'} className="btn btn-primary ml-5">
              Login
            </Link>
          </div>
          <div className={`flex justify-center w-full ${step !== 2 ? 'hidden' : ''}`}>
            <p>Choose one of the courses above</p>
          </div>
          <div className={`flex justify-center w-full ${step !== 3 ? 'hidden' : ''}`}>
            <p>Comming soon!</p>
          </div>
          <div className={`flex justify-center items-center w-full ${step !== 4 ? 'hidden' : ''}`}>
            <p>Go to your courses:</p>
            <button className="btn btn-primary ml-5">Your course</button>
          </div>
        </div>
      </div>
    </>
  );
}
