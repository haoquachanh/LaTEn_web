/**
 * Sample Templates
 *
 * Dữ liệu mẫu cho PresetExam khi không có dữ liệu từ API hoặc đang trong quá trình phát triển
 */
import { PresetExam } from '../types';

export const sampleTemplates: PresetExam[] = [
  {
    id: '1',
    title: 'English Grammar Test - Basic Level',
    description: 'Test your basic English grammar knowledge with this quick assessment',
    totalQuestions: 10,
    durationSeconds: 600, // 10 minutes
    isActive: true,
    type: 'multiple',
    questions: 10,
    questionsCount: 10,
    time: 10,
    content: 'reading',
    level: 'beginner',
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 0.7,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'English Vocabulary - Intermediate Level',
    description: 'Assess your intermediate level English vocabulary skills',
    totalQuestions: 15,
    durationSeconds: 900, // 15 minutes
    isActive: true,
    type: 'multiple',
    questions: 15,
    questionsCount: 15,
    time: 15,
    content: 'reading',
    level: 'intermediate',
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 0.7,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'TOEFL Reading Practice',
    description: 'Practice with TOEFL-style reading comprehension questions',
    totalQuestions: 20,
    durationSeconds: 1800, // 30 minutes
    isActive: true,
    type: 'multiple',
    questions: 20,
    questionsCount: 20,
    time: 30,
    content: 'reading',
    level: 'advanced',
    config: {
      randomize: false,
      showCorrectAnswers: true,
      passingScore: 0.7,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'English Listening Comprehension',
    description: 'Test your English listening skills with audio-based questions',
    totalQuestions: 10,
    durationSeconds: 1200, // 20 minutes
    isActive: true,
    type: 'multiple',
    questions: 10,
    questionsCount: 10,
    time: 20,
    content: 'listening',
    level: 'intermediate',
    config: {
      randomize: false,
      showCorrectAnswers: true,
      passingScore: 0.6,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Mixed English Skills Assessment',
    description: 'Comprehensive test covering grammar, vocabulary and reading',
    totalQuestions: 30,
    durationSeconds: 2700, // 45 minutes
    isActive: true,
    type: 'multiple',
    questions: 30,
    questionsCount: 30,
    time: 45,
    content: 'reading',
    level: 'intermediate',
    config: {
      randomize: true,
      showCorrectAnswers: true,
      passingScore: 0.7,
      categoriesDistribution: [
        { categoryId: 1, count: 10 }, // Grammar
        { categoryId: 2, count: 10 }, // Vocabulary
        { categoryId: 3, count: 10 }, // Reading
      ],
    },
    createdAt: new Date().toISOString(),
  },
];
