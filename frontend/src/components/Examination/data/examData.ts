import { ExamType, PresetExam, Subject } from '../types';

// Exam Types
export const examTypes: ExamType[] = [
  {
    id: 'multiple',
    label: 'Multiple Choice',
    icon: '/icons/testing.png',
    description: 'Choose from multiple options',
  },
  {
    id: 'truefalse',
    label: 'True or False',
    icon: '/icons/true-or-false.png',
    description: 'Simple true/false questions',
  },
  {
    id: 'short',
    label: 'Short Answer',
    icon: '/icons/form.png',
    description: 'Brief written responses',
  },
  // { id: 'essay', label: 'Essay', icon: '/icons/essay.png', description: 'Detailed written answers' },
];

// Subject Types
export const subjects: Subject[] = [
  { id: 'reading', label: 'Reading', color: 'accent' },
  { id: 'listening', label: 'Listening', color: 'accent' },
];

// Preset Exams
export const presetExams: PresetExam[] = [
  {
    id: 'preset1',
    title: 'Reading Comprehension',
    description: 'Standard reading comprehension test with multiple choice questions',
    type: 'multiple',
    questions: 20,
    questionsCount: 20,
    time: 30,
    content: 'reading',
  },
  {
    id: 'preset2',
    title: 'Grammar Quiz',
    description: 'Quick true/false grammar assessment',
    type: 'truefalse',
    questions: 15,
    questionsCount: 15,
    time: 15,
    content: 'reading',
  },
  {
    id: 'preset3',
    title: 'Listening Comprehension',
    description: 'Audio-based listening assessment with multiple choice questions',
    type: 'multiple',
    questions: 10,
    questionsCount: 10,
    time: 20,
    content: 'listening',
  },
  {
    id: 'preset4',
    title: 'Advanced Vocabulary',
    description: 'Vocabulary assessment with short answer format',
    type: 'short',
    questions: 25,
    questionsCount: 25,
    time: 40,
    content: 'reading',
  },
];
