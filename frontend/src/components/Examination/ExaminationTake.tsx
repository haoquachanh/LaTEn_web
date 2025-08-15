'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useExaminationApi, useExaminationQuestionsApi } from '@/hooks/useExaminationApi';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import ExaminationContent from '@/components/Examination/Examination';
import { ExaminationProvider } from '@/contexts/ExaminationContext';

interface ExaminationTakeProps {
  id: string;
}

const ExaminationTake: React.FC<ExaminationTakeProps> = ({ id }) => {
  const router = useRouter();
  const { data: examination, error: examError, isLoading: examLoading } = useExaminationApi(id);
  const { data: questions, error: questionsError, isLoading: questionsLoading } = useExaminationQuestionsApi(id);

  const isLoading = examLoading || questionsLoading;
  const error = examError || questionsError;

  // Redirect back to details if user tries to access this page directly
  useEffect(() => {
    if (!isLoading && !error && (!examination || !questions || questions.length === 0)) {
      router.push(`/examination/${id}`);
    }
  }, [examination, questions, isLoading, error, id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50%]">
        <LoadingState message="Setting up your examination..." size="lg" variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={(error as Error).message || 'Failed to load examination.'}
        error={error}
        onRetry={() => router.push(`/examination/${id}`)}
        variant="default"
      />
    );
  }

  if (!examination || !questions || questions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Unable to Start Examination</h2>
        <p className="mb-6">Please go back to the examination details page and try starting it again.</p>
        <button onClick={() => router.push(`/examination/${id}`)} className="btn btn-primary">
          Return to Examination Details
        </button>
      </div>
    );
  }

  // The actual examination is loaded via the context provider
  return (
    <ExaminationProvider>
      <ExaminationContent />
    </ExaminationProvider>
  );
};

export default ExaminationTake;
