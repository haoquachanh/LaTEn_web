'use client';
import { useState } from 'react';

type TestQuestion = {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
};

export default function TestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentTest, setCurrentTest] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const testCategories = [
    { name: 'JavaScript Fundamentals', questions: 20, duration: 30, difficulty: 'Beginner' },
    { name: 'React Development', questions: 15, duration: 25, difficulty: 'Intermediate' },
    { name: 'Node.js Backend', questions: 18, duration: 35, difficulty: 'Advanced' },
    { name: 'Database Design', questions: 12, duration: 20, difficulty: 'Intermediate' },
    { name: 'Web Security', questions: 10, duration: 15, difficulty: 'Advanced' },
    { name: 'UI/UX Design', questions: 14, duration: 30, difficulty: 'Beginner' },
  ];

  const sampleQuestions: TestQuestion[] = [
    {
      id: 1,
      question: 'What is the correct way to create a function in JavaScript?',
      options: [
        'function myFunction() {}',
        'def myFunction():',
        'function = myFunction() {}',
        'create myFunction() {}',
      ],
      correct: 0,
      category: 'JavaScript Fundamentals',
    },
    {
      id: 2,
      question: 'Which hook is used for state management in React?',
      options: ['useEffect', 'useState', 'useContext', 'useCallback'],
      correct: 1,
      category: 'React Development',
    },
    {
      id: 3,
      question: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'],
      correct: 2,
      category: 'UI/UX Design',
    },
  ];

  const startTest = (category: string) => {
    setSelectedCategory(category);
    setCurrentTest(sampleQuestions.filter((q) => q.category === category));
    setTestStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setTestCompleted(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentTest.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    let correctCount = 0;
    currentTest.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setTestCompleted(true);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setSelectedCategory('');
    setScore(0);
  };

  if (testCompleted) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
          <div className="card-body text-center">
            <div className="mb-6">
              {score / currentTest.length >= 0.8 ? (
                <div className="text-6xl mb-4">🎉</div>
              ) : score / currentTest.length >= 0.6 ? (
                <div className="text-6xl mb-4">👍</div>
              ) : (
                <div className="text-6xl mb-4">📚</div>
              )}
            </div>

            <h2 className="card-title text-3xl justify-center mb-4">Test Completed!</h2>

            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Your Score</div>
                <div className="stat-value text-primary">
                  {score}/{currentTest.length}
                </div>
                <div className="stat-desc">{Math.round((score / currentTest.length) * 100)}% Correct</div>
              </div>
            </div>

            <div className="mb-6">
              <div
                className={`badge badge-lg ${
                  score / currentTest.length >= 0.8
                    ? 'badge-success'
                    : score / currentTest.length >= 0.6
                      ? 'badge-warning'
                      : 'badge-error'
                }`}
              >
                {score / currentTest.length >= 0.8
                  ? 'Excellent!'
                  : score / currentTest.length >= 0.6
                    ? 'Good Job!'
                    : 'Keep Learning!'}
              </div>
            </div>

            <p className="text-base-content/70 mb-6">
              {score / currentTest.length >= 0.8
                ? "Outstanding performance! You've mastered this topic."
                : score / currentTest.length >= 0.6
                  ? 'Good work! Review the topics you missed and try again.'
                  : "Don't worry! Practice makes perfect. Review the material and retake the test."}
            </p>

            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={resetTest}>
                Take Another Test
              </button>
              <button className="btn btn-outline">Review Answers</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testStarted) {
    const currentQuestion = currentTest[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentTest.length) * 100;

    return (
      <div className="min-h-screen bg-base-200 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{selectedCategory}</h1>
                <div className="badge badge-primary">
                  Question {currentQuestionIndex + 1} of {currentTest.length}
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="text-xl font-semibold mb-6">{currentQuestion?.question}</h2>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <label key={index} className="cursor-pointer">
                    <div
                      className={`card bg-base-200 hover:bg-base-300 transition-colors ${
                        selectedAnswers[currentQuestionIndex] === index ? 'ring-2 ring-primary' : ''
                      }`}
                    >
                      <div className="card-body py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="answer"
                            className="radio radio-primary"
                            checked={selectedAnswers[currentQuestionIndex] === index}
                            onChange={() => selectAnswer(index)}
                          />
                          <span>{option}</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="card-actions justify-between mt-8">
                <button
                  className="btn btn-outline"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>

                <button
                  className="btn btn-primary"
                  onClick={nextQuestion}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  {currentQuestionIndex === currentTest.length - 1 ? 'Finish Test' : 'Next Question'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Knowledge Tests
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Test your knowledge and track your learning progress with our comprehensive assessment system.
          </p>
        </div>

        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testCategories.map((category, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="card-body">
                <h2 className="card-title text-xl mb-3">{category.name}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div
                    className={`badge ${
                      category.difficulty === 'Beginner'
                        ? 'badge-success'
                        : category.difficulty === 'Intermediate'
                          ? 'badge-warning'
                          : 'badge-error'
                    }`}
                  >
                    {category.difficulty}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Questions:</span>
                    <span className="font-medium">{category.questions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="font-medium">{category.duration} min</span>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-primary w-full" onClick={() => startTest(category.name)}>
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="card bg-base-100 shadow-xl mt-16">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Test Instructions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3">Before You Start</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Ensure you have a stable internet connection</li>
                  <li>Find a quiet environment free from distractions</li>
                  <li>Read each question carefully before answering</li>
                  <li>You can review and change answers before submitting</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-3">Scoring System</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Each correct answer earns 1 point</li>
                  <li>No negative marking for wrong answers</li>
                  <li>80%+ score: Excellent understanding</li>
                  <li>60-79% score: Good, review missed topics</li>
                  <li>Below 60%: More study recommended</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
