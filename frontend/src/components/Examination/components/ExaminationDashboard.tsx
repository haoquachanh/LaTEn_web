'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface PastExam {
  id: string;
  title: string;
  date: string;
  score: number;
  questions: number;
  timeSpent: string;
  type: string;
}

interface ExaminationDashboardProps {
  onStartTest: () => void;
}

const ExaminationDashboard: React.FC<ExaminationDashboardProps> = ({ onStartTest }) => {
  // Mock data for past exams
  const [pastExams, setPastExams] = useState<PastExam[]>([
    {
      id: '1',
      title: 'Reading Comprehension Test',
      date: '2025-07-28',
      score: 85,
      questions: 20,
      timeSpent: '25m 14s',
      type: 'Reading',
    },
    {
      id: '2',
      title: 'Grammar Quiz',
      date: '2025-07-25',
      score: 70,
      questions: 15,
      timeSpent: '14m 30s',
      type: 'Grammar',
    },
    {
      id: '3',
      title: 'Listening Comprehension',
      date: '2025-07-20',
      score: 90,
      questions: 10,
      timeSpent: '18m 45s',
      type: 'Listening',
    },
  ]);

  // Statistics for the dashboard
  const totalExams = pastExams.length;
  const averageScore =
    pastExams.length > 0 ? Math.round(pastExams.reduce((acc, exam) => acc + exam.score, 0) / totalExams) : 0;
  const bestScore = pastExams.length > 0 ? Math.max(...pastExams.map((exam) => exam.score)) : 0;

  // Get score color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8">Examination Dashboard</h1>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Total Tests Taken</h2>
            <p className="text-4xl font-bold">{totalExams}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Average Score</h2>
            <p className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}%</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Best Score</h2>
            <p className={`text-4xl font-bold text-success`}>{bestScore}%</p>
          </div>
        </div>
      </div>

      {/* Testing Guidelines */}
      <div className="alert alert-info mb-6 shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">Testing Guidelines</h3>
            <p className="text-sm">
              Please do not navigate away during a test. If you need to leave, use the Cancel button to properly exit
              your exam.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="btn btn-primary btn-lg" onClick={onStartTest}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Start New Test
        </button>

        <Link href="/examination/leaderboard" className="btn btn-outline btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Leaderboard
        </Link>

        <Link href="/examination/statistics" className="btn btn-outline btn-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          My Statistics
        </Link>
      </div>

      {/* Recent Tests Section */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Recent Tests</h2>

          {pastExams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Questions</th>
                    <th>Time</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastExams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="font-medium">{exam.title}</td>
                      <td>{formatDate(exam.date)}</td>
                      <td>{exam.type}</td>
                      <td>{exam.questions}</td>
                      <td>{exam.timeSpent}</td>
                      <td>
                        <span className={`font-bold ${getScoreColor(exam.score)}`}>{exam.score}%</span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link href={`/examination/results/${exam.id}`} className="btn btn-sm btn-outline">
                            View
                          </Link>
                          <button className="btn btn-sm btn-primary">Retake</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-base-content/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">No tests taken yet</h3>
              <p className="text-base-content/70 mb-4">Start a new test to see your results here</p>
              <button className="btn btn-primary" onClick={onStartTest}>
                Take Your First Test
              </button>
            </div>
          )}

          {pastExams.length > 0 && (
            <div className="card-actions justify-end mt-4">
              <Link href="/examination/history" className="btn btn-outline">
                View All Tests
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Tests Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recommended Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">IELTS Preparation</h3>
              <p className="text-base-content/70 mb-4">Practice your skills for the IELTS exam</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={onStartTest}>
                  Take Test
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Advanced Grammar</h3>
              <p className="text-base-content/70 mb-4">Improve your grammar with challenging questions</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={onStartTest}>
                  Take Test
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Business English</h3>
              <p className="text-base-content/70 mb-4">Learn vocabulary and phrases for business contexts</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={onStartTest}>
                  Take Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDashboard;
