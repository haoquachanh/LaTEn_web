import React from 'react';

const IconClock: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconAlertCircle: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheckCircle: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TeacherStats {
  totalQuestions: number;
  unansweredCount: number;
  answeredToday: number;
}

interface TeacherDashboardProps {
  stats: TeacherStats;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Questions */}
      <div className="stat bg-base-200 rounded-lg shadow">
        <div className="stat-figure text-primary">
          <IconClock size={32} />
        </div>
        <div className="stat-title">Tổng câu hỏi</div>
        <div className="stat-value text-primary">{stats.totalQuestions}</div>
        <div className="stat-desc">Tất cả câu hỏi trong hệ thống</div>
      </div>

      {/* Unanswered Questions */}
      <div className="stat bg-base-200 rounded-lg shadow">
        <div className="stat-figure text-warning">
          <IconAlertCircle size={32} />
        </div>
        <div className="stat-title">Chưa trả lời</div>
        <div className="stat-value text-warning">{stats.unansweredCount}</div>
        <div className="stat-desc">Cần trả lời sớm</div>
      </div>

      {/* Answered Today */}
      <div className="stat bg-base-200 rounded-lg shadow">
        <div className="stat-figure text-success">
          <IconCheckCircle size={32} />
        </div>
        <div className="stat-title">Đã trả lời hôm nay</div>
        <div className="stat-value text-success">{stats.answeredToday}</div>
        <div className="stat-desc">Trong 24 giờ qua</div>
      </div>
    </div>
  );
};
