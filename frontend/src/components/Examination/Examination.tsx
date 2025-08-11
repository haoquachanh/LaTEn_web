'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PresetExam } from './types';
import { sampleQuestions } from './data/sampleQuestions';
import { examTypes, subjects } from './data/examData';
import ExamSetup from './components/ExamSetup';
import ExamContainer from './components/ExamContainer';
import ExamResults from './components/ExamResults';
import ExaminationDashboard from './components/ExaminationDashboard';
import examinationAttemptService from '@/services/examination-attempt.service';
// Define examinationService as an alias to examinationAttemptService for legacy code
const examinationService = examinationAttemptService;

/**
 * Helper function to map frontend exam type to backend QuestionType enum
 */
const mapTypeToBackend = (type: string): string => {
  const typeMap: Record<string, string> = {
    'multiple-choice': 'MULTIPLE_CHOICE',
    'true-false': 'TRUE_FALSE',
    essay: 'ESSAY',
    'short-answer': 'SHORT_ANSWER',
  };
  return typeMap[type] || 'MULTIPLE_CHOICE';
};

/**
 * Helper function to map frontend content type to backend QuestionMode enum
 */
const mapContentToBackend = (content: string): string => {
  const contentMap: Record<string, string> = {
    reading: 'READING',
    listening: 'LISTENING',
  };
  return contentMap[content] || 'READING';
};

// Main Examination component that manages the overall exam flow
const Examination: React.FC = () => {
  // Exam state
  const [examState, setExamState] = useState<'dashboard' | 'setup' | 'inProgress' | 'results'>('dashboard');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [examConfig, setExamConfig] = useState({
    type: 'multiple',
    content: 'reading',
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
        const response = await examinationAttemptService.getExamTemplates();
        setPresetExams(response.data);
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

      // For this implementation, use API at http://localhost:3001/api/examinations/11
      // as requested by the user
      const examinationId = '11'; // Using the ID from the API sample provided
      console.log('Using examination ID:', examinationId);

      // Fetch examination from backend API
      const examination = await examinationService.startExamination(examinationId);
      setSelectedPresetId(examinationId);

      // Use questions from the API response
      if (examination && examination.questions && examination.questions.length > 0) {
        console.log('Questions received from API for custom exam:', examination.questions);

        // Transform API questions to frontend format
        const transformedQuestions = examination.questions.map((q: any) => {
          // Generate options based on question type
          let options = [];

          if (q.type === 'true_false') {
            options = ['true', 'false'];
          } else if (Array.isArray(q.options)) {
            options = q.options.map((opt: any) => opt.text || opt);
          }

          return {
            id: q.examinationQuestionId?.toString() || q.id.toString(),
            question: q.question || q.content || '',
            answers: options,
            correctAnswer: '', // Hide correct answer during exam
            type: q.type || '',
            content: q.mode || examination.content || config.content || 'reading',
            questionId: q.questionId || q.id || 0,
            examinationQuestionId: q.examinationQuestionId || q.id,
          };
        });

        // Update exam config with values from API
        const apiConfig = {
          type: examination.type || config.type,
          content: examination.content || examination.mode || config.content,
          timeInMinutes:
            examination.duration ||
            (examination.durationSeconds ? examination.durationSeconds / 60 : config.timeInMinutes),
          questionsCount: examination.totalQuestions || transformedQuestions.length,
          level: examination.level || config.level,
        };

        setSelectedQuestions(transformedQuestions);
        setExamConfig(apiConfig);
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

      // Create exam config from preset with default values for optional properties
      const config = {
        type: preset.type || 'multiple',
        content: preset.content || 'reading',
        timeInMinutes: preset.time || Math.ceil(preset.durationSeconds / 60),
        questionsCount: preset.questions || preset.totalQuestions,
        level: 'medium', // Default level for presets
      };

      // Store exam configuration in session storage for persistence
      sessionStorage.setItem('exam-type', config.type);
      sessionStorage.setItem('exam-content', config.content);
      sessionStorage.setItem('exam-questions', config.questionsCount.toString());
      sessionStorage.setItem('exam-time', config.timeInMinutes.toString());
      sessionStorage.setItem('exam-id', preset.id);
      sessionStorage.setItem('exam-level', config.level);

      // For this implementation, use API at http://localhost:3001/api/examinations/11
      // as requested by the user
      const examinationId = '11'; // Using the ID from the API sample provided
      console.log('Using examination ID:', examinationId);

      // Fetch examination from backend API
      const examination = await examinationService.startExamination(examinationId);
      setSelectedPresetId(examinationId);

      // Use questions from the API response
      if (examination && examination.questions && examination.questions.length > 0) {
        console.log('Questions received from API:', examination.questions);

        // Transform API questions to frontend format
        const transformedQuestions = examination.questions.map((q: any) => {
          // Generate options based on question type
          let options = [];

          if (q.type === 'true_false') {
            options = ['true', 'false'];
          } else if (Array.isArray(q.options)) {
            options = q.options.map((opt: any) => opt.text || opt);
          }

          return {
            id: q.id.toString() || q.examinationQuestionId.toString(),
            question: q.question || q.content || '',
            answers: options,
            correctAnswer: q.correctAnswer || '',
            type: q.type || '',
            content: q.mode || examination.content || 'reading',
            questionId: q.questionId || q.id || 0,
            examinationQuestionId: q.examinationQuestionId || q.id,
          };
        });

        // Update exam config with actual values from the API, ensuring all values have defaults
        const apiConfig = {
          type: examination.type || config.type || 'multiple',
          content: examination.content || examination.mode || config.content || 'reading',
          timeInMinutes:
            examination.duration ||
            (examination.durationSeconds ? Math.ceil(examination.durationSeconds / 60) : config.timeInMinutes || 30),
          questionsCount: examination.totalQuestions || transformedQuestions.length || 10,
          level: examination.level || config.level || 'medium',
        };

        setSelectedQuestions(transformedQuestions);
        setExamConfig(apiConfig);
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
          timeSpent: timeSpent,
        };

        try {
          // Submit to API - use completeExamination from examinationAttemptService
          console.log('Submitting examination to API:', submission);

          // Submit each answer before completing
          for (const questionId in answers) {
            await examinationService.submitAnswer(presetId, questionId, answers[questionId]);
          }

          // Complete the examination
          const result = await examinationService.completeExamination(presetId);
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
    setExamState('dashboard');
    setUserAnswers({});
    setExamResults(null);
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
          setType={(type) => setExamConfig({ ...examConfig, type })}
          content={examConfig.content}
          setContent={(content) => setExamConfig({ ...examConfig, content })}
          numberOfQuestions={examConfig.questionsCount}
          setNumberOfQuestions={(questionsCount) => setExamConfig({ ...examConfig, questionsCount })}
          time={examConfig.timeInMinutes}
          setTime={(timeInMinutes) => setExamConfig({ ...examConfig, timeInMinutes })}
          level={examConfig.level}
          setLevel={(level) => setExamConfig({ ...examConfig, level })}
          selectedPresetId={selectedPresetId}
          setSelectedPresetId={setSelectedPresetId}
          isLoading={isLoading}
          handleStartExam={() => {
            // Start based on mode
            if (isCustomMode) {
              handleStartCustomExam(examConfig);
            } else {
              const selectedPreset = presetExams.find((p) => p.id.toString() === selectedPresetId);
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
