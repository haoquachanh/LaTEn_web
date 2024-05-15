'use client';
import { useContext, useEffect, useState } from 'react';
import MultipChoice from './MultipChoice';
import BoardQuestion from './BoardQuestion';
import CountDown from './CountDown';
import { ExaminationContext } from '@/contexts/ExaminationContext';

export type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
};
export default function ExaminationContent() {
  const [start, setStart] = useState(false);
  useEffect(() => {
    const confirmLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ''; // Chuỗi không cần thiết cho một số trình duyệt
      return 'Bạn có chắc muốn rời khỏi trang này?'; // Hiển thị thông báo xác nhận
    };

    window.addEventListener('beforeunload', confirmLeave);

    return () => {
      window.removeEventListener('beforeunload', confirmLeave);
    };
  }, []);
  const [type, setType] = useState('Multip Choice');
  const [content, setContent] = useState('');
  const types = ['Multip Choice', 'True or False', 'Short Answer', 'Long Answer'];
  const contents = ['Grammar', 'Vocabulary', 'Topic', 'Review'];
  const { page, changePage } = useContext(ExaminationContext);
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
    {
      question: 'Question 3',
      answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: 'Answer 3',
      id: '4',
    },
    {
      question: 'Question 3',
      answers: ['Answer 1', 'Answer 2', 'Answer 3'],
      correctAnswer: 'Answer 3',
      id: '5',
    },
  ];
  return (
    <>
      {console.log('🚀 ~ ExaminationContent ~ page', page)}
      <div className="flex flex-col justify-start items-center lg:ml-[7%] w-[85%] h-full m-0">
        <h1 className="text-2xl font-bold h-16">Examination</h1>

        <div className={`flex flex-col space-y-12 justify-center items-center ${start ? 'hidden' : ''}`}>
          <div className="flex flex-row flex-wrap justify-center space-x-6">
            {types.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setType(item);
                }}
                className={`btn ${type == item ? 'btn-primary' : 'btn-disabled'} ${type == item ? 'btn-secondary' : ''} w-16 md:w-36`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex flex-row flex-wrap justify-center space-x-6">
            {contents.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setContent(item);
                }}
                className={`btn btn-disabled ${content == item ? 'btn-secondary' : ''} w-16 md:w-36`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex space-x-10 disabled">
            <label className="input input-bordered flex items-center gap-2 ">
              Number of Questions:
              <input type="number" className="w-12" defaultValue={15} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Time (minutes):
              <input type="number" className="w-12" defaultValue={15} />
            </label>
          </div>
          <button
            className={`btn btn-primary w-40 ${type == '' || content == '*****************' ? 'btn-disabled' : ''}`}
            onClick={() => setStart(true)}
          >
            Start
          </button>
        </div>
        {/* menu */}
        <div
          className={`flex flex-col justify-center w-full h-[calc(100%-12rem)] items-center border-2 border-base-200 rounded-md ${start ? '' : 'hidden'}`}
        >
          <MultipChoice questions={questions} />
          <div className="flex flex-row w-full">
            <div className="flex items-center w-[50%]">
              {page > 0 && (
                <button className="btn btn-link" onClick={() => changePage(page - 1)}>
                  ⇜Previous page
                </button>
              )}
            </div>
            <div className="flex items-center justify-end w-[50%]">
              {page < questions.length / 3 - 1 && (
                <button className="btn btn-link" onClick={() => changePage(page + 1)}>
                  Next page ⇝
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className={`fixed flex-col right-6 top-20 flex z-20 bg-base-100 border-neutral-400 rounded-md md:border-none`}
        >
          <div className="flex justify-end items-center lg:mr-6 mb-2 h-full">
            <CountDown initialTime={900} />
          </div>
          {/* <BoardQuestion /> */}
          <BoardQuestion numOfQuestions={questions.length} />

          <div className="flex justify-end items-center my-5 lg:mr-6">
            <button className="btn btn-outline w-24">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
