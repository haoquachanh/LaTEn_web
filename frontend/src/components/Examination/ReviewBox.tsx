import { ExaminationContext } from '@/contexts/ExaminationContext';
import { useContext } from 'react';
import BoardQuestion from './BoardQuestion';
import Countdown from './CountDown';
import { Icon } from '../Icons';
type Props = {
  numOfQuestions: number;
  changePage?: (page: number) => void;
  cancelReview: () => void;
  endExam: () => void;
};

export default function ReviewBox({ numOfQuestions, cancelReview, endExam }: Props) {
  const { answers, changePage } = useContext(ExaminationContext);
  const loop = Array.from({ length: numOfQuestions });
  // const loop = Array.from({ length: 20 });
  const handleSubmit = () => {
    cancelReview();
    endExam();
  };
  return (
    <>
      <div className="fixed flex h-screen w-screen top-0 left-0 bg-primary/50 justify-center !z-50">
        <div className="flex w-3/5 h-[calc(100vh-10rem)] bg-primary py-20 my-20 flex-col items-center rounded-xl bg-primary/95">
          <h1 className="text-3xl h-[10%]">Review & Submit</h1>
          <div className="flex w-full h-[10%]">
            <div className="flex flex-col justify-start ml-5 lg:ml-32">
              <div className="flex items-center">
                <p className="text-md lg:text-xl mr-2">Time remaining: </p>
                <Countdown />
              </div>
              <p className="text-md lg:text-xl">
                You answered: {Object.keys(answers).length} / {numOfQuestions}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-center h-[70%] border-2 my-5 rounded-lg w-4/5 overflow-auto">
            <div className="flex flex-col w-[90%]">
              {loop.map((_, index) => (
                <div
                  className={`flex justify-between items-center border-y p-3 hover:bg-secondary/30 ${answers[index + 1] ? 'bg-neutral/30' : ''}`}
                  key={index}
                >
                  <p>Question {index + 1}</p>
                  {answers[index + 1] ? (
                    <Icon kind="tick" color="green" size={24}></Icon>
                  ) : (
                    <Icon kind="questionnobox" color="orange" size={24}></Icon>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-12 space-x-10">
            <button onClick={cancelReview} className="btn btn-neutral/100">
              Cancel
            </button>
            <button onClick={handleSubmit} className="btn btn-neutral/100">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
