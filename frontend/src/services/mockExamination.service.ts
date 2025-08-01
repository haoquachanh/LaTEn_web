'use client';

/**
 * Mock Examination Service
 *
 * This is a temporary service to simulate examination API calls
 * until the real backend is integrated. It works with the local storage
 * to maintain state between page reloads.
 */
import { Examination, ExaminationAnswer, ExaminationResult, ExaminationSubmission } from './types/examination.types';

class MockExaminationService {
  /**
   * Get examination by ID
   */
  async getExaminationById(id: number | string): Promise<Examination> {
    // Get stored examination config or use defaults
    const configStr = localStorage.getItem('currentExamConfig');
    const config = configStr
      ? JSON.parse(configStr)
      : {
          id: 'default',
          type: 'multiple',
          content: 'reading',
          questions: 10,
          time: 15,
          duration: 15,
        };

    // Create mock examination
    const examination: Examination = {
      id: String(id),
      title: `${config.content.charAt(0).toUpperCase() + config.content.slice(1)} ${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Exam`,
      description: `A ${config.time}-minute ${config.type} examination on ${config.content}`,
      duration: config.time, // duration in minutes
      type: config.type,
      content: config.content,
      questionsCount: config.questions,
      // Questions will be loaded separately
      questions: [],
    };

    return examination;
  }

  /**
   * Start an examination
   */
  async startExamination(id: number | string): Promise<Examination> {
    const examination = await this.getExaminationById(id);

    // Get sample questions from local storage if available
    const questionsStr = localStorage.getItem('sampleQuestions');
    const sampleQuestions = questionsStr ? JSON.parse(questionsStr) : [];

    // Use up to the configured number of questions
    examination.questions = sampleQuestions.slice(0, examination.questionsCount).map((q: any, index: number) => ({
      id: q.id || index + 1,
      question: q.question,
      options: q.answers || [],
      type: examination.type,
    }));

    return examination;
  }

  /**
   * Submit examination answers
   */
  async submitExamination(
    examinationId: string | number,
    submission: ExaminationSubmission,
  ): Promise<ExaminationResult> {
    // Get the exam
    const examination = await this.getExaminationById(examinationId);

    // Get sample questions to check correct answers
    const questionsStr = localStorage.getItem('sampleQuestions');
    const sampleQuestions = questionsStr ? JSON.parse(questionsStr) : [];

    // Calculate score (in a real app, this would be done on the server)
    let correctCount = 0;
    const answeredQuestions = submission.answers.length;

    submission.answers.forEach((answer: ExaminationAnswer) => {
      const question = sampleQuestions.find((q: any) => q.id === String(answer.questionId));
      if (question && String(answer.selectedOption) === question.correctAnswer) {
        correctCount++;
      }
    });

    // Calculate percentage score
    const scorePercentage = answeredQuestions > 0 ? Math.round((correctCount / answeredQuestions) * 100) : 0;

    // Create result object
    const result: ExaminationResult = {
      id: `result-${Date.now()}`,
      examinationId: String(examinationId),
      title: examination.title,
      score: scorePercentage,
      correctAnswers: correctCount,
      totalQuestions: examination.questionsCount || answeredQuestions,
      timeSpent: submission.timeSpent,
      completedAt: new Date().toISOString(),
      feedback: this.generateFeedback(scorePercentage),
    };

    // Store result in local storage for history
    const resultsStr = localStorage.getItem('examinationResults');
    const results = resultsStr ? JSON.parse(resultsStr) : [];
    results.push(result);
    localStorage.setItem('examinationResults', JSON.stringify(results));

    return result;
  }

  /**
   * Generate feedback based on score
   */
  private generateFeedback(score: number): string {
    if (score >= 90) {
      return 'Excellent! You have a strong understanding of the material.';
    } else if (score >= 70) {
      return 'Good job! You have a solid grasp of most concepts.';
    } else if (score >= 50) {
      return 'Fair. You understand some concepts but need more practice.';
    } else {
      return 'You need more practice with these concepts. Consider reviewing the material again.';
    }
  }
}

const mockExaminationService = new MockExaminationService();
export default mockExaminationService;
