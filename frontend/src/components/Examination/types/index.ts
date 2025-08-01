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
  type: string;
  questions: number; // Number of questions in the exam
  questionsCount: number; // This is redundant but keeping for compatibility
  time: number; // in minutes
  content: string;
};
