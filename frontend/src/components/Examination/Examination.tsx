'use client';
import { useContext, useEffect, useState } from 'react';
import MultipChoice from './MultipChoice';
import BoardQuestion from './BoardQuestion';
import CountDown from './CountDown';
import { ExaminationContext } from '@/contexts/ExaminationContext';
import ReviewBox from './ReviewBox';

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
  const [review, setReview] = useState(false);
  const { page, numberOfQuestions, changePage, init, time, changeTime } = useContext(ExaminationContext);

  const types = ['Multip Choice', 'True or False', 'Short Answer', 'Long Answer'];
  const contents = ['Grammar', 'Vocabulary', 'Topic', 'Review'];
  const questions: Question[] = [
    {
      question: 'Is this website good?',
      answers: ['No', 'Not Bad', 'Excellent'],
      correctAnswer: 'Excellent',
      id: '1',
    },
    {
      question: '1 / 0 = ',
      answers: ['0', '1', 'Wrong'],
      correctAnswer: 'Wrong',
      id: '2',
    },
    {
      question: 'What color is Oggy cat ?',
      answers: ['Black', 'Orange', 'Blue'],
      correctAnswer: 'Blue',
      id: '3',
    },
    {
      question: 'You + me = ',
      answers: ['2', '3', 'we'],
      correctAnswer: 'we',
      id: '4',
    },
    {
      question: '1 + 1 = ',
      answers: ['1', '2', '3'],
      correctAnswer: '2',
      id: '5',
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-start items-center lg:ml-[7%] w-full lg:w-[85%] h-full m-0">
        <div className={`flex h-16 flex-row items-center justify-center w-full `}>
          {/* <div className={`flex h-16 flex-row items-center w-full ${start ? '' : 'justify-center'}`}> */}
          {/* <button onClick={() => setStart(!back)} className={`${start ? '' : 'hidden'} text-3xl mr-[20%] lg:mr-[40%] bg-none hover:text-primary `}>
            ↶
          </button>
          <div className={`fixed left-0 top-0`}>
            <p>confirm the cancellation of the test and leave</p>
          </div> */}
          <h1 className="text-2xl font-bold text-center">Examination</h1>
        </div>

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
              <input type="number" className="w-12" defaultValue={5} />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Time:
              <input type="number" className="w-12" value={time} onChange={(e) => changeTime(Number(e.target.value))} />
            </label>
          </div>
          <button
            className={`btn btn-primary w-40 ${type == '' || content == '*****************' ? 'btn-disabled' : ''}`}
            onClick={() => {
              setStart(true);
              init(time);
            }}
          >
            Start
          </button>
        </div>
        <div
          className={`flex flex-col justify-center w-full lg:h-[calc(100%-12rem)] items-center border-2 border-base-200 rounded-md ${start ? '' : 'hidden'}`}
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
              {page < questions.length / numberOfQuestions - 1 && (
                <button className="btn btn-link" onClick={() => changePage(page + 1)}>
                  Next page ⇝
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={`fixed bottom-2 flex justify-end items-center m-5 lg:mr-6 ${start ? '' : 'hidden'}`}>
          <button onClick={() => setReview(!review)} className="btn btn-outline w-24">
            Review
          </button>
        </div>
        {review && (
          <ReviewBox
            numOfQuestions={questions.length}
            cancelReview={() => setReview(false)}
            endExam={() => setStart(false)}
          />
        )}
        <div
          className={`fixed flex-col right-6 top-16 flex z-20 bg-base-100 border-neutral-400 rounded-md md:border-none ${start ? '' : 'hidden'}`}
        >
          <div className="flex justify-end items-center lg:mr-6 mb-2 h-full">
            <CountDown />
          </div>
          {/* <BoardQuestion /> */}
          <BoardQuestion numOfQuestions={questions.length} />
        </div>
      </div>
    </>
  );
}
