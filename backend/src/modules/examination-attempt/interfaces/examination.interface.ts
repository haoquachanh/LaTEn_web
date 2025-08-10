export interface AnswerResponse {
  questionId: number;
  isCorrect: boolean;
  userAnswer: string | number | string[];
  correctAnswer?: string | number | string[];
  explanation?: string;
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
