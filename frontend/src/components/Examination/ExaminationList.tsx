'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExaminationsApi } from '@/hooks/useExaminationApi';
import { Examination } from '@/services/types/examination.types';
import { Icon } from '../Icons';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import { formatDuration } from '@/utils/dataTransformers';

interface ExaminationListProps {
  title?: string;
  limit?: number;
}

const ExaminationList: React.FC<ExaminationListProps> = ({ title = 'Available Examinations', limit = 5 }) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isValidating, mutate } = useExaminationsApi({}, page, limit);

  const examinations = data?.data || [];
  const loading = isLoading || isValidating;
  const totalPages = data?.totalPages || 1;

  if (loading && !examinations.length) {
    return (
      <div className="p-4">
        <LoadingState message="Loading examinations..." size="lg" variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={(error as Error).message || 'Failed to load examinations. Please try again later.'}
        error={error}
        onRetry={() => mutate()}
        variant="default"
      />
    );
  }

  if (!examinations.length) {
    return (
      <div className="p-4 text-center">
        <div className="text-3xl mb-2">ℹ️</div>
        <p>No examinations available.</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examinations.map((exam: Examination) => (
          <div key={exam.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-base-200">
            <h3 className="text-lg font-semibold">{exam.title}</h3>
            <p className="text-gray-600 line-clamp-2">{exam.description}</p>
            <div className="mt-3 flex justify-between items-center">
              <span className="badge bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{exam.type}</span>
              <span className="text-sm text-gray-500">{exam.questions?.length || 0} questions</span>
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
              <span>Difficulty: {exam.level || 'Beginner'}</span>
              <span>Time: {formatDuration(exam.duration || 30)}</span>
            </div>
            <button
              className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-focus transition-colors"
              onClick={() => router.push(`/examination/${exam.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="join">
            <button className="join-item btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              «
            </button>

            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`join-item btn ${p === page ? 'btn-active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}

            <button
              className="join-item btn"
              disabled={page === data.totalPages}
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            >
              »
            </button>
          </div>
        </div>
      )}

      {loading && examinations.length > 0 && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      )}
    </div>
  );
};

export default ExaminationList;
