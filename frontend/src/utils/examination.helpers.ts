import {
  ExaminationResultApiResponse,
  TemplateApiResponse,
  QuestionApiResponse,
  ExaminationApiResponse,
} from '@/types/examination-api.types';
import { ExaminationResult, Examination } from '@/services/types/examination.types';
import { PresetExam } from '@/components/Examination/types';

export const normalizeScore = (score: number | null | undefined): number => {
  if (score === null || score === undefined) return 0;
  return score * 10;
};

export const parseId = (id: number | string): number => {
  if (typeof id === 'number') return id;
  const n = Number(id);
  return Number.isNaN(n) ? 0 : n;
};

export const mapTemplateToPresetExam = (template: TemplateApiResponse): PresetExam => ({
  id: String(template.id),
  title: template.title,
  description: template.description ?? '',
  totalQuestions: template.totalQuestions ?? 0,
  durationSeconds: template.durationSeconds ?? 0,
  isActive: template.isActive ?? false,
  type: 'multiple',
  questionsCount: template.totalQuestions ?? 0,
  time: Math.ceil((template.durationSeconds ?? 0) / 60),
  content: 'reading',
  config: template.config,
  createdAt: template.createdAt,
});

export const mapExaminationApiToExamination = (data: ExaminationApiResponse): Examination => {
  // Minimal mapping; callers may augment fields as needed
  return {
    id: data.id,
    title: data.title,
    description: data.description ?? '',
    durationSeconds: data.durationSeconds ?? 3600,
    duration: Math.ceil((data.durationSeconds ?? 3600) / 60),
    totalQuestions: data.totalQuestions ?? 0,
    type: data.type ?? 'multiple',
    content: data.content ?? 'reading',
    level: data.level ?? 'medium',
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
    startedAt: data.startedAt,
    completedAt: data.completedAt,
    questions: (data.questions ?? []).map((q: QuestionApiResponse) => ({
      id: String(q.id),
      question: q.content ?? '',
      text: q.content ?? '',
      content: q.content ?? '',
      options: q.options ?? [],
      correctOption: q.correctOption,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation ?? '',
      type: q.type ?? 'multiple_choice',
      mode: q.mode ?? 'text',
      format: q.format ?? 'text',
      difficultyLevel: q.difficultyLevel ?? q.difficulty ?? 'medium',
      difficulty: q.difficulty ?? q.difficultyLevel ?? 'medium',
      points: q.points ?? 1,
      audioUrl: q.audioUrl ?? null,
    })),
  } as Examination;
};

export const mapExaminationResultApiToResult = (r: ExaminationResultApiResponse): ExaminationResult => ({
  id: r.id,
  score: normalizeScore(r.score),
  totalQuestions: r.totalQuestions,
  correctAnswers: r.correctAnswers,
  incorrectAnswers: (r.totalQuestions ?? 0) - (r.correctAnswers ?? 0),
  skippedAnswers: r.skippedAnswers ?? 0,
  timeSpent: r.timeSpent ?? 0,
  isPassed: r.isPassed,
  percentage: normalizeScore(r.score),
  completedAt: r.completedAt,
  updatedAt: r.updatedAt ?? new Date().toISOString(),
  examination: r.examination as any,
});
