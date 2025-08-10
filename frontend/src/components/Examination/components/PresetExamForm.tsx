'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { PresetExam } from '../types';
import examinationAttemptService from '@/services/examination-attempt.service';
import { sampleTemplates } from '../data/sampleTemplates';
import { env } from '@/env';

interface PresetExamFormProps {
  selectedPresetId: string;
  handlePresetSelect: (preset: PresetExam) => void;
}

/**
 * PresetExamForm hiển thị danh sách các bài thi mẫu từ API
 */
const PresetExamForm: React.FC<PresetExamFormProps> = ({ selectedPresetId, handlePresetSelect }) => {
  const [presetExams, setPresetExams] = useState<PresetExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useCallback để tối ưu performance khi re-render
  const fetchPresetExams = useCallback(async () => {
    try {
      setLoading(true);

      // Chạy môi trường development và không có dữ liệu API, sử dụng dữ liệu mẫu
      if (env.isDevelopment && process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true') {
        console.log('Using sample exam templates in development mode');
        setPresetExams(sampleTemplates);
        setError(null);
        setLoading(false);
        return;
      }

      // Kiểm tra xem user đã đăng nhập chưa (có token trong localStorage không)
      // Sử dụng key token đúng với config trong API client
      const token =
        localStorage.getItem('laten_auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

      if (!token) {
        console.warn('Authentication token not found. You need to log in to view preset exams.');
        // Trong môi trường development, sử dụng dữ liệu mẫu thay vì hiển thị lỗi
        if (env.isDevelopment) {
          console.log('Using sample exam templates since no token is available');
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('Please log in to view preset exams.');
        }
        setLoading(false);
        return;
      }

      // Gọi API để lấy danh sách bài thi
      const response = await examinationAttemptService.getExamTemplates({ activeOnly: true });
      console.log('Preset exams response:', response);

      if (response.data && response.data.length > 0) {
        setPresetExams(response.data);
        setError(null);
      } else {
        console.log('No exam templates returned from API, using sample data instead');
        // Nếu API không trả về dữ liệu, sử dụng dữ liệu mẫu trong môi trường development
        if (env.isDevelopment) {
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('No exam templates available at this time.');
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch preset exams:', err);

      // Hiển thị lỗi chi tiết hơn để dễ debug
      if (err.response) {
        console.error('Response error:', err.response.status, err.response.data);
        if (err.response.status === 401) {
          // Trong môi trường development, sử dụng dữ liệu mẫu thay vì hiển thị lỗi
          if (env.isDevelopment) {
            console.log('Using sample exam templates since authentication failed');
            setPresetExams(sampleTemplates);
            setError(null);
          } else {
            setError('Please log in to view preset exams.');
          }
        } else {
          // Trong môi trường development, sử dụng dữ liệu mẫu thay vì hiển thị lỗi
          if (env.isDevelopment) {
            console.log('Using sample exam templates due to API error');
            setPresetExams(sampleTemplates);
            setError(null);
          } else {
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load exam presets'}`);
          }
        }
      } else {
        // Trong môi trường development, sử dụng dữ liệu mẫu thay vì hiển thị lỗi
        if (env.isDevelopment) {
          console.log('Using sample exam templates due to API error');
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('Failed to load exam presets. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresetExams();
  }, [fetchPresetExams]);

  if (loading) {
    return (
      <div className="mb-8 flex justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 text-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select Preset Exam</h3>

        {presetExams.length === 0 ? (
          <div className="alert alert-info">
            <div className="flex items-center">
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
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>No preset exams available at the moment.</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {presetExams.map((preset) => (
              <div
                key={preset.id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPresetId === preset.id
                    ? 'bg-primary text-primary-content shadow-lg border-2 border-primary-focus'
                    : 'bg-base-200 hover:bg-base-300'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="flex flex-col">
                  <div className="font-medium text-lg">{preset.title}</div>
                  <div className="text-xs opacity-80">{preset.description}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="badge badge-sm badge-primary">{preset.totalQuestions} questions</span>
                  <span className="badge badge-sm">{Math.ceil(preset.durationSeconds / 60)} min</span>
                  {preset.config?.randomize && <span className="badge badge-sm">Random</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(PresetExamForm);
