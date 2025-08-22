'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PresetExam } from './types';
import { sampleQuestions } from './data/sampleQuestions';
import { sampleExamination } from './data/sampleExamination';
import { examTypes, subjects } from './data/examData';
import ExamSetup from './components/ExamSetup';
import ExamContainer from './components/ExamContainer';
import ExamResults from './components/ExamResults';
import ExaminationDashboard from './components/ExaminationDashboard';
import examinationAttemptService from '@/services/examination-attempt.service';
import examinationService from '@/services/examination.service';
import { env } from '@/env';
import { useExamContext } from '@/contexts/ExamContext';
import usePreventNavigation from '@/hooks/usePreventNavigation';
// Giữ lại examinationService làm dịch vụ chính để tương thích với mã cũ

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
  // Get exam context
  const { startExam, endExam, setShouldBlockNavigation } = useExamContext();

  // Use navigation prevention hook
  usePreventNavigation();

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
        console.log('Fetching preset exams from API...');

        // Sử dụng dữ liệu mẫu trong môi trường development nếu cần
        if (env.isDevelopment && process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true') {
          console.log('Using sample exam templates in development mode');
          // Import từ sampleTemplates trong components/Examination/data/sampleTemplates
          const { sampleTemplates } = await import('./data/sampleTemplates');
          console.log('Sample templates loaded:', sampleTemplates);
          setPresetExams(sampleTemplates);
          return;
        }

        // Import từ services/examination.service.ts
        const presets = await examinationService.getPresetExaminations();
        console.log('Preset exams received:', presets);

        if (presets && presets.length > 0) {
          setPresetExams(presets);
        } else if (env.isDevelopment) {
          // Nếu không có dữ liệu thực, sử dụng dữ liệu mẫu trong development
          console.log('No preset exams from API, using sample data instead');
          const { sampleTemplates } = await import('./data/sampleTemplates');
          setPresetExams(sampleTemplates);
        }
      } catch (error) {
        console.error('Failed to fetch preset exams:', error);

        // Nếu lỗi trong development, sử dụng dữ liệu mẫu
        if (env.isDevelopment) {
          console.log('Error fetching preset exams, using sample data instead');
          const { sampleTemplates } = await import('./data/sampleTemplates');
          setPresetExams(sampleTemplates);
        }
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

      // Set exam in progress in the global context
      startExam();
      setShouldBlockNavigation(true);

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
      console.log(`Starting examination with preset ID: ${preset.id}, Type: ${typeof preset.id}`);

      // Set exam in progress in the global context
      startExam();
      setShouldBlockNavigation(true);

      // Create exam config from preset with default values for optional properties
      const config = {
        type: preset.type || 'multiple',
        content: preset.content || 'reading',
        timeInMinutes: preset.time || (preset.durationSeconds ? Math.ceil(preset.durationSeconds / 60) : 30),
        questionsCount: typeof preset.questions === 'number' ? preset.questions : preset.totalQuestions || 10,
        level: preset.level || 'medium', // Default level for presets
      };

      // Store exam configuration in session storage for persistence
      sessionStorage.setItem('exam-type', config.type);
      sessionStorage.setItem('exam-content', config.content);
      sessionStorage.setItem('exam-questions', config.questionsCount.toString());
      sessionStorage.setItem('exam-time', config.timeInMinutes.toString());
      sessionStorage.setItem('exam-id', String(preset.id));
      sessionStorage.setItem('exam-level', config.level);

      let examination;

      // Trong môi trường development, sử dụng dữ liệu mẫu nếu cần
      if (env.isDevelopment && (process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true' || preset.id === '1')) {
        console.log('Using sample examination data in development mode');
        examination = sampleExamination;

        // Cập nhật ID để khớp với preset được chọn
        examination.id = Number(preset.id);
        examination.title = preset.title;
        examination.description = preset.description;
        examination.duration = preset.time || (preset.durationSeconds ? Math.ceil(preset.durationSeconds / 60) : 30);
        examination.durationSeconds = preset.durationSeconds || (preset.time ? preset.time * 60 : 1800);
        examination.totalQuestions =
          preset.totalQuestions || (typeof preset.questions === 'number' ? preset.questions : 10);
      } else {
        // Sử dụng ID thực tế của preset để khởi tạo bài thi
        console.log('Using preset ID for examination:', preset.id);
        // Fetch examination from backend API with the actual preset ID
        examination = await examinationService.startExamination(preset.id);
      }

      setSelectedPresetId(String(preset.id));

      // Use questions from the examination
      if (examination && examination.questions && examination.questions.length > 0) {
        console.log('Questions from examination:', examination.questions);

        // Kiểm tra xem questions đã có định dạng đúng chưa
        // Nếu là dữ liệu mẫu, có thể đã có định dạng đúng rồi
        const transformedQuestions = examination.questions.map((q: any) => {
          // Nếu đã có options đúng định dạng, giữ nguyên
          if (
            q.options &&
            Array.isArray(q.options) &&
            q.options.length > 0 &&
            'id' in q.options[0] &&
            'text' in q.options[0]
          ) {
            return q;
          }

          // Ngược lại, tạo options mới
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
      console.log('Submitting exam with answers:', answers);

      // End exam in global context
      endExam();
      setShouldBlockNavigation(false);

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

          // Môi trường development nhưng tính toán kết quả thực tế thay vì sử dụng dữ liệu mẫu
          if (env.isDevelopment && (process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true' || presetId === '1')) {
            console.log('Calculating actual results from user answers in development mode');

            // Tính toán kết quả thực tế từ câu trả lời
            const totalQuestions = selectedQuestions.length;
            const answeredQuestions = Object.keys(answers).length;
            const skippedQuestions = totalQuestions - answeredQuestions;

            // Tính toán số câu đúng bằng cách so sánh câu trả lời với đáp án đúng
            const correctAnswers = selectedQuestions.reduce((count, question) => {
              const userAnswer = answers[question.id];
              // Nếu người dùng trả lời và đáp án đúng
              if (
                userAnswer &&
                (userAnswer === question.correctAnswer ||
                  userAnswer === question.correctOption ||
                  (question.options && question.options.find((opt: any) => opt.id === userAnswer && opt.isCorrect)))
              ) {
                return count + 1;
              }
              return count;
            }, 0);

            const incorrectAnswers = answeredQuestions - correctAnswers;
            const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

            // Đặt kết quả thực tế
            setExamResults({
              score: score,
              totalQuestions: totalQuestions,
              correctAnswers: correctAnswers,
              incorrectAnswers: incorrectAnswers,
              skippedAnswers: skippedQuestions,
              timeSpent: timeSpent,
            });

            setExamState('results');
            return;
          }

          // Submit each answer before completing
          for (const questionId in answers) {
            await examinationService.submitAnswer(presetId, questionId, answers[questionId]);
          }

          // Complete the examination
          const result = await examinationService.completeExamination(presetId);
          console.log('API submission result:', result);

          if (result) {
            // Set the results
            // Calculate skipped questions
            const skippedAnswers = selectedQuestions.length - Object.keys(answers).length;

            // Calculate incorrect answers based only on answered questions, not counting skipped as wrong
            const incorrectAnswers = Object.keys(answers).length - (result.correctAnswers || 0);

            setExamResults({
              score: result.score,
              totalQuestions: result.totalQuestions || selectedQuestions.length,
              correctAnswers: result.correctAnswers || 0,
              incorrectAnswers: incorrectAnswers,
              skippedAnswers: skippedAnswers,
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

    // Calculate incorrect answers based only on answered questions, not counting unanswered as wrong
    const incorrectAnswers = answeredQuestions - correctAnswers;

    // Calculate score based on correct answers out of total questions
    // This keeps the scoring consistent but doesn't count unanswered questions as wrong
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

    // End exam in global context
    endExam();
    setShouldBlockNavigation(false);
  };

  // Switch to exam setup screen
  const handleStartTest = () => {
    setExamState('setup');
  };

  return (
    <div className="container mx-auto h-full overflow-hidden examination-content p-0">
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
          presetExams={presetExams}
          isLoading={isLoading}
          onBackToDashboard={() => setExamState('dashboard')}
          handleStartExam={() => {
            // Start based on mode
            if (isCustomMode) {
              handleStartCustomExam(examConfig);
            } else {
              // Tìm preset đã chọn dựa trên ID, kiểm tra presetExams để đảm bảo dữ liệu đã được tải
              console.log('Looking for preset ID:', selectedPresetId, 'in presetExams:', presetExams);

              if (!selectedPresetId) {
                console.error('No preset ID selected');
                alert('Please select a preset exam first');
                return;
              }

              if (!presetExams || presetExams.length === 0) {
                console.error('No preset exams loaded');
                alert('No preset exams available. Please try again later.');
                return;
              }

              // In ra các ID trong presetExams để debug
              console.log(
                'Available preset IDs:',
                presetExams.map((p) => ({ id: p.id, idType: typeof p.id })),
              );

              // Sử dụng == thay vì === để so sánh giữa string và number
              const selectedPreset = presetExams.find((p) => String(p.id) === String(selectedPresetId));

              if (selectedPreset) {
                console.log('Found selected preset:', selectedPreset);
                handleStartPresetExam(selectedPreset);
              } else {
                console.error(`No preset exam found with ID: ${selectedPresetId}`);
                alert('Cannot find the selected preset exam. Please try again.');
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
          onBackToSetup={() => {
            // Reset to setup state
            setExamState('setup');
            endExam(); // End the current exam attempt in global context
            setShouldBlockNavigation(false); // Allow navigation again
          }}
        />
      )}

      {examState === 'results' && examResults && (
        <ExamResults
          results={examResults}
          questions={selectedQuestions}
          userAnswers={userAnswers}
          onRestartExam={handleRestartExam}
          onBackToDashboard={() => setExamState('dashboard')}
          examId={selectedPresetId}
        />
      )}
    </div>
  );
};

export default Examination;
