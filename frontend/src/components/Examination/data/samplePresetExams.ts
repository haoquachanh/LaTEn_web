/**
 * Dữ liệu mẫu cho preset exams
 */
export const samplePresetExams = [
  {
    id: 1,
    title: 'Kiểm tra kiến thức cơ bản JavaScript',
    description: 'Bài kiểm tra kiến thức JavaScript cơ bản cho người mới bắt đầu',
    type: 'quiz',
    content: 'javascript',
    level: 'beginner',
    totalQuestions: 10,
    durationSeconds: 1200, // 20 phút
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 70,
      resultDisplay: {
        showImmediately: true,
        showCorrectAnswers: true,
        showExplanation: true,
        showScoreBreakdown: true,
      },
      security: {
        preventCopy: false,
        preventTabSwitch: false,
        timeoutWarning: 5,
        shuffleOptions: true,
      },
    },
    isActive: true,
    isPublic: true,
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // IDs của các câu hỏi
  },
  {
    id: 2,
    title: 'Kiến thức nâng cao về React',
    description: 'Bài kiểm tra kiến thức React nâng cao dành cho các lập trình viên frontend',
    type: 'exam',
    content: 'react',
    level: 'advanced',
    totalQuestions: 15,
    durationSeconds: 1800, // 30 phút
    config: {
      randomize: false,
      showCorrectAnswers: false,
      passingScore: 80,
      resultDisplay: {
        showImmediately: true,
        showCorrectAnswers: false,
        showExplanation: false,
        showScoreBreakdown: true,
      },
      security: {
        preventCopy: true,
        preventTabSwitch: true,
        timeoutWarning: 5,
        shuffleOptions: false,
      },
    },
    isActive: true,
    isPublic: false,
    questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], // IDs của các câu hỏi
  },
  {
    id: 3,
    title: 'Đánh giá kiến thức TypeScript',
    description: 'Bài kiểm tra toàn diện về TypeScript cho lập trình viên',
    type: 'assessment',
    content: 'typescript',
    level: 'intermediate',
    totalQuestions: 12,
    durationSeconds: 1500, // 25 phút
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 75,
      resultDisplay: {
        showImmediately: false,
        showCorrectAnswers: true,
        showExplanation: true,
        showScoreBreakdown: true,
      },
      security: {
        preventCopy: true,
        preventTabSwitch: false,
        timeoutWarning: 5,
        shuffleOptions: true,
      },
    },
    isActive: true,
    isPublic: true,
    questions: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], // IDs của các câu hỏi
  },
];
