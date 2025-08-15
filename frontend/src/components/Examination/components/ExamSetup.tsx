'use client';

import { useState, memo } from 'react';
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
  level?: string;
  setLevel?: (level: string) => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  isLoading: boolean;
  handleStartExam: () => void;
  changePage: (page: number) => void;
  onBackToDashboard?: () => void; // Add new prop for navigation
  presetExams?: PresetExam[];
}

const ExamSetup: React.FC<ExamSetupProps> = ({
  isCustomExam,
  setIsCustomExam,
  type = 'multiple',
  setType,
  content = 'reading',
  setContent,
  numberOfQuestions,
  setNumberOfQuestions,
  time,
  setTime,
  level = 'medium',
  setLevel = () => {},
  selectedPresetId,
  setSelectedPresetId,
  isLoading,
  handleStartExam,
  changePage,
  onBackToDashboard,
  presetExams,
}) => {
  // Handles preset exam selection
  const handlePresetSelect = (preset: PresetExam) => {
    console.log('ExamSetup: Selecting preset:', preset);
    // Ensure ID is always converted to string format
    const presetIdString = preset.id.toString();
    console.log('Setting selectedPresetId to:', presetIdString);
    setSelectedPresetId(presetIdString);
    setType('multiple');
    setContent('reading');
    // Other settings will be handled by the parent component
  };

  return (
    <div className="container mx-auto overflow-hidden exam-setup-container">
      <div className="bg-base-100 rounded-xl overflow-hidden h-full flex flex-col">
        {/* Header với tên trang và nút back */}
        <div className="p-4 mb-5 border-b rounded-xl border-base-300 flex justify-between items-center bg-gradient-to-r from-primary/15 via-primary/5 to-base-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
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
            <h2 className="text-2xl sm:text-3xl font-bold">Exam Setup</h2>
          </div>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="btn btn-ghost btn-md flex items-center gap-2 hover:bg-base-200 transition-all duration-300"
              aria-label="Back to dashboard"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
          {/* Sidebar - Mode Selection */}
          <div className="w-1/5 border-r rounded-lg border-base-200 px-4 py-6 bg-gradient-to-b from-base-200/80 to-base-200 flex flex-col flex-grow">
            <div className="flex flex-col flex-grow overflow-y-auto custom-scrollbar">
              {/* Preset Exams Button */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer mb-3 ${
                  !isCustomExam
                    ? 'bg-primary text-primary-content shadow-lg transform ring-2 ring-primary/20'
                    : 'bg-base-100 hover:bg-base-300 shadow-sm'
                }`}
                onClick={() => setIsCustomExam(false)}
              >
                <div
                  className={`p-3 rounded-lg ${!isCustomExam ? 'bg-primary-focus' : 'bg-base-300'} transition-all duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <div className="flex-1">
                  <div className="font-semibold">Preset Exams</div>
                  <p className="text-xs opacity-80 mt-1">Pre-configured tests</p>
                </div>
              </div>

              {/* Custom Exam Button */}
              <div
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isCustomExam
                    ? 'bg-primary text-primary-content shadow-lg transform ring-2 ring-primary/20'
                    : 'bg-base-100 hover:bg-base-300 shadow-sm'
                }`}
                onClick={() => setIsCustomExam(true)}
              >
                <div
                  className={`p-3 rounded-lg ${isCustomExam ? 'bg-primary-focus' : 'bg-base-300'} transition-all duration-300`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                <div className="flex-1">
                  <div className="font-semibold">Custom Exam</div>
                  <p className="text-xs opacity-80 mt-1">Create your own test</p>
                </div>
              </div>
            </div>

            {/* Start Button - Always visible and fixed at bottom */}
            <div className="mt-auto pt-4 border-t border-base-300">
              <button
                className={`btn btn-lg w-full ${isLoading ? 'btn-disabled' : 'btn-primary'} shadow-xl transition-all duration-300 hover:shadow-2xl text-base font-bold py-4 h-auto`}
                onClick={handleStartExam}
                disabled={(isCustomExam && (!type || !content)) || (!isCustomExam && !selectedPresetId) || isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Start Exam
                  </>
                )}
              </button>
              {!isCustomExam && !selectedPresetId && (
                <div className="text-error text-sm mt-3 text-center font-medium bg-error/10 rounded-lg p-2 border border-error/20">
                  Please select an exam from the list
                </div>
              )}
            </div>
          </div>

          {/* Form Content - Right Column with responsive height */}
          <div className="w-4/5 ms-4 p-5 flex-grow overflow-hidden flex flex-col border rounded-lg border-base-200">
            <div className="flex-grow overflow-hidden relative">
              {/* Custom Exam Form */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col ${
                  isCustomExam ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="h-full overflow-hidden pr-3 py-3 flex-grow">
                  <CustomExamForm
                    type={type}
                    setType={setType}
                    content={content}
                    setContent={setContent}
                    numberOfQuestions={numberOfQuestions}
                    setNumberOfQuestions={setNumberOfQuestions}
                    time={time}
                    setTime={setTime}
                    level={level}
                    setLevel={setLevel}
                    changePage={changePage}
                    handleStartExam={handleStartExam}
                  />
                </div>
              </div>

              {/* Preset Exam Form */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out flex flex-col ${
                  !isCustomExam ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="h-full overflow-y-auto overflow-x-hidden pr-3 py-3 custom-scrollbar flex-grow">
                  <PresetExamForm
                    selectedPresetId={selectedPresetId}
                    handlePresetSelect={handlePresetSelect}
                    presetExams={presetExams}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ExamSetup);
