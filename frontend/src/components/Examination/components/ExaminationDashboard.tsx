'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useExaminationDashboard } from '@/hooks/useExaminationDashboard';
import { useExaminationResultsApi } from '@/hooks/useExaminationApi';

// Helper function to format time spent
const formatTimeSpent = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

interface ExaminationDashboardProps {
  onStartTest: (templateId?: number) => void;
}

const ExaminationDashboard: React.FC<ExaminationDashboardProps> = ({ onStartTest }) => {
  const t = useTranslations('Examination');
  // Sử dụng hook đã được cập nhật - nó sẽ lấy dữ liệu từ context
  const { data: dashboardData, isLoading, error, refreshData } = useExaminationDashboard();

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

  // Trích xuất dữ liệu từ API response
  const userStats = dashboardData?.userStats || {
    totalExams: 0,
    averageScore: 0,
    bestScore: 0,
    completionRate: 0,
  };

  const recentExams = dashboardData?.recentAttempts?.data || [];
  const pastExams = recentExams.map((result) => ({
    id: result.id.toString(),
    title: result.examination?.title || 'Unnamed Examination',
    date: result.completedAt,
    score: result.score,
    questions: result.totalQuestions,
    timeSpent: formatTimeSpent(result.timeSpent),
    type: result.examination?.type || 'Unknown',
  }));

  const leaderboard = dashboardData?.leaderboard || [];

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto pt-2 pb-4 px-4 md:px-6 custom-scrollbar">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">{t('examinationDashboard')}</h1>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Column: Stats & Quick Actions */}
          <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-3 text-center">
                  <p className="text-xs uppercase opacity-70">{t('totalExams')}</p>
                  <p className="text-2xl font-bold">{userStats.totalExams}</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-3 text-center">
                  <p className="text-xs uppercase opacity-70">{t('averageScore')}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(userStats.averageScore)}`}>
                    {userStats.averageScore}%
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-3 text-center">
                  <p className="text-xs uppercase opacity-70">{t('bestScore')}</p>
                  <p className="text-2xl font-bold text-success">{userStats.bestScore}%</p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-3 text-center">
                  <p className="text-xs uppercase opacity-70">{t('completionRate')}</p>
                  <p className="text-2xl font-bold">{userStats.completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="card bg-primary text-primary-content">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{t('quickStart')}</h3>
                  <p className="text-sm mb-3">{t('startExamDescription')}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-outline" onClick={() => onStartTest()}>
                      {t('startNow')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{t('myStats')}</h3>
                  <p className="text-sm mb-3">{t('viewStatsDescription')}</p>
                  <div className="card-actions justify-end">
                    <Link href="/examination/statistics" className="btn btn-sm btn-outline">
                      {t('viewStats')}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-md">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">{t('leaderboard')}</h3>
                  <p className="text-sm mb-3">{t('leaderboardDescription')}</p>
                  <div className="card-actions justify-end">
                    <Link href="/examination/leaderboard" className="btn btn-sm btn-outline">
                      {t('viewRanks')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Tests Section */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="card-title text-lg">{t('recentTests')}</h3>
                  {pastExams.length > 0 && (
                    <Link href="/examination/history" className="btn btn-xs btn-outline">
                      {t('viewAll')}
                    </Link>
                  )}
                </div>

                {isLoading && (
                  <div className="flex justify-center py-6">
                    <div className="loading loading-spinner loading-md"></div>
                  </div>
                )}

                {!isLoading && pastExams.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                      <thead>
                        <tr>
                          <th>{t('testName')}</th>
                          <th>{t('date')}</th>
                          <th>{t('score')}</th>
                          <th>{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastExams.slice(0, 4).map((exam) => (
                          <tr key={exam.id}>
                            <td className="font-medium max-w-[200px] truncate">{exam.title}</td>
                            <td className="whitespace-nowrap">{formatDate(exam.date)}</td>
                            <td>
                              <span className={`font-bold ${getScoreColor(exam.score)}`}>{exam.score}%</span>
                            </td>
                            <td>
                              <Link href={`/examination/results/${exam.id}`} className="btn btn-xs btn-outline">
                                {t('view')}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : !isLoading ? (
                  <div className="py-6 text-center">
                    <div className="mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 mx-auto text-base-content/30"
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
                    <p className="text-base-content/70 mb-3">{t('noTestsTaken')}</p>
                    <button className="btn btn-sm btn-primary" onClick={() => onStartTest()}>
                      {t('takeFirstTest')}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column: Leaderboard & Available Tests */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-4">
            {/* Top Performers */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="card-title text-lg">{t('topPerformers')}</h3>
                  <Link href="/examination/leaderboard" className="btn btn-xs btn-outline">
                    {t('full')}
                  </Link>
                </div>

                {isLoading && (
                  <div className="flex justify-center py-4">
                    <div className="loading loading-spinner loading-sm"></div>
                  </div>
                )}

                {!isLoading && leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.map((user, index) => (
                      <div key={user.userId} className="flex items-center p-2 bg-base-200 rounded-md">
                        <div className="flex-none w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-content">
                          {index + 1}
                        </div>
                        <div className="flex-1 px-3">
                          <p className="font-medium">{user.displayName || user.username}</p>
                        </div>
                        <div className="flex-none">
                          <span className={`font-bold ${getScoreColor(user.score)}`}>{user.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <p className="text-center py-4 text-base-content/70">{t('noLeaderboardData')}</p>
                ) : null}
              </div>
            </div>

            {/* Available Tests */}
            <div className="card bg-base-100 shadow-md">
              <div className="card-body p-4">
                <h3 className="card-title text-lg mb-3">{t('availableExams')}</h3>

                {isLoading && (
                  <div className="flex justify-center py-4">
                    <div className="loading loading-spinner loading-sm"></div>
                  </div>
                )}

                {!isLoading && dashboardData?.availableTemplates?.data?.length ? (
                  <div className="space-y-2">
                    {dashboardData.availableTemplates.data.slice(0, 4).map((template) => (
                      <div key={template.id} className="flex justify-between items-center p-2 bg-base-200 rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{template.title}</p>
                          <p className="text-xs text-base-content/70">
                            {template.totalQuestions || 0} questions ·{' '}
                            {template.durationSeconds ? Math.ceil(template.durationSeconds / 60) : 0} min
                          </p>
                        </div>
                        <button className="btn btn-xs btn-primary" onClick={() => onStartTest(template.id)}>
                          {t('start')}
                        </button>
                      </div>
                    ))}

                    {dashboardData.availableTemplates.data.length > 4 && (
                      <div className="text-center pt-2">
                        <button className="btn btn-xs btn-link" onClick={() => onStartTest()}>
                          {t('showMore')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : !isLoading ? (
                  <p className="text-center py-4 text-base-content/70">{t('noAvailableExams')}</p>
                ) : null}
              </div>
            </div>

            {/* Examination Tips */}
            <div className="card bg-info text-info-content">
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{t('examTips')}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>{t('tip1')}</li>
                  <li>{t('tip2')}</li>
                  <li>{t('tip3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDashboard;
