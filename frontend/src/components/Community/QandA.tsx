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
      question: 'New movie is released 2?',
      answer: 'Click the button to watch on Jetflix app.',
    },
  ];
  return (
    <div>
      {topics.map((topic) => (
        <div className="collapse collapse-arrow bg-base-200 mb-8">
          <input type="checkbox" className="peer" />
          <div className="collapse-title ">{topic.content}</div>
          <div className="collapse-content">
            {listPosts
              .filter((post) => post.topic === topic.index)
              .map((post) => (
                <div className="collapse bg-base-200">
                  <input type="checkbox" className="peer" />
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
