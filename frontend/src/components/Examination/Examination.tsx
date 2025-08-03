'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PresetExam } from './types';
import { sampleQuestions } from './data/sampleQuestions';
import { examTypes, subjects, presetExams } from './data/examData';
import ExamSetup from './components/ExamSetup';
import ExamContainer from './components/ExamContainer';
import ExamResults from './components/ExamResults';
import ExaminationDashboard from './components/ExaminationDashboard';
import examinationService from '@/services/examination.service';

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
  const handleStartPresetExam = async (preset: PresetExam) => {
    try {
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

      // TODO: Fetch examination from backend API instead of using sample questions
      // Get the questions from the backend by starting the examination
      const examination = await examinationService.startExamination(preset.id);

      // Use questions from the API response
      if (examination && examination.questions) {
        // Transform backend questions to frontend format if needed
        const questionsFromAPI = examination.questions.map((q: any) => ({
          id: q.id.toString(),
          question: q.text || q.content,
          answers: q.options || [],
          correctAnswer: q.correctOption || q.correctAnswer,
          type: q.type || preset.type,
          content: q.format || preset.content,
        }));

        setSelectedQuestions(questionsFromAPI);
        setExamConfig(config);
        setExamState('inProgress');
      } else {
        // Fallback to sample questions if the API doesn't return questions
        console.warn('No questions received from API, using sample questions as fallback');
        let filteredQuestions = [...sampleQuestions];

        // Filter and prepare sample questions
        if (preset.type !== 'all') {
          filteredQuestions = filteredQuestions.filter((q) => q.type === preset.type);
        }

        if (preset.content !== 'all') {
          filteredQuestions = filteredQuestions.filter((q) => q.content === preset.content);
        }

        const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, preset.questions);

        setSelectedQuestions(selected);
        setExamConfig(config);
        setExamState('inProgress');
      }
    } catch (error) {
      console.error('Failed to start examination:', error);
      alert('Failed to start examination. Please try again later.');
    }
  };

  // Handle submitting an exam
  const handleSubmitExam = async (answers: { [key: string]: string }) => {
    try {
      setUserAnswers(answers);

      // If we have a real exam ID from the backend, submit to API
      const presetId = selectedPresetId;
      if (presetId) {
        // Format answers for API
        const formattedAnswers = Object.keys(answers).map((questionId) => ({
          questionId: parseInt(questionId),
          selectedOption: parseInt(answers[questionId]), // Using selectedOption as required by backend
        }));

        // Calculate time spent (for now, use the full time - should implement actual tracking)
        const timeSpent = examConfig.timeInMinutes * 60;

        // Submit to backend
        try {
          const submission = {
            answers: formattedAnswers,
            timeSpent,
          };

          const result = await examinationService.submitExamination(presetId, submission);

          // Use results from the API
          if (result) {
            setExamResults({
              score: result.score || 0,
              totalQuestions: result.totalQuestions || selectedQuestions.length,
              correctAnswers: result.correctAnswers || 0,
              incorrectAnswers: (result.totalQuestions || selectedQuestions.length) - (result.correctAnswers || 0),
              skippedAnswers: selectedQuestions.length - Object.keys(answers).length,
              timeSpent: result.timeSpent || timeSpent,
            });
            setExamState('results');
            return;
          }
        } catch (error) {
          console.error('Failed to submit examination to API:', error);
          // Fall back to client-side scoring below
        }
      }

      // Client-side fallback scoring
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
        timeSpent: examConfig.timeInMinutes * 60, // We'd calculate actual time spent
      });

      setExamState('results');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('There was an error submitting your exam. Please try again.');
    }

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
