'use client';

import { useState } from 'react';
import Image from 'next/image';
import CustomExamForm from './CustomExamForm';
import PresetExamForm from './PresetExamForm';
import { PresetExam } from '../types';
import { useExamination } from '@/hooks/useExamination';

interface ExamSetupProps {
  isCustomExam: boolean;
  setIsCustomExam: (value: boolean) => void;
  type: string;
  setType: (type: string) => void;
  content: string;
  setContent: (content: string) => void;
  numberOfQuestions: number;
  setNumberOfQuestions: (num: number) => void;
  time: number;
  setTime: (time: number) => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  isLoading: boolean;
  handleStartExam: () => void;
  changePage: (page: number) => void;
}

const ExamSetup: React.FC<ExamSetupProps> = ({
  isCustomExam,
  setIsCustomExam,
  type,
  setType,
  content,
  setContent,
  numberOfQuestions,
  setNumberOfQuestions,
  time,
  setTime,
  selectedPresetId,
  setSelectedPresetId,
  isLoading,
  handleStartExam,
  changePage,
}) => {
  const handlePresetSelect = (preset: PresetExam) => {
    setSelectedPresetId(preset.id);
    setType(preset.type);
    setContent(preset.content);
    setNumberOfQuestions(preset.questions);
    setTime(preset.time);
    changePage(preset.questions);
  };

  return (
    <div className="w-full lg:w-2/3 space-y-6">
      <div className="bg-base-100 rounded-box p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Exam Setup</h2>

        {/* Exam Mode Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Select Exam Mode</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`flex flex-col items-center p-5 rounded-lg cursor-pointer transition-all duration-300 ${
                !isCustomExam ? 'bg-primary text-primary-content shadow-lg scale-105' : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => setIsCustomExam(false)}
            >
              <div className="font-medium text-center">Preset Exams</div>
              <p className="text-xs text-center my-2 opacity-80">Use pre-configured exams</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div
              className={`flex flex-col items-center p-5 rounded-lg cursor-pointer transition-all duration-300 ${
                isCustomExam ? 'bg-primary text-primary-content shadow-lg scale-105' : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => setIsCustomExam(true)}
            >
              <div className="font-medium text-center">Custom Exam</div>
              <p className="text-xs text-center my-2 opacity-80">Create your own exam</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
          </div>
        </div>

        {isCustomExam ? (
          <CustomExamForm
            type={type}
            setType={setType}
            content={content}
            setContent={setContent}
            numberOfQuestions={numberOfQuestions}
            setNumberOfQuestions={setNumberOfQuestions}
            time={time}
            setTime={setTime}
            changePage={changePage}
          />
        ) : (
          <PresetExamForm selectedPresetId={selectedPresetId} handlePresetSelect={handlePresetSelect} />
        )}

        {/* Start Button */}
        <button
          className="btn btn-primary btn-lg w-full"
          onClick={handleStartExam}
          disabled={(isCustomExam && (!type || !content)) || (!isCustomExam && !selectedPresetId) || isLoading}
        >
          {isLoading ? <span className="loading loading-spinner"></span> : 'Start Exam'}
        </button>
      </div>
    </div>
  );
};

export default ExamSetup;
