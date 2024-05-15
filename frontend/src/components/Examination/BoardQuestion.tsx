import { useContext, useState } from 'react';
import { Question } from './Examination';
import { Icon } from '../Icons';
import Countdown from './CountDown';
import { ExaminationContext } from '@/contexts/ExaminationContext';
type Props = {
  numOfQuestions: number;
};
export default function BoardQuestion({ numOfQuestions }: Props) {
  const [show, setShow] = useState(true);
  const { answers } = useContext(ExaminationContext);
  const qs = Array.from({ length: numOfQuestions });
  return (
    // <div
    //   className={`fixed flex-col right-6 top-20 flex z-20 bg-base-100 ${show ? 'border-2' : ''} border-neutral-400 rounded-md md:border-none`}
    // >
    // {/* <div className="flex justify-end items-center ls:mr-2 mb-2"> */}
    // {/* <Countdown initialTime={900} /> */}
    // {/* </div> */}
    <div className="flex justify-start flex-row-reverse z-20">
      <div className=" mx-2 flex">
        <button onClick={() => setShow(!show)} className="btn !p-3 lg:hidden">
          <Icon kind={`${!show ? 'app' : 'closebox'}`} size={24}></Icon>
        </button>
      </div>
      <div
        className={`${show ? 'flex' : 'hidden'} right-20 top-20 w-52 border-2 rounded-xl border-neutral-400 mx-2 mb-2`}
      >
        <div className="flex flex-row flex-wrap m-3 items-center justify-around">
          {qs.map((item, index) => (
            <div className="flex flex-col items-center m-1" key={index}>
              <button className={`kbd ${answers[index + 1] ? 'bg-primary' : ''}`}>{index + 1}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
    // </div>
  );
}
