// import { useState } from 'react';
import { Icon } from '../Icons';

type QandA = {
  topic: number;
  question: string;
  answer: string;
};
export default function QandA() {
  const topics = [
    { index: 1, content: 'How it work' },
    { index: 2, content: 'What is Jetflix' },
    { index: 3, content: 'What is Jetflix' },
  ];
  const listPosts: QandA[] = [
    {
      topic: 1,
      question: 'New movie is released ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 1,
      question: 'Another question ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 2,
      question: 'New movie is released ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 2,
      question: 'Another question ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 1,
      question: 'New movie is released ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 1,
      question: 'Another question ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 3,
      question: 'New movie is released ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
    {
      topic: 4,
      question: 'Another question ?',
      answer: 'Click the button to watch on Jetflix app.',
    },
  ];

  // const [topic, setTopic] = useState('1');
  return (
    <div className="flex flex-col w-[80%] overflow-auto">
      <div className="flex flex-col space-y-3 w-full mb-5">
        <span className="label-text">You have any question?</span>
        <div className="flex w-full space-x-5">
          <textarea
            className="textarea textarea-bordered w-[80%] mx-5 h-12 max-h-32"
            placeholder="Type your question here"
          ></textarea>
          <button className="btn btn-primary">Publish</button>
        </div>
      </div>
      {topics.map((topic, index) => (
        <div className="collapse collapse-arrow bg-base-200 mb-8 overflow-hidden" key={index}>
          <input type="checkbox" className="peer" />
          <div className="collapse-title ">{topic.content}</div>
          <div className="collapse-content overflow-y-auto">
            {listPosts
              .filter((post) => post.topic === topic.index)
              .map((post, index) => (
                <div tabIndex={0} className="collapse bg-base-200" key={index}>
                  {/* <input type="checkbox" className="peer" /> */}
                  <div className="collapse-title flex flex-row items-center">
                    <Icon kind="question" />
                    <p className="ms-4">{post.question}</p>
                  </div>
                  <div className="collapse-content mr-4">{post.answer}</div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
