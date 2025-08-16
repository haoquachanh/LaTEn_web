'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define types for our statistics data
interface ExamAttempt {
  id: string;
  examName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number; // in seconds
  date: string;
  type: string;
}

interface CategoryPerformance {
  category: string;
  score: number;
  count: number;
}

interface UserStatistics {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  examsPassed: number;
  totalTimeSpent: number; // in seconds
  recentAttempts: ExamAttempt[];
  categoryPerformance: CategoryPerformance[];
  rankingPosition: number;
  totalUsers: number;
}

// Mock data for statistics - will be replaced with API call later
const mockStatisticsData: UserStatistics = {
  totalExams: 27,
  averageScore: 78.4,
  bestScore: 95,
  examsPassed: 24,
  totalTimeSpent: 63900, // about 17.75 hours
  recentAttempts: [
    {
      id: '1',
      examName: 'Advanced Grammar Test',
      score: 85,
      totalQuestions: 30,
      correctAnswers: 25,
      timeSpent: 1800,
      date: '2025-09-15T14:30:00',
      type: 'grammar',
    },
    {
      id: '2',
      examName: 'Vocabulary Challenge',
      score: 90,
      totalQuestions: 50,
      correctAnswers: 45,
      timeSpent: 2400,
      date: '2025-09-10T09:15:00',
      type: 'vocabulary',
    },
    {
      id: '3',
      examName: 'Reading Comprehension',
      score: 75,
      totalQuestions: 20,
      correctAnswers: 15,
      timeSpent: 1500,
      date: '2025-09-05T16:45:00',
      type: 'reading',
    },
    {
      id: '4',
      examName: 'Listening Test',
      score: 80,
      totalQuestions: 25,
      correctAnswers: 20,
      timeSpent: 1800,
      date: '2025-09-01T11:00:00',
      type: 'listening',
    },
    {
      id: '5',
      examName: 'Phrasal Verbs Quiz',
      score: 70,
      totalQuestions: 40,
      correctAnswers: 28,
      timeSpent: 1200,
      date: '2025-08-28T13:20:00',
      type: 'vocabulary',
    },
  ],
  categoryPerformance: [
    { category: 'Grammar', score: 82, count: 8 },
    { category: 'Vocabulary', score: 85, count: 10 },
    { category: 'Reading', score: 76, count: 5 },
    { category: 'Listening', score: 74, count: 4 },
  ],
  rankingPosition: 7,
  totalUsers: 235,
};

const StatisticsContent: React.FC = () => {
  const router = useRouter();
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);

      try {
        // This would be replaced with an actual API call
        // const response = await examinationService.getUserStatistics();
        // const data = await response.json();

        // For now, simulate API delay with mock data
        setTimeout(() => {
          setStatistics(mockStatisticsData);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch user statistics:', error);
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // No longer needed
  // const goToLeaderboard = () => {
  //   router.push('/examination/leaderboard');
  // };

  // Format time (seconds) to hours and minutes
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get color based on score
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-info';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  // Get badge for exam type
  const getExamTypeBadge = (type: string): JSX.Element => {
    const typeMap: Record<string, { color: string; icon: string }> = {
      grammar: { color: 'badge-primary', icon: '📝' },
      vocabulary: { color: 'badge-secondary', icon: '📚' },
      reading: { color: 'badge-accent', icon: '📖' },
      listening: { color: 'badge-info', icon: '🎧' },
    };

    const { color, icon } = typeMap[type] || { color: 'badge-neutral', icon: '📋' };

    return (
      <div className={`badge ${color} gap-1`}>
        <span>{icon}</span> {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Failed to Load Statistics</h2>
        <p className="mb-6">Please refresh or try again later.</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="p-3 sm:p-4 border-b border-base-200 flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">My Statistics</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/examination')}
            className="btn btn-ghost btn-sm flex items-center gap-1"
            aria-label="Back to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Exams</div>
          <div className="stat-value text-primary">{statistics.totalExams}</div>
          <div className="stat-desc">Exams Completed</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Average Score</div>
          <div className="stat-value text-secondary">{statistics.averageScore}%</div>
          <div className="stat-desc">Best Score: {statistics.bestScore}%</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Time Spent</div>
          <div className="stat-value text-info">{formatTime(statistics.totalTimeSpent)}</div>
          <div className="stat-desc">On All Exams</div>
        </div>

        <div className="stat bg-base-200 rounded-box shadow">
          <div className="stat-figure text-success">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <Image src="/images/default-avatar.png" alt="User Avatar" width={64} height={64} />
              </div>
            </div>
          </div>
          <div className="stat-value text-success">#{statistics.rankingPosition}</div>
          <div className="stat-title">Rank</div>
          <div className="stat-desc">Out of {statistics.totalUsers} users</div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Category Performance</h2>
        <div className="bg-base-200 rounded-box p-6 shadow-lg">
          {statistics.categoryPerformance.map((category, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{category.category}</span>
                <span className={getScoreColor(category.score)}>{category.score}%</span>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2.5">
                <div className="h-2.5 rounded-full bg-primary" style={{ width: `${category.score}%` }}></div>
              </div>
              <div className="text-sm mt-1 text-base-content/70">Based on {category.count} exams</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Exam Attempts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Exam Attempts</h2>
        <div className="bg-base-200 rounded-box overflow-x-auto shadow-lg">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {statistics.recentAttempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="font-medium">{attempt.examName}</td>
                  <td>{getExamTypeBadge(attempt.type)}</td>
                  <td>{formatDate(attempt.date)}</td>
                  <td className={getScoreColor(attempt.score)}>
                    {attempt.score}%
                    <span className="text-xs ml-1 opacity-70">
                      ({attempt.correctAnswers}/{attempt.totalQuestions})
                    </span>
                  </td>
                  <td>{formatTime(attempt.timeSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="btn btn-outline btn-sm">View All Attempts</button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsContent;
