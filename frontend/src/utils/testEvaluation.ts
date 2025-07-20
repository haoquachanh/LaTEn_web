/**
 * Evaluates test score and returns appropriate feedback
 * @param score The score achieved
 * @param total The total possible score
 * @returns Object with status, emoji, title, and description
 */
export function evaluateScore(
  score: number,
  total: number,
): {
  status: 'excellent' | 'good' | 'needs-improvement';
  emoji: string;
  title: string;
  description: string;
} {
  const percentage = score / total;

  if (percentage >= 0.8) {
    return {
      status: 'excellent',
      emoji: '🎉',
      title: 'Excellent!',
      description: "Outstanding performance! You've mastered this topic.",
    };
  } else if (percentage >= 0.6) {
    return {
      status: 'good',
      emoji: '👍',
      title: 'Good Job!',
      description: 'Good work! Review the topics you missed and try again.',
    };
  } else {
    return {
      status: 'needs-improvement',
      emoji: '📚',
      title: 'Keep Learning!',
      description: "Don't worry! Practice makes perfect. Review the material and retake the test.",
    };
  }
}
