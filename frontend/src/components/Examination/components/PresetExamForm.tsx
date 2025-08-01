'use client';

import { memo } from 'react';
import { PresetExam } from '../types';
import { presetExams } from '../data/examData';

interface PresetExamFormProps {
  selectedPresetId: string;
  handlePresetSelect: (preset: PresetExam) => void;
}

const PresetExamForm: React.FC<PresetExamFormProps> = ({ selectedPresetId, handlePresetSelect }) => {
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
