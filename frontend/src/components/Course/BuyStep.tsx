'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function BuyStep() {
  const [step, setStep] = useState(1);
  const steps = ['Login', 'Choose course', 'Pay', 'Study'];
  return (
    <>
      <div className="flex flex-col flex-wrap w-[80%] shadow-md m-6 mt-16 justify-center items-center">
        <h1 className="text-xl mt-5 font-bold">Instructions for purchasing courses</h1>
        <ul className="steps my-5">
          {steps.map((item, index) => (
            <li
              key={index}
              onClick={() => setStep(index + 1)}
              className={`step sm:w-10 lg:w-44 ${step >= index + 1 ? 'step-primary' : 'step'} ${step === index + 1 ? 'font-bold' : ''}`}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className={`flex justify-center items-center m-5 w-full ${step !== 1 ? 'hidden' : ''}`}>
          <p>Go to login packages: </p>
          <Link href={'/login'} className="btn btn-primary ml-5">
            Login
          </Link>
        </div>
        <div className={`flex justify-center m-5 w-full ${step !== 2 ? 'hidden' : ''}`}>
          <p>Choose one of the courses above</p>
        </div>
        <div className={`flex justify-center m-5 w-full ${step !== 3 ? 'hidden' : ''}`}>
          <p>Comming soon!</p>
        </div>
        <div className={`flex justify-center items-center m-5 w-full ${step !== 4 ? 'hidden' : ''}`}>
          <p>Go to your courses:</p>
          <button className="btn btn-primary ml-5">Your course</button>
        </div>
      </div>
    </>
  );
}
