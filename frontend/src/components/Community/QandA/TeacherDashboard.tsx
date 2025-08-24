import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

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
          <FiClock size={32} />
        </div>
        <div className="stat-title">Tổng câu hỏi</div>
        <div className="stat-value text-primary">{stats.totalQuestions}</div>
        <div className="stat-desc">Tất cả câu hỏi trong hệ thống</div>
      </div>

      {/* Unanswered Questions */}
      <div className="stat bg-base-200 rounded-lg shadow">
        <div className="stat-figure text-warning">
          <FiAlertCircle size={32} />
        </div>
        <div className="stat-title">Chưa trả lời</div>
        <div className="stat-value text-warning">{stats.unansweredCount}</div>
        <div className="stat-desc">Cần trả lời sớm</div>
      </div>

      {/* Answered Today */}
      <div className="stat bg-base-200 rounded-lg shadow">
        <div className="stat-figure text-success">
          <FiCheckCircle size={32} />
        </div>
        <div className="stat-title">Đã trả lời hôm nay</div>
        <div className="stat-value text-success">{stats.answeredToday}</div>
        <div className="stat-desc">Trong 24 giờ qua</div>
      </div>
    </div>
  );
};
