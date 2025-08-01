'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PresetExam } from './types';
import { sampleQuestions } from './data/sampleQuestions';
import { examTypes, subjects, presetExams } from './data/examData';
import ExamSetup from './components/ExamSetup';
import ExamContainer from './components/ExamContainer';
import ExamResults from './components/ExamResults';
import ExaminationDashboard from './components/ExaminationDashboard';

// Main Examination component that manages the overall exam flow
const Examination: React.FC = () => {
  // Exam state
  const [examState, setExamState] = useState<'dashboard' | 'setup' | 'inProgress' | 'results'>('dashboard');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState({
    type: '',
    content: '',
    timeInMinutes: 30,
    questionsCount: 10,
  });
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [examResults, setExamResults] = useState<{
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedAnswers: number;
    timeSpent: number;
  } | null>(null);

  // Configuration modes
  const [isCustomMode, setIsCustomMode] = useState<boolean>(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Handle starting an exam with custom configuration
  const handleStartCustomExam = (config: {
    type: string;
    content: string;
    timeInMinutes: number;
    questionsCount: number;
  }) => {
    // Filter questions based on type and content
    let filteredQuestions = [...sampleQuestions];

    if (config.type !== 'all') {
      filteredQuestions = filteredQuestions.filter((q) => q.type === config.type);
    }

    if (config.content !== 'all') {
      filteredQuestions = filteredQuestions.filter((q) => q.content === config.content);
    }

    // Shuffle and limit questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, config.questionsCount);

    // Store exam configuration in session storage for persistence
    sessionStorage.setItem('exam-type', config.type);
    sessionStorage.setItem('exam-content', config.content);
    sessionStorage.setItem('exam-questions', config.questionsCount.toString());
    sessionStorage.setItem('exam-time', config.timeInMinutes.toString());

    setSelectedQuestions(selected);
    setExamConfig(config);
    setExamState('inProgress');
  };

  // Handle starting a preset exam
  const handleStartPresetExam = (preset: PresetExam) => {
    // Filter questions based on preset configuration
    let filteredQuestions = [...sampleQuestions];

    if (preset.type !== 'all') {
      filteredQuestions = filteredQuestions.filter((q) => q.type === preset.type);
    }

    if (preset.content !== 'all') {
      filteredQuestions = filteredQuestions.filter((q) => q.content === preset.content);
    }

    // Shuffle and limit questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, preset.questions);

    // Create exam config from preset
    const config = {
      type: preset.type,
      content: preset.content,
      timeInMinutes: preset.time,
      questionsCount: preset.questions,
    };

    // Store exam configuration in session storage for persistence
    sessionStorage.setItem('exam-type', preset.type);
    sessionStorage.setItem('exam-content', preset.content);
    sessionStorage.setItem('exam-questions', preset.questions.toString());
    sessionStorage.setItem('exam-time', preset.time.toString());

    setSelectedQuestions(selected);
    setExamConfig(config);
    setExamState('inProgress');
  };

  // Handle submitting an exam
  const handleSubmitExam = (answers: { [key: string]: string }) => {
    setUserAnswers(answers);

    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    selectedQuestions.forEach((question) => {
      if (!answers[question.id]) {
        skippedCount++;
      } else if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const score = Math.round((correctCount / selectedQuestions.length) * 100);

    setExamResults({
      score,
      totalQuestions: selectedQuestions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      skippedAnswers: skippedCount,
      timeSpent: examConfig.timeInMinutes * 60 - 0, // We'd calculate actual time spent
    });

    setExamState('results');

    // Clear session storage
    sessionStorage.removeItem('exam-type');
    sessionStorage.removeItem('exam-content');
    sessionStorage.removeItem('exam-questions');
    sessionStorage.removeItem('exam-time');
  };

  // Handle canceling an exam
  const handleCancelExam = useCallback(() => {
    const confirmMessage = 'Are you sure you want to exit the exam? Your progress will be lost.';

    // Show confirmation dialog with more descriptive message
    if (window.confirm(confirmMessage)) {
      // Clean up all exam data
      setExamState('dashboard');
      setUserAnswers({});

      // Clear session storage
      sessionStorage.removeItem('exam-type');
      sessionStorage.removeItem('exam-content');
      sessionStorage.removeItem('exam-questions');
      sessionStorage.removeItem('exam-time');

      // Additional cleanup if needed
      // This could be a good place to log exam abandonment for analytics
      console.log('Exam canceled by user');
    }
  }, []); // Handle restarting the exam process
  const handleRestartExam = () => {
    setExamState('dashboard');
    setUserAnswers({});
    setExamResults(null);
  };

  // Handle navigation from dashboard to exam setup
  const handleStartFromDashboard = () => {
    setExamState('setup');
  };

  return (
    <div className="h-full flex justify-center">
      {examState === 'dashboard' && <ExaminationDashboard onStartTest={handleStartFromDashboard} />}

      {examState === 'setup' && (
        <ExamSetup
          isCustomExam={isCustomMode}
          setIsCustomExam={(value) => {
            setIsCustomMode(value);
            if (!value && selectedPresetId === '') {
              // When switching to preset mode, reset the form
              setExamConfig({
                type: '',
                content: '',
                timeInMinutes: 30,
                questionsCount: 10,
              });
            }
          }}
          type={examConfig.type || 'all'}
          setType={(type) => setExamConfig({ ...examConfig, type })}
          content={examConfig.content || 'all'}
          setContent={(content) => setExamConfig({ ...examConfig, content })}
          numberOfQuestions={examConfig.questionsCount}
          setNumberOfQuestions={(num) => setExamConfig({ ...examConfig, questionsCount: num })}
          time={examConfig.timeInMinutes}
          setTime={(time) => setExamConfig({ ...examConfig, timeInMinutes: time })}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={(presetId) => {
            // Use React state updater to ensure we get the latest state
            setSelectedPresetId(presetId);

            // Find preset in a more optimized way using Map lookup instead of find()
            const preset = presetExams.find((p) => p.id === presetId);
            if (preset) {
              // Set all config values at once in a single state update
              setExamConfig({
                type: preset.type,
                content: preset.content,
                timeInMinutes: preset.time,
                questionsCount: preset.questions,
              });
            }
          }}
          isLoading={false}
          handleStartExam={() => {
            if (isCustomMode) {
              handleStartCustomExam(examConfig);
            } else {
              const selectedPreset = presetExams.find((p) => p.id === selectedPresetId);
              if (selectedPreset) {
                handleStartPresetExam(selectedPreset);
              } else {
                console.error('No preset exam selected');
                alert('Please select a preset exam first');
              }
            }
          }}
          changePage={() => {
            /* Empty function, no longer needed */
          }}
        />
      )}

      {examState === 'inProgress' && (
        <ExamContainer
          questions={selectedQuestions}
          examConfig={examConfig}
          onSubmitExam={handleSubmitExam}
          onCancelExam={handleCancelExam}
        />
      )}

      {examState === 'results' && examResults && (
        <ExamResults
          results={examResults}
          questions={selectedQuestions}
          userAnswers={userAnswers}
          onRestartExam={handleRestartExam}
        />
      )}
    </div>
  );
};

export default Examination;
