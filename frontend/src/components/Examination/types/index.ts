export type Question = {
  id: string;
  question: string;
  answers?: string[];
  correctAnswer: string;
  type: string;
  content: string;
};

export type ExamType = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

export type Subject = {
  id: string;
  label: string;
  color: string;
};

export type PresetExam = {
  id: string;
  title: string;
  description: string;
  totalQuestions: number; // Số lượng câu hỏi trong bài thi
  durationSeconds: number; // Thời gian làm bài tính theo giây
  isActive: boolean;
  // Các field phụ để tương thích với UI
  type?: string;
  questions?: number; // Giữ lại để tương thích với UI cũ
  questionsCount?: number; // Giữ lại để tương thích với UI cũ
  time?: number; // Giữ lại để tương thích với UI cũ (phút)
  content?: string;
  level?: string;
  config?: {
    randomize?: boolean;
    showCorrectAnswers?: boolean;
    passingScore?: number;
    categoriesDistribution?: { categoryId: number; count: number }[];
  };
  createdAt?: string;
  updatedBy?: {
    id: string;
    email: string;
  };
};
