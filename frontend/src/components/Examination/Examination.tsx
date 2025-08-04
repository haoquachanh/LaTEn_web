'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PresetExam } from './types';
import { sampleQuestions } from './data/sampleQuestions';
import { examTypes, subjects } from './data/examData';
import ExamSetup from './components/ExamSetup';
import ExamContainer from './components/ExamContainer';
import ExamResults from './components/ExamResults';
import ExaminationDashboard from './components/ExaminationDashboard';
import examinationService from '@/services/examination.service';

/**
 * Helper function to map frontend exam type to backend QuestionType enum
 */
const mapTypeToBackend = (type: string): string => {
  const typeMap: Record<string, string> = {
    'multiple-choice': 'MULTIPLE_CHOICE',
    'true-false': 'TRUE_FALSE',
    'essay': 'ESSAY',
    'short-answer': 'SHORT_ANSWER',
  };
  return typeMap[type] || 'MULTIPLE_CHOICE';
};

/**
 * Helper function to map frontend content type to backend QuestionMode enum
 */
const mapContentToBackend = (content: string): string => {
  const contentMap: Record<string, string> = {
    'reading': 'READING',
    'listening': 'LISTENING',
  };
  return contentMap[content] || 'READING';
};

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
    level: 'medium',
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
  const [presetExams, setPresetExams] = useState<PresetExam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch preset exams on component mount
  useEffect(() => {
    const fetchPresetExams = async () => {
      try {
        const exams = await examinationService.getPresetExaminations();
        setPresetExams(exams);
      } catch (error) {
        console.error('Failed to fetch preset exams:', error);
      }
    };

    fetchPresetExams();
  }, []);

  // Handle starting an exam with custom configuration
  const handleStartCustomExam = async (config: {
    type: string;
    content: string;
    timeInMinutes: number;
    questionsCount: number;
    level: string;
  }) => {
    try {
      setIsLoading(true);
      console.log('Starting custom examination with config:', config);
      
      // Store exam configuration in session storage for persistence
      sessionStorage.setItem('exam-type', config.type);
      sessionStorage.setItem('exam-content', config.content);
      sessionStorage.setItem('exam-questions', config.questionsCount.toString());
      sessionStorage.setItem('exam-time', config.timeInMinutes.toString());
      sessionStorage.setItem('exam-level', config.level);
      
      // Chuẩn bị thông số bài thi để gửi đến API
      const examParams = {
        questionsCount: config.questionsCount,
        type: mapTypeToBackend(config.type),
        content: mapContentToBackend(config.content),
        duration: config.timeInMinutes,
        level: config.level.toUpperCase() // Chuyển đổi level thành enum format (ví dụ: medium -> MEDIUM)
      };
      
      console.log('Sending custom exam parameters to API:', examParams);
      
      // Fetch examination from backend API with parameters
      // Use the first preset exam as a base, but override with custom parameters
      const presetIds = presetExams.map(preset => preset.id);
      if (presetIds.length === 0) {
        throw new Error('No preset examinations available for use as template');
      }
      
      const basePresetId = presetIds[0]; // Use first preset as template
      const examination = await examinationService.startExamination(basePresetId, examParams);
      
      // Use questions from the API response
      if (examination && examination.questions && examination.questions.length > 0) {
        console.log('Questions received from API for custom exam:', examination.questions);
        
        // Transform API questions to frontend format
        const transformedQuestions = examination.questions.map((q: any) => ({
          id: q.id?.toString() || '',
          question: q.question || q.text || '',
          answers: q.options || q.answers || [],
          correctAnswer: '', // Will be filled after submission
          type: q.type || examination.type || config.type,
          content: q.content || config.content,
          questionId: q.questionId || q.id || 0,
        }));
        
        setSelectedQuestions(transformedQuestions);
        setExamConfig(config);
        setSelectedPresetId(examination.id?.toString() || ''); // Save examination ID for submission
        setExamState('inProgress');
      } else {
        // No questions from API - show error
        console.error('No questions received from API for custom exam');
        alert('Failed to load examination questions. Please try again.');
      }
    } catch (error) {
      console.error('Failed to start custom examination:', error);
      alert('Failed to start examination. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting a preset exam
  const handleStartPresetExam = async (preset: PresetExam) => {
    try {
      setIsLoading(true);
      console.log(`Starting examination with preset ID: ${preset.id}`);
      
      // Create exam config from preset
      const config = {
        type: preset.type,
        content: preset.content,
        timeInMinutes: preset.time,
        questionsCount: preset.questions,
        level: 'medium' // Default level for presets
      };

      // Store exam configuration in session storage for persistence
      sessionStorage.setItem('exam-type', preset.type);
      sessionStorage.setItem('exam-content', preset.content);
      sessionStorage.setItem('exam-questions', preset.questions.toString());
      sessionStorage.setItem('exam-time', preset.time.toString());
      sessionStorage.setItem('exam-id', preset.id.toString());
      sessionStorage.setItem('exam-level', config.level);

      // Chuẩn bị thông số bài thi để gửi đến API
      const examParams = {
        questionsCount: preset.questions,
        type: mapTypeToBackend(preset.type),
        content: mapContentToBackend(preset.content),
        duration: preset.time,
        level: config.level.toUpperCase() // Chuyển đổi level thành enum format (ví dụ: medium -> MEDIUM)
      };
      
      console.log('Sending exam parameters to API:', examParams);
      
      // Fetch examination from backend API with parameters
      const examination = await examinationService.startExamination(preset.id, examParams);
      setSelectedPresetId(preset.id.toString());

      // Use questions from the API response
      if (examination && examination.questions && examination.questions.length > 0) {
        console.log('Questions received from API:', examination.questions);
        
        // Transform API questions to frontend format
        const transformedQuestions = examination.questions.map((q: any) => ({
          id: q.id?.toString() || '',
          question: q.question || q.text || '',
          answers: q.options || q.answers || [],
          correctAnswer: '', // Will be filled after submission
          type: q.type || examination.type || preset.type,
          content: q.content || preset.content,
          questionId: q.questionId || q.id || 0,
        }));
        
        setSelectedQuestions(transformedQuestions);
        setExamConfig(config);
        setExamState('inProgress');
      } else {
        // No questions from API - show error
        console.error('No questions received from API');
        alert('Failed to load examination questions. Please try again.');
      }
    } catch (error) {
      console.error('Failed to start examination:', error);
      alert('Failed to start examination. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submitting an exam
  const handleSubmitExam = async (answers: { [key: string]: string }) => {
    try {
      setUserAnswers(answers);

      // If we have a real exam ID from the backend, submit to API
      const presetId = selectedPresetId;
      if (presetId) {
        // Calculate time spent (for now, use the full time - should implement actual tracking)
        const timeSpent = examConfig.timeInMinutes * 60;

        // Format the submission for the API
        const submission = {
          answers: answers,
          timeSpent: timeSpent
        };

        try {
          // Submit to API
          console.log('Submitting examination to API:', submission);
          const result = await examinationService.submitExamination(presetId, submission);
          console.log('API submission result:', result);

          if (result) {
            // Set the results
            setExamResults({
              score: result.score,
              totalQuestions: result.totalQuestions || selectedQuestions.length,
              correctAnswers: result.correctAnswers || 0,
              incorrectAnswers: (result.totalQuestions || selectedQuestions.length) - (result.correctAnswers || 0),
              skippedAnswers: selectedQuestions.length - Object.keys(answers).length,
              timeSpent: result.timeSpent || timeSpent,
            });
            setExamState('results');
          }
        } catch (error) {
          console.error('Failed to submit examination to API:', error);
          // Fall back to local calculation
          processExamLocally(answers);
        }
      } else {
        // Process exam results locally
        processExamLocally(answers);
      }
    } catch (error) {
      console.error('Error in handleSubmitExam:', error);
      alert('An error occurred while submitting your exam. Please try again.');
    }
  };

  // Process exam results locally when API is not available
  const processExamLocally = (answers: { [key: string]: string }) => {
    // Calculate results
    const totalQuestions = selectedQuestions.length;
    const answeredQuestions = Object.keys(answers).length;
    const skippedQuestions = totalQuestions - answeredQuestions;

    // In a real app, correctAnswers would be calculated by comparing to actual answers
    // Here we'll just use 70% of answered questions as correct for demonstration
    const correctAnswers = Math.round(answeredQuestions * 0.7);
    const incorrectAnswers = answeredQuestions - correctAnswers;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Set the results state
    setExamResults({
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedAnswers: skippedQuestions,
      timeSpent: examConfig.timeInMinutes * 60,
    });

    setExamState('results');
  };

  // Reset back to dashboard from results
  const handleRestartExam = () => {
    // Reset everything
    setExamState('dashboard');
    setUserAnswers({});
    setExamResults(null);
  };

  // Cancel an in-progress exam
  const handleCancelExam = () => {
    // Confirm before canceling
    if (window.confirm('Are you sure you want to cancel this exam? Your progress will be lost.')) {
      setExamState('dashboard');
      setUserAnswers({});
      setExamResults(null);
    }
  };

  // Switch to exam setup screen
  const handleStartTest = () => {
    setExamState('setup');
  };

  return (
    <div className="container mx-auto p-4">
      {examState === 'dashboard' && <ExaminationDashboard onStartTest={handleStartTest} />}

      {examState === 'setup' && (
        <ExamSetup
          isCustomExam={isCustomMode}
          setIsCustomExam={setIsCustomMode}
          type={examConfig.type}
          setType={(type) => setExamConfig({...examConfig, type})}
          content={examConfig.content}
          setContent={(content) => setExamConfig({...examConfig, content})}
          numberOfQuestions={examConfig.questionsCount}
          setNumberOfQuestions={(questionsCount) => setExamConfig({...examConfig, questionsCount})}
          time={examConfig.timeInMinutes}
          setTime={(timeInMinutes) => setExamConfig({...examConfig, timeInMinutes})}
          level={examConfig.level}
          setLevel={(level) => setExamConfig({...examConfig, level})}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
          isLoading={isLoading}
          handleStartExam={() => {
            // Start based on mode
            if (isCustomMode) {
              handleStartCustomExam(examConfig);
            } else {
              const selectedPreset = presetExams.find(p => p.id.toString() === selectedPresetId);
              if (selectedPreset) {
                handleStartPresetExam(selectedPreset);
              } else {
                console.error('No preset exam selected');
                alert('Please select a preset exam first');
              }
            }
          }}
          changePage={() => {/* Empty function, no longer needed */}}
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
