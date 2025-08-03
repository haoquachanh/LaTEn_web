'use client';

import { memo, useState, useEffect } from 'react';
import { PresetExam } from '../types';
import examinationService from '@/services/examination.service';

interface PresetExamFormProps {
  selectedPresetId: string;
  handlePresetSelect: (preset: PresetExam) => void;
}

const PresetExamForm: React.FC<PresetExamFormProps> = ({ selectedPresetId, handlePresetSelect }) => {
  const [presetExams, setPresetExams] = useState<PresetExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresetExams = async () => {
      try {
        setLoading(true);
        const exams = await examinationService.getPresetExaminations();
        setPresetExams(exams);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch preset exams:', err);
        setError('Failed to load exam presets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPresetExams();
  }, []);

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
        <div className="grid grid-cols-1 gap-4">
          {presetExams.map((preset) => (
            <div
              key={preset.id}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${
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
                <span className="badge badge-sm">{preset.type}</span>
                <span className="badge badge-sm">{preset.questions} questions</span>
                <span className="badge badge-sm">{preset.time} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(PresetExamForm);
