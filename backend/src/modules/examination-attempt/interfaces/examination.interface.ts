export interface AnswerResponse {
  questionId: number;
  isCorrect: boolean | null;
  userAnswer: string | number | string[] | null;
  correctAnswer?: string | number | string[] | null;
  explanation?: string | null;
  examinationCompleted?: boolean;
  message?: string;
  summary?: ExaminationSummary;
}

export interface ExaminationSummary {
  id: number;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds: number;
  timeSpent?: number; // in seconds
}
