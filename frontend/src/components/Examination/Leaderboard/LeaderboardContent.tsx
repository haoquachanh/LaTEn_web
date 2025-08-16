'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import examinationStatsService, { LeaderboardData } from '@/services/examination-stats.service';

// Mock data for leaderboard - will be replaced with API call later
const mockLeaderboardData: LeaderboardData[] = [
  {
    id: '1',
    username: 'language_master',
    fullName: 'Nguyễn Văn A',
    score: 980,
    examCount: 25,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '2',
    username: 'vocab_king',
    fullName: 'Trần Thị B',
    score: 945,
    examCount: 22,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '3',
    username: 'grammar_pro',
    fullName: 'Lê Văn C',
    score: 920,
    examCount: 30,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '4',
    username: 'fluent_speaker',
    fullName: 'Phạm Thị D',
    score: 890,
    examCount: 18,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '5',
    username: 'word_wizard',
    fullName: 'Hoàng Văn E',
    score: 875,
    examCount: 20,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '6',
    username: 'language_learner',
    fullName: 'Đỗ Thị F',
    score: 860,
    examCount: 19,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '7',
    username: 'vocab_virtuoso',
    fullName: 'Ngô Văn G',
    score: 840,
    examCount: 17,
    avatarUrl: '/images/default-avatar.png',
    isCurrentUser: true, // Đánh dấu là người dùng hiện tại
  },
  {
    id: '8',
    username: 'syntax_star',
    fullName: 'Lý Thị H',
    score: 820,
    examCount: 16,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '9',
    username: 'phrase_finder',
    fullName: 'Vũ Văn I',
    score: 800,
    examCount: 15,
    avatarUrl: '/images/default-avatar.png',
  },
  {
    id: '10',
    username: 'idiom_expert',
    fullName: 'Mai Thị K',
    score: 790,
    examCount: 14,
    avatarUrl: '/images/default-avatar.png',
  },
];

const LeaderboardContent: React.FC = () => {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
  const [timeFrame, setTimeFrame] = useState<'all' | 'month' | 'week'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardData | null>(null);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);

      try {
        // Lấy dữ liệu bảng xếp hạng từ service với tham số timeFrame
        const leaderboardData = await examinationStatsService.getLeaderboardData(timeFrame);

        if (leaderboardData && leaderboardData.length > 0) {
          setLeaderboard(leaderboardData);

          // Tìm người dùng hiện tại trong bảng xếp hạng (user có thuộc tính isCurrentUser)
          const currentUser = leaderboardData.find((user) => user.isCurrentUser);
          if (currentUser) {
            setCurrentUserRank(currentUser);
          }
        } else {
          console.log('No leaderboard data found, using mock data');

          // Tạo dữ liệu mẫu với thuộc tính rank
          const rankedData = mockLeaderboardData.map((user, index) => ({
            ...user,
            rank: index + 1,
          }));

          setLeaderboard(rankedData);

          // Tìm người dùng hiện tại trong mock data
          const currentUser = rankedData.find((user) => user.isCurrentUser);
          if (currentUser) {
            setCurrentUserRank(currentUser);
          }
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard data:', error);

        // Fallback to mock data
        const rankedData = mockLeaderboardData.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboard(rankedData);

        // Tìm người dùng hiện tại trong mock data
        const currentUser = rankedData.find((user) => user.isCurrentUser);
        if (currentUser) {
          setCurrentUserRank(currentUser);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeFrame]);

  // Handle time frame change
  const handleTimeFrameChange = (newTimeFrame: 'all' | 'month' | 'week') => {
    setTimeFrame(newTimeFrame);
  };

  // No longer needed
  // const goToStatistics = () => {
  //   router.push('/examination/statistics');
  // };

  // Render medal or rank number
  const renderRank = (rank: number) => {
    if (rank === 1) {
      return <div className="text-yellow-500 text-xl font-bold">🥇</div>;
    } else if (rank === 2) {
      return <div className="text-gray-400 text-xl font-bold">🥈</div>;
    } else if (rank === 3) {
      return <div className="text-amber-700 text-xl font-bold">🥉</div>;
    } else {
      return <div className="text-base-content font-medium">{rank}</div>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="p-3 sm:p-4 border-b border-base-200 flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Leaderboard</h1>
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

      {/* Time frame selector */}
      <div className="flex gap-2 mb-6 tabs tabs-boxed">
        <a className={`tab ${timeFrame === 'all' ? 'tab-active' : ''}`} onClick={() => handleTimeFrameChange('all')}>
          All Time
        </a>
        <a
          className={`tab ${timeFrame === 'month' ? 'tab-active' : ''}`}
          onClick={() => handleTimeFrameChange('month')}
        >
          This Month
        </a>
        <a className={`tab ${timeFrame === 'week' ? 'tab-active' : ''}`} onClick={() => handleTimeFrameChange('week')}>
          This Week
        </a>
      </div>

      {/* Leaderboard table */}
      <div className="bg-base-200 rounded-box p-6 shadow-lg">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th className="text-end">Score</th>
                  <th className="text-end">Exams</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user) => (
                  <tr
                    key={user.id}
                    className={`${user.isCurrentUser ? 'bg-primary bg-opacity-10 border-l-4 border-primary' : ''}`}
                  >
                    <td className="w-12">{renderRank(user.rank!)}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <Image
                              src={user.avatarUrl || '/images/default-avatar.png'}
                              alt={user.username}
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.fullName}</div>
                          <div className="text-sm opacity-70">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-end font-bold">{user.score.toLocaleString()}</td>
                    <td className="text-end">{user.examCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with explanation */}
        <div className="mt-6 p-4 bg-base-100 rounded-lg text-sm">
          <h3 className="font-bold mb-2">How Scores Are Calculated</h3>
          <p>
            Leaderboard scores are calculated based on examination performance, difficulty level, and completion time.
            Higher scores on difficult exams with faster completion times receive more points.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardContent;
