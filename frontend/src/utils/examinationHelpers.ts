/**
 * Examination Utility Functions
 * Centralized helpers for examination logic
 */

/**
 * Calculate exam score percentage
 */
export const calculateScore = (correctAnswers: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Check if score passes threshold
 */
export const isPassingScore = (score: number, passingThreshold: number = 70): boolean => {
  return score >= passingThreshold;
};

/**
 * Get grade based on score
 */
export const getScoreGrade = (score: number): 'excellent' | 'good' | 'average' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  return 'poor';
};

/**
 * Get grade color for UI
 */
export const getGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    average: 'text-yellow-600',
    poor: 'text-red-600',
  };
  return colors[grade] || 'text-gray-600';
};

/**
 * Format time in seconds to MM:SS
 */
export const formatTimeRemaining = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Convert seconds to minutes (rounded up)
 */
export const secondsToMinutes = (seconds: number): number => {
  return Math.ceil(seconds / 60);
};

/**
 * Check if exam is expired
 */
export const isExamExpired = (startedAt: string, durationSeconds: number): boolean => {
  const startTime = new Date(startedAt).getTime();
  const expiryTime = startTime + durationSeconds * 1000;
  return Date.now() > expiryTime;
};

/**
 * Get remaining time for exam
 */
export const getRemainingTime = (startedAt: string, durationSeconds: number): number => {
  const startTime = new Date(startedAt).getTime();
  const expiryTime = startTime + durationSeconds * 1000;
  const remaining = Math.floor((expiryTime - Date.now()) / 1000);
  return Math.max(0, remaining);
};

/**
 * Validate exam configuration
 */
export const validateExamConfig = (config: {
  timeInMinutes: number;
  questionsCount: number;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (config.timeInMinutes < 5 || config.timeInMinutes > 180) {
    errors.push('Time must be between 5 and 180 minutes');
  }

  if (config.questionsCount < 1 || config.questionsCount > 100) {
    errors.push('Questions count must be between 1 and 100');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
