'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExaminationApi, useStartExaminationApi } from '@/hooks/useExaminationApi';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import { formatDuration, formatDate } from '@/utils/dataTransformers';
import { Icon } from '@/components/Icons';

interface ExaminationDetailProps {
  id: string;
}

const ExaminationDetail: React.FC<ExaminationDetailProps> = ({ id }) => {
  const router = useRouter();
  const { data: examination, error, isLoading } = useExaminationApi(id);
  const { startExam } = useStartExaminationApi();
  const [isStarting, setIsStarting] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[30%]">
        <LoadingState message="Loading examination details..." size="lg" variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={(error as Error).message || 'Failed to load examination details.'}
        error={error}
        onRetry={() => window.location.reload()}
        variant="default"
      />
    );
  }

  if (!examination) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-2">Examination Not Found</h2>
        <p className="mb-6">The examination you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.push('/')} className="btn btn-primary">
          Return Home
        </button>
      </div>
    );
  }

  const handleStartExam = async () => {
    try {
      setIsStarting(true);
      const result = await startExam(id);
      // Navigate to the examination taking interface
      router.push(`/examination/${id}/take`);
    } catch (error) {
      console.error('Failed to start examination:', error);
      setIsStarting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-base-200 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{examination.title}</h1>

        {/* Examination metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Duration</span>
            <span className="font-medium">{examination.duration ? formatDuration(examination.duration) : 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Questions</span>
            <span className="font-medium">{examination.questions?.length || 0} items</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Difficulty</span>
            <span className="font-medium">{examination.level}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm opacity-70">Type</span>
            <span className="font-medium">{examination.type}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About this examination</h2>
          <p className="text-base-content/80">{examination.description}</p>
        </div>

        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-base-content/80">
            <li>
              You will have {examination.duration ? formatDuration(examination.duration) : 'the allocated time'} to
              complete this examination.
            </li>
            <li>There are {examination.questions?.length || 0} questions in total.</li>
            <li>Each question has only one correct answer.</li>
            <li>You can navigate between questions freely during the examination.</li>
            <li>You can flag questions to review later.</li>
            <li>Your progress is saved automatically as you answer questions.</li>
            <li>Once you submit the examination, you cannot return to change your answers.</li>
          </ul>
        </div>

        {/* Start button */}
        <div className="flex justify-center mt-6">
          <button
            className="btn btn-primary btn-lg w-full md:w-auto md:px-16"
            onClick={handleStartExam}
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                Preparing Examination...
              </>
            ) : (
              <>Start Examination</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDetail;
