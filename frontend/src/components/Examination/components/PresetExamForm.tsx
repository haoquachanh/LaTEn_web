'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { PresetExam } from '../types';
import examinationAttemptService from '@/services/examination-attempt.service';
import { sampleTemplates } from '../data/sampleTemplates';
import { samplePresetExams } from '../data/samplePresetExams';
import { env } from '@/env';

interface PresetExamFormProps {
  selectedPresetId: string;
  handlePresetSelect: (preset: PresetExam) => void;
  presetExams?: PresetExam[]; // Preset exam list received from parent component
}

/**
 * PresetExamForm displays a list of preset exams from API or props
 */
const PresetExamForm: React.FC<PresetExamFormProps> = ({
  selectedPresetId,
  handlePresetSelect,
  presetExams: propPresets,
}) => {
  const [presetExams, setPresetExams] = useState<PresetExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Optimize performance with useCallback to prevent unnecessary re-renders
  const fetchPresetExams = useCallback(async () => {
    try {
      // Use preset exams from props if available
      if (propPresets && propPresets.length > 0) {
        setPresetExams(propPresets);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Always use sample data in development mode if no props are provided
      if (env.isDevelopment) {
        setPresetExams(samplePresetExams);
        setError(null);
        setLoading(false);
        return;
      }

      // Check if user is authenticated (token exists in localStorage)
      // Use the correct token key based on API client configuration
      const token =
        localStorage.getItem('laten_auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

      if (!token) {
        // In development mode, use sample data instead of showing an error
        if (env.isDevelopment) {
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('Please log in to view preset exams.');
        }
        setLoading(false);
        return;
      }

      // Call API to get list of exam templates
      const response = await examinationAttemptService.getExamTemplates({ activeOnly: true });

      if (response.data && response.data.length > 0) {
        setPresetExams(response.data);
        setError(null);
      } else {
        // If API returns no data, use sample data in development environment
        if (env.isDevelopment) {
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('No exam templates available at this time.');
        }
      }
    } catch (err: any) {
      // Show detailed errors for easier debugging
      if (err.response) {
        if (err.response.status === 401) {
          // In development mode, use sample data instead of showing an error
          if (env.isDevelopment) {
            setPresetExams(sampleTemplates);
            setError(null);
          } else {
            setError('Please log in to view preset exams.');
          }
        } else {
          // In development mode, use sample data instead of showing an error
          if (env.isDevelopment) {
            setPresetExams(sampleTemplates);
            setError(null);
          } else {
            setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to load exam presets'}`);
          }
        }
      } else {
        // In development mode, use sample data instead of showing an error
        if (env.isDevelopment) {
          setPresetExams(sampleTemplates);
          setError(null);
        } else {
          setError('Failed to load exam presets. Please try again later.');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [propPresets]);

  useEffect(() => {
    fetchPresetExams();
  }, [fetchPresetExams]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-spinner loading-md text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-5 w-5"
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
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2 text-sm">
            1
          </span>
          Select Preset Exam
        </h3>

        {presetExams.length === 0 ? (
          <div className="alert alert-info p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-3 text-info"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 exam-preset-grid">
            {presetExams.map((preset) => (
              <div
                key={preset.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  String(selectedPresetId) === String(preset.id)
                    ? 'bg-primary text-primary-content shadow-md ring-1 ring-primary/50'
                    : 'bg-base-200 hover:bg-base-300 hover:shadow'
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                {/* Exam Icon/Visual */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    String(selectedPresetId) === String(preset.id) ? 'bg-primary-focus' : 'bg-base-300'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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

                {/* Exam Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{preset.title}</h4>
                      <p className="text-xs opacity-80 mt-1 line-clamp-2">{preset.description}</p>
                    </div>

                    {/* Selected Indicator */}
                    {String(selectedPresetId) === String(preset.id) && (
                      <div className="ml-2 text-primary-content bg-primary-focus rounded-full p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="badge badge-sm badge-primary gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {preset.totalQuestions} questions
                    </div>
                    <div className="badge badge-sm badge-secondary gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {preset.durationSeconds ? Math.ceil(preset.durationSeconds / 60) : preset.time} min
                    </div>
                    {preset.config?.randomize && (
                      <div className="badge badge-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Random
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Guidance information with smaller size */}
      <div className="mb-6 bg-base-200 p-4 rounded-lg shadow-sm">
        <div className="flex items-start">
          <div className="bg-primary/20 text-primary p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium mb-1">About Preset Exams</h4>
            <p className="text-xs opacity-80">
              Preset exams are pre-configured tests designed to match specific learning goals and provide a
              comprehensive assessment of your skills.
            </p>
            <ul className="mt-2 list-disc list-inside text-xs opacity-80">
              <li>Select a preset that matches your current level</li>
              <li>Each preset has a specific number of questions and time limit</li>
              <li>Results will help you identify areas for improvement</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Spacer for mobile view to ensure content isn't hidden behind fixed button */}
      <div className="h-15vh md:hidden"></div>
    </>
  );
};

export default memo(PresetExamForm);
